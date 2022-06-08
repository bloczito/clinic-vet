from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class LoginForm(forms.Form):
    email = forms.CharField(label='email', max_length=180)
    password = forms.CharField(label='password', max_length=180)

class CreateUserForm(UserCreationForm):
    class Meta:
        model = User
        fields = [
            "email",
            "password",
        ]

class SignUpForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, required=False)
    last_name = forms.CharField(max_length=30, required=False)
    email = forms.EmailField(max_length=254)

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name')

    def save(self, commit=True):
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password"])
        user.username = '{}.{}'.format(
            self.cleaned_data['first_name'],
            self.cleaned_data['last_name']
        )
        if commit:
            user.save()
        return user