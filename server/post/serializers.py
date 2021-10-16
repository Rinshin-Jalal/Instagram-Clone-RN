from rest_framework import serializers
from .models import Post, Comment, Like
from django.conf import settings
from drf_extra_fields.fields import Base64ImageField
from django.contrib.auth import get_user_model


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['email', 'username',
                  'is_verified', "profile_photo"]


class POSTCommentSerializer(serializers.ModelSerializer):
    commented_by = UserSerializer(read_only=True, many=False)

    class Meta:
        model = Comment
        fields = ['comment', 'commented_by']


class POSTLikeSerializer(serializers.ModelSerializer):
    liked_by = serializers.ReadOnlyField(source='liked_by.username')

    class Meta:
        model = Like
        fields = ["liked_by"]


class PostSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True, many=False)
    comments = POSTCommentSerializer(many=True, read_only=True)
    likes = POSTLikeSerializer(many=True, read_only=True)
    image = Base64ImageField()

    class Meta:
        model = Post
        fields = ['id', 'caption', 'uploaded_at',
                  'owner', 'image', 'comments', 'likes']
