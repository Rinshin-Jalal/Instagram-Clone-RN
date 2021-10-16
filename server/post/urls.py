from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path("all/", views.PostList.as_view()),
    path("<str:pk>/like/", views.PostLike.as_view()),
    path("<str:pk>/comment/", views.PostComment.as_view())
]
