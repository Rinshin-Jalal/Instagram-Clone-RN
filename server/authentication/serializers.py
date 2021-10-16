from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField

from .models import EmailVerify, User


class SignUp(serializers.ModelSerializer):
    profile_photo = Base64ImageField()

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'profile_photo')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        return user


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['email', 'username',
                  'is_verified', "profile_photo"]


class EmailVerifySerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailVerify
        fields = ['email']
