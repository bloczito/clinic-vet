from __future__ import annotations

from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, JsonResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError

import json
from json import JSONDecodeError
import datetime
from datetime import date

from .models import CustomUser, Visit, Animal, Species
from .forms import LoginForm


# Create your views here.


@csrf_exempt
def register_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            firstName = data.get('firstName', "Anonim")
            lastName = data.get('lastName', "Anonim")
            email = data['email']
            password = data['password']
            if CustomUser.objects.filter(email=email).exists():
                return JsonResponse({'success': False, 'error': 'Email exists'}, status=409)
        except JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid body'}, status=400)
        except KeyError:
            return JsonResponse({'success': False, 'error': 'Invalid body'}, status=400)

        try:
            user = CustomUser.objects.create_user(
                email=email,
                password=password,
                first_name=firstName,
                last_name=lastName
            )
            if user is not None:
                user.save()
                return JsonResponse({'success': True})
        except IntegrityError:
            # print('Error: Email exist in database')
            return JsonResponse({'success': False, 'error': 'User already exist'}, status=500)


# temporary frontpage as the default one doesn't work
@csrf_exempt
def frontpage_view(request):
    return HttpResponse('''
    /admin admin@admin.com:admin <br>
    /login <br>
    magdalena@stefanowicz.com:MagdalenaStefanowicz123 <br>
    dariusz@koczur.com:DariuszKoczur123 <br>
    agnieszka@adamczyk.com:AgnieszkaAdamczyk123 <br>
    adamnowak@gmail.com:AdamNowak123 <br>
    ''')


@csrf_exempt
def login_view(request):
    form = None
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data['email']
        password = data['password']
        # print(f'{username} : {password}')
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            # print('Login successful')
            if user.is_doctor:
                is_doctor = True
            else:
                is_doctor = False
            return JsonResponse({'success': True, 'isDoctor': str(is_doctor)})
        else:
            # print('Login failed')
            return JsonResponse({'success': False, 'error': 'Username and password combination incorrect'}, status=401)


# TODO: Remove later
@csrf_exempt
def loggedin_view(request):
    return render(request, 'logged_in.html')


@csrf_exempt
def logout_view(request):
    # print('Loging out')
    logout(request)
    return JsonResponse({'success': True})


@csrf_exempt
def add_visits_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            date_from = [int(x) for x in data['dateFrom'].split('-')]
            date_to = [int(x) for x in data['dateTo'].split('-')]
            time_from = [int(x) for x in data['timeFrom'].split(':')]
            time_to = [int(x) for x in data['timeTo'].split(':')]
            doctor_id = request.user.id
            visit_time = int(data['visitTime'])
            break_time = int(data['breakTime'])

            repeat = data['repeatEvery']
            for i in range(len(repeat)):
                if repeat[i].lower() == 'monday':
                    repeat[i] = 0
                elif repeat[i].lower() == 'tuesday':
                    repeat[i] = 1
                elif repeat[i].lower() == 'wednesday':
                    repeat[i] = 2
                elif repeat[i].lower() == 'thursday':
                    repeat[i] = 3
                elif repeat[i].lower() == 'friday':
                    repeat[i] = 4
                elif repeat[i].lower() == 'saturday':
                    repeat[i] = 5
                elif repeat[i].lower() == 'sunday':
                    repeat[i] = 6
                else:
                    return JsonResponse({'success': False, 'error': 'Invalid weekday'}, status=400)
        except JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid body'}, status=400)
        except KeyError:
            return JsonResponse({'success': False, 'error': 'Invalid body'}, status=400)

        start_date = datetime.date(date_from[0], date_from[1], date_from[2])
        try:
            end_date = datetime.date(date_to[0], date_to[1], date_to[2] + 1)
        except ValueError:
            if date_to[1] == 12:
                end_date = datetime.date(date_to[0] + 1, 1, 1)
            else:
                end_date = datetime.date(date_to[0], date_to[1] + 1, 1)

        date_range = end_date - start_date

        try:
            doctor = CustomUser.objects.get(id=doctor_id)
        except ObjectDoesNotExist:
            return JsonResponse({'success': False, 'error': 'Wrong doctor id'}, status=400)
        if not doctor.is_doctor:
            return JsonResponse({'success': False, 'error': 'User with this id is not a doctor'}, status=400)

        for i in range(date_range.days):
            date = start_date + datetime.timedelta(days=i)
            if date.weekday() not in repeat:
                continue

            minutes = time_from[1]
            if time_from[0] != time_to[0]:
                for hour in range(time_from[0], time_to[0] + 1):
                    while minutes < 60:
                        if hour == time_to[0]:
                            if minutes > time_to[1]:
                                break
                        date_time = datetime.datetime(year=date.year, month=date.month, day=date.day,
                                                      hour=hour, minute=minutes)

                        visit_window = datetime.datetime(year=date.year, month=date.month, day=date.day,
                                                         hour=hour + 1, minute=visit_time + break_time)

                        visit = Visit.objects.filter(
                            doctor_id=doctor_id
                        ).filter(
                            date__gte=date_time
                        ).filter(
                            date__lte=visit_window
                        )

                        if not visit:
                            # print(f'Adding {date_time}')
                            visit = Visit.objects.create(date=date_time, doctor=doctor)
                            visit.save()

                        minutes += visit_time + break_time
                    minutes -= 60
            else:
                while minutes < time_to[1]:
                    date_time = datetime.datetime(year=date.year, month=date.month, day=date.day,
                                                  hour=time_from[0], minute=minutes)

                    visit_window = datetime.datetime(year=date.year, month=date.month, day=date.day,
                                                     hour=time_from[0] + 1, minute=visit_time + break_time)

                    visit = Visit.objects.filter(
                        doctor_id=doctor_id
                    ).filter(
                        date__gte=date_time
                    ).filter(
                        date__lte=visit_window
                    )

                    if not visit:
                        # print(f'Adding {date_time}')
                        visit = Visit.objects.create(date=date_time, doctor=doctor)
                        visit.save()
                    # else:
                        # print(f'Skipping {date_time}')

                    minutes += visit_time + break_time

        return JsonResponse({'success': True})


