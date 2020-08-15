from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings


class User(AbstractUser):
    pass


class Post(models.Model):
    post_user = models.ForeignKey(settings.AUTH_USER_MODEL,
                                  on_delete=models.CASCADE,
                                  related_name='user_posts')
    date_posted = models.DateTimeField(null=False, auto_now_add=True)
    content = models.TextField(null=False, blank=False)

    def serialize(self):
        return {
            "post_id": self.id,
            "username": self.post_user.username,
            "timestamp": self.date_posted.strftime("%b %d %Y, %I:%M %p"),
            "content": self.content,
            "likes":
            [like.liked_user.username for like in self.liked_users.all()]
        }

    def __str__(self):
        return f"{self.post_user} posted a post on {self.date_posted}"


class Like(models.Model):
    liked_user = models.ForeignKey(settings.AUTH_USER_MODEL,
                                   on_delete=models.CASCADE,
                                   related_name='liked_posts')
    liked_post = models.ForeignKey(Post,
                                   on_delete=models.CASCADE,
                                   related_name='liked_users')

    def __str__(self):
        return f"{self.liked_user} liked {self.liked_post}"


class Following(models.Model):
    following_user = models.ForeignKey(settings.AUTH_USER_MODEL,
                                       on_delete=models.CASCADE,
                                       related_name='followed_users')
    followed_user = models.ForeignKey(settings.AUTH_USER_MODEL,
                                      on_delete=models.CASCADE,
                                      related_name='followers')

    def __str__(self):
        return f"{self.following_user} followed {self.followed_user}"