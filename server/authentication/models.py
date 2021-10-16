from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
import jwt
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives


class CustomUserManager(BaseUserManager):

    def create_user(self, username, email, password=None):

        if username is None:
            raise TypeError(_("User should have a username."))

        if email is None:
            raise TypeError(_("User should have a email."))

        user = self.model(username=username, email=self.normalize_email(email))
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, email, password=None):

        if password is None:
            raise TypeError(_("Password should not be None."))

        user = self.create_user(username, email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return user


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=255, unique=True, db_index=True)
    email = models.EmailField(max_length=255, db_index=True)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    profile_photo = models.ImageField(blank=True)

    USERNAME_FIELD = 'username'

    REQUIRED_FIELDS = ['email', "profile_photo"]

    objects = CustomUserManager()

    class Meta:
        db_table = 'User'

    def __str__(self):
        return self.username

    def has_module_perms(self, app_label):
        return self.is_superuser

    def has_perm(self, perm, obj=None):
        return self.is_superuser


class EmailVerify(models.Model):

    email = models.CharField(max_length=123, null=True,
                             blank=True)
    token = models.CharField(max_length=260, null=True, blank=True)

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):

        self.token = jwt.encode(
            {"main": {'email': self.email}}, "secret", algorithm="HS256")
        context = {'email': self.email, 'token': self.token,
                   'link': 'localhost:3000', }  # your main frontend link
        email_html_message = render_to_string(
            'authentication/email_verify.html', context)
        email_plaintext_message = render_to_string(
            'authentication/email_verify.txt', context)
        msg = EmailMultiAlternatives(
            # title:
            "Email Verification | {title}".format(title="My Website"),
            # message:
            email_plaintext_message,
            # from:
            "rinzcodemail@gmail.com",
            # to:
            [self.email]
        )
        msg.attach_alternative(email_html_message, "text/html")
        msg.send()

        super().save(*args, **kwargs)