@csrf_exempt
def get_visits_view(request, doctor_id):
    try:
        CustomUser.objects.get(id__exact=doctor_id)
    except ObjectDoesNotExist:
        return JsonResponse({'success': False, 'error': 'Wrong doctor id'}, status=400)

    if request.method == 'GET':
        try:
            date_from = [int(x) for x in request.GET.get("from").split('-')]
            date_to = [int(x) for x in request.GET.get("to").split('-')]
            # doctor_id = int(data['doctorId'])
        except JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid body'}, status=400)
        except KeyError:
            return JsonResponse({'success': False, 'error': 'Invalid body'}, status=400)

        start_date = datetime.date(date_from[0], date_from[1], date_from[2])
        end_date = datetime.date(date_to[0], date_to[1], date_to[2])

        # visits = None
        # try:
        #     if request.user.is_doctor:
        #         visits = Visit.objects.filter(
        #             doctor=doctor_id
        #         ).filter(
        #             date__gte=start_date
        #         ).filter(
        #             date__lt=end_date
        #         ).exclude(
        #             animal_id=None
        #         )
        # # TODO: Only serve logged in users?
        # except AttributeError:
        #     pass  # pass this if when user is not authenticated

        # if visits is None:
        visits = Visit.objects.filter(
            doctor_id=doctor_id
        ).filter(
            date__gte=start_date
        ).filter(
            date__lte=end_date
        ).filter(
            animal_id=None
        )

        data = list(visits.values())
        return JsonResponse(data, safe=False)


@csrf_exempt
def get_scheduled_visits_view(request):
    if request.method == 'GET':
        if request.user.is_doctor:
            try:
                date = datetime.date(*map(int, request.GET.get("date", default=str(datetime.date.today())).split('-')))

            except JSONDecodeError:
                return JsonResponse({'error': 'Invalid body'}, status=400)
            except KeyError:
                return JsonResponse({'error': 'Invalid body'}, status=400)

            visits = Visit.objects.select_related("animal") \
                .filter(doctor=request.user.id) \
                .filter(date__range=[date, date + datetime.timedelta(days=1)]) \
                .exclude(animal_id=None) \
                .values()

            visits = list(visits)
            animal_ids = [x["animal_id"] for x in visits]

            animals = list(Animal.objects.filter(pk__in=animal_ids).values())

            for v in visits:
                v["animal"] = find_animal(animals, v["animal_id"])

            return JsonResponse(visits, safe=False)
        else:
            animals = list(Animal.objects.filter(user=request.user).values())
            visits = Visit.objects.select_related("animal") \
                .filter(animal__in=[x["id"] for x in animals]) \
                .filter(date__gte=datetime.date.today()) \
                .order_by("date") \
                .values()

            visits = list(visits)

            for v in visits:
                v["animal"] = find_animal(animals, v["animal_id"])
            return JsonResponse(list(visits), safe=False, status=200)


@csrf_exempt
def get_doctors_view(request):
    if request.method == 'GET':
        doctors = CustomUser.objects.filter(is_doctor=True)

        return JsonResponse([{'id': x.id, 'name': f'{x.first_name} {x.last_name}'} for x in doctors], safe=False)


@csrf_exempt
def add_animal_view(request):
    if request.method == "POST":
        try:
            # print(request.body)
            body = json.loads(request.body)

            res = check_if_all_not_none(body, ["name", "weight", "height", "dateOfBirth"])
            if type(res) is str:
                return JsonResponse({"message": res}, status=400)

            animal = Animal.objects.create(
                name=body["name"],
                weight=float(body["weight"]),
                height=float(body["height"]),
                user=request.user
            )
            # print(type(body))

            if is_not_none(body, "speciesId"):
                animal.species_id = int(body["speciesId"])
                if int(body["speciesId"]) == 1 and is_not_none(body, "additionalSpecies"):
                    new_species = Species.objects.create(
                        name=body["additionalSpecies"],
                        is_custom=True
                    )
                    # new_species.save()
                    animal.species_id = new_species.id
                else:
                    animal.species_id = int(body["speciesId"])

            if is_not_none(body, "race"):
                animal.race = body["race"]

            if is_not_none(body, "dateOfBirth"):
                animal.date_of_birth = date(*map(int, body["dateOfBirth"].split('-')))

            animal.save()
            return JsonResponse({"message": "Created"}, status=201)
        except JSONDecodeError:
            return JsonResponse({"message": "Invalid body"}, status=400)


