from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("save_post/<int:post_id>", views.save_post, name="save_post"),
    path("create_post", views.create_post, name="create_post"),
    path("following", views.following, name="following"),
    path("profile/<int:user_id>", views.profile, name="profile"),
    path("is_following/<int:check_id>", views.is_following, name="is_following"),
    path("profile/follow_or_unfollow/<str:choice>/<int:user_id>", views.follow_or_unfollow, name="follow_or_unfollow"),
    path("profile/follower_following/<int:user_id>", views.follower_following, name="follower_following"),
]
