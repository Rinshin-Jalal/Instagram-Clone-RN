from django.conf import settings
from django.db import models
from authentication.models import User


class Post(models.Model):
    caption = models.TextField(blank=False, null=False, default='')
    image = models.ImageField(blank=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(
        User, related_name='posts', on_delete=models.CASCADE, blank=True, null=True)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.caption[0:20]


class Like(models.Model):
    liked_by = models.ForeignKey(User, related_name="post_likes",
                                 on_delete=models.CASCADE, blank=False, null=True)
    post = models.ForeignKey(Post, related_name="likes",
                             on_delete=models.CASCADE, blank=False, null=False, default=6)

    def __str__(self):
        return f"{self.post} - post liked by - {self.liked_by} "


class Comment(models.Model):
    commented_by = models.ForeignKey(
        User, related_name="post_comments", on_delete=models.CASCADE, blank=False, null=False)
    post = models.ForeignKey(Post, related_name="comments",
                             on_delete=models.CASCADE, blank=False, null=False)
    comment = models.TextField(blank=False, null=False)

    def __str__(self):
        return f"{self.commented_by} commented {self.comment[0:20]}.... to post {self.post} "
