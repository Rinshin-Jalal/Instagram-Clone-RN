# Generated by Django 3.2.8 on 2021-10-16 03:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0006_alter_like_post'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='post',
            options={'ordering': ['-id']},
        ),
    ]