@csrf_exempt
def delete_animal_view(request: HttpRequest, id: int):
    if request.method == "DELETE":
        try:
            animal = Animal.objects.get(id=id)
            animal.is_deleted = True
            animal.save()
            return JsonResponse(animal.id, safe=False, status=200)
        except:
            return JsonResponse({"message": "delete error"}, safe=False, status=400)


@csrf_exempt
def edit_visit_view(request: HttpRequest, visit_id: int) -> JsonResponse:
    if request.method == "PUT":
        try:
            animalId = json.loads(request.body)["petId"]

            visit = Visit.objects.get(pk=visit_id)

            if visit.animal is not None:
                return JsonResponse({"error": "Visit is already booked"}, status=400)

            visit.animal_id = animalId
            visit.save()

            return JsonResponse({"status": "Booked"}, status=200)
        except KeyError as e:
            return JsonResponse({"error": "Missing required field: petId"}, status=400)

    elif request.method == "DELETE":
        if request.user.is_doctor:
            Visit.objects.filter(id=visit_id).delete()
            return JsonResponse({"status": "Canceled"}, status=200)
        else:
            visit = Visit.objects.get(pk=visit_id)
            visit.animal = None
            visit.save()
            return JsonResponse({"status": "Canceled"}, status=200)


def check_if_all_not_none(body, fields) -> str | bool:
    for x in fields:
        try:
            if body[x] is None:
                return f"Required field is empty: {x}"
        except KeyError:
            return f"Missing required field: {x}"

    return True


def is_not_none(dict, field):
    return True if field in dict.keys() and dict[field] is not None else False


def find_animal(list, id):
    for x in list:
        if x["id"] == id: return x

    return None


@login_required
@csrf_exempt
def get_animal_view(request):
    if request.method == 'GET':
        user_animals = Animal.objects.filter(user=request.user, is_deleted=False)

        return JsonResponse([{
            'id': x.id,
            'name': x.name,
            'species': x.species.name if x.species is not None else None,
            'race': x.race,
            'weight': x.weight,
            'height': x.height,
            'dateOfBirth': x.date_of_birth,
        } for x in user_animals], safe=False, status=200)


@csrf_exempt
def get_treatment_history(request: HttpRequest,) -> JsonResponse:
    if request.method == 'GET':
        animals = list(Animal.objects.filter(user=request.user).values())

        visists = Visit.objects.select_related("animal").filter(
            animal_id__in=[x["id"] for x in animals]
        ).filter(
            date__lte=datetime.datetime.now()
        ).order_by("-date").values()

        visists = list(visists)

        animal_ids = [x["animal_id"] for x in visists]

        animals = list(Animal.objects.filter(pk__in=animal_ids).values())

        for v in visists:
            v["animal"] = find_animal(animals, v["animal_id"])


        if not visists:
            return JsonResponse({'message': 'no visits found'}, status=404)
        return JsonResponse(visists, safe=False)


@csrf_exempt
def add_note_view(request: HttpRequest, visit_id: int) -> JsonResponse:
    if request.method == 'POST':
        visit = Visit.objects.filter(pk=visit_id)
        if not visit:
            return JsonResponse({'error': 'Visit with this id does not exist!'}, status=400)

        note = json.loads(request.body)['note']
        visit[0].note = note
        visit[0].save()
        return JsonResponse({'message': 'Note added successfully'})


@csrf_exempt
def get_species_view(request):
    if request.method == 'GET':
        species = Species.objects.filter(is_custom=False)

        if species is None:
            return JsonResponse({'error': 'Spiecies table is empty'}, status=404)

        return JsonResponse(list(species.values()), safe=False)


@csrf_exempt
def delete_user_view(request: HttpRequest):
    if request.user is None:
        return JsonResponse({"message: User not found"}, safe=False, status=400)
    if request.method == "DELETE":
        try:
            user = CustomUser.objects.get(id=request.user.id)
            if not user.is_active:
                return JsonResponse({"message": "User is not active"}, safe=False, status=400)
            else:
                user.is_active = False
                user.save()

                animals = list(Animal.objects.filter(user=user).values())
                visits = list(Visit.objects.filter(animal_id__in=[x["id"] for x in animals]))

                for v in visits:
                    v.animal = None

                Visit.objects.bulk_update(visits, ["animal"])
                return JsonResponse(user.id, safe=False, status=200)
        except:
            return JsonResponse({"message": "delete error"}, safe=False, status=400)


@csrf_exempt
def change_password_view(request: HttpRequest) -> JsonResponse:
    if request.user is None:
        return JsonResponse({}, status=401)

    if request.method == "PUT":
        password = json.loads(request.body)["password"]

        user = request.user
        user.set_password(password)
        user.save()


        return JsonResponse({"message": "Password changed!"}, status=200)


