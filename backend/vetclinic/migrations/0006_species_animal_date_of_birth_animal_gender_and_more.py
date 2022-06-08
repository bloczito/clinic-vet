# Generated by Django 4.0.3 on 2022-04-30 20:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('vetclinic', '0005_rename_animal_id_visit_animal_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Species',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150)),
            ],
        ),
        migrations.AddField(
            model_name='animal',
            name='date_of_birth',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='animal',
            name='gender',
            field=models.CharField(max_length=150, null=True),
        ),
        migrations.AddField(
            model_name='animal',
            name='height',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='animal',
            name='race',
            field=models.CharField(max_length=150, null=True),
        ),
        migrations.AddField(
            model_name='animal',
            name='weight',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='animal',
            name='species',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='vetclinic.species'),
        ),
    ]
