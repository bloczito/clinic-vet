from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.dispatch import receiver
from django.conf.global_settings import EMAIL_HOST_USER
from django.core.mail import send_mail


class CustomUserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """

    def create_user(self, email, password, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    # delete username field and use email as the PK instead
    username = None
    email = models.EmailField(unique=True)
    # the model contains the rest of default fields
    # https://docs.djangoproject.com/en/4.0/ref/contrib/auth/#django.contrib.auth.models.User
    # is_staff GIVES ACCESS TO ADMIN PANEL IT IS NOT THE SAME AS is_doctor
    is_doctor = models.BooleanField(default=False)

    # treat email as username field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class Species(models.Model):
    name = models.CharField(max_length=150)
    is_custom = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.id} - {self.name}"


# dummy animal model, extend later
class Animal(models.Model):
    name = models.CharField(max_length=150)
    species = models.ForeignKey(Species, on_delete=models.CASCADE, null=True)
    race = models.CharField(max_length=150, null=True)
    gender = models.CharField(max_length=150, null=True)
    weight = models.IntegerField(null=True)
    height = models.IntegerField(null=True)
    date_of_birth = models.DateTimeField(null=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.id} - {self.name}"


class Visit(models.Model):
    date = models.DateTimeField()
    doctor = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    animal = models.ForeignKey(Animal, on_delete=models.CASCADE, blank=True, null=True)
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f'{self.doctor.email} {self.date}'


# trzeba otrzymac email uzytkownika a nie doktora
@receiver(models.signals.post_delete, sender=Visit)
def email_post_delete(sender, instance, *args, **kwargs):
    if instance.doctor.email:
        subject = "Odłowanie wizyty"
        message = """Poniższa wiadomość została wygenerowana automatycznie. 
                                    Prosimy na nią nie odpowiadać.

                         Witaj,

                         Informujemy o anulowaniu wizyty!

                         Pozdrawiamy
                         Zespół VetClinic"""
        sender = EMAIL_HOST_USER

        receiver = list([instance.doctor.email])
        fail_silently = False
        try:
            send_mail(subject, message, sender, receiver, fail_silently)
        except Exception:
            print("There is no e-mail like that")



