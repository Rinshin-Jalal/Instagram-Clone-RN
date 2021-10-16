from rest_framework import generics
from . import serializers
from .models import Comment, Like, Post
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.db.models import Q
import json

User = get_user_model()


class PostList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = serializers.PostSerializer
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        _serializer = serializers.PostSerializer(data=request.data)

        if _serializer.is_valid():
            _serializer.save(owner=self.request.user)
            return Response(_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = serializers.PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, ]


class PostLike(APIView):
    def post(self, request, pk):
        likeuser = User.objects.get(username=request.user.username)
        likepost = Post.objects.filter(id=pk)
        check = Like.objects.filter(
            Q(liked_by=likeuser) & Q(post=likepost.last()))
        if(check.exists()):
            like = check.last()
            like.delete()
            print(like)
            return Response({
                "message": "Disliked Post"
            })
        new_like = Like.objects.create(
            liked_by=likeuser, post=likepost.last())
        new_like.save()
        serializer = serializers.POSTLikeSerializer(new_like)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PostComment(APIView):
    # parser_classes = (MultiPartParser, FormParser)

    def post(self, request, pk):
        commentuser = User.objects.get(username=request.user.username)
        post = Post.objects.filter(id=pk)
        print(request.data.get('comment'))

        data = json.loads(request.body)
        comment = request.data.get('comment')
        new_like = Comment.objects.create(
            commented_by=commentuser, post=post.last(), comment=comment)
        new_like.save()
        serializer = serializers.POSTCommentSerializer(new_like)
        return Response(serializer.data, status=status.HTTP_200_OK)
