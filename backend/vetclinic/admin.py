from django.contrib import admin
from .models import CustomUser, Animal, Visit, Species


class VisitAdmin(admin.ModelAdmin):
    list_display = ['id', 'doctor_id', 'animal_id', 'date']
    ordering = ['date']


class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['id', 'email', 'first_name', 'last_name']
    ordering = ['id']


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Animal)
admin.site.register(Visit, VisitAdmin)
admin.site.register(Species)
