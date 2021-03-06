import json
from django.core.paginator import Paginator
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

from .models import User, Post, Like, Following


def index(request):
    posts = Post.objects.order_by('date_posted').reverse()
    p = Paginator(posts, 10)

    page_number = request.GET.get('page')
    page_obj = p.get_page(page_number)
    return render(request, "network/index.html", {
        'page_obj' : page_obj,
        'following': False
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html",
                          {"message": "Invalid username and/or password."})
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html",
                          {"message": "Passwords must match."})

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html",
                          {"message": "Username already taken."})
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@login_required
def create_post(request):
    if request.method == "POST":
        data = json.loads(request.body)
        post = Post(post_user=request.user, content=data.get("post_content"))
        post.save()
        return HttpResponseRedirect(reverse('index'))        

@login_required
def following(request):
    following_users = request.user.followed_users.all()
    following_posts = [user.followed_user.user_posts.all() for user in following_users]
    
    posts = [post for query in following_posts for post in query]
    p = Paginator(posts, 10)

    page_number = request.GET.get('page')
    page_obj = p.get_page(page_number)
    return render(request, "network/index.html", {
        'page_obj' : page_obj,
        'following': True
    })

def profile(request, user_id):
    user = User.objects.get(pk=user_id)
    posts = user.user_posts.all()
    p = Paginator(posts, 10)

    page_number = request.GET.get('page')
    page_obj = p.get_page(page_number)
    return render(request, 'network/profile.html', {
        "user_id": user_id,
        "name": user.username,
        "email": user.email,
        "is_following": request.user.id in [follower.following_user.id for follower in user.followers.all()],
        "followers": [follower.following_user.username for follower in user.followers.all()],
        "following": [following.followed_user.username for following in user.followed_users.all()],
        "page_obj" : page_obj})

def follower_following(request, user_id):
    user = User.objects.get(pk=user_id)
    return JsonResponse({
        'follower': len([follower for follower in user.followers.all()]),
        'following': len([following for following in user.followed_users.all()])
    })        

@login_required
def is_following(request, check_id):
    following = [following.followed_user.id for following in request.user.followed_users.all()]
    
    if check_id in following:
        return JsonResponse({"is_following" : True})
    return JsonResponse({"is_following" : False})

@login_required
def follow_or_unfollow(request, choice, user_id):
    user = User.objects.get(pk=user_id)
    if choice == 'follow':
        toFollow = Following(following_user=request.user, followed_user=user)
        toFollow.save()
        return JsonResponse({'follow_or_unfollow' : 'followed'})
    if choice == 'unfollow':
        following = Following.objects.filter(following_user=request.user, followed_user=user)
        following[0].delete()
        return JsonResponse({'follow_or_unfollow' : 'unfollowed'})

@login_required
def save_post(request, post_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        post = Post.objects.get(pk=post_id)
        if request.user != post.post_user:
            return JsonResponse({'message': 'You don\'t have permission to edit this post.'}) 
        post.content = data.get('post_content')
        post.save()
        return JsonResponse({'message': 'successfully saved'})

@login_required
def like_post(request, post_id):
        post = Post.objects.get(pk=post_id)
        liked = Like.objects.filter(liked_user=request.user, liked_post=post)
        if liked.exists():
            for like_obj in liked:
                like_obj.delete()
            return JsonResponse({
            'like_count':len([like for like in post.liked_users.all()]),
            'like_or_unlike': 'unlike'
            })
        like = Like(liked_user=request.user, liked_post=post)
        like.save()
        return JsonResponse({
            'like_count':len([like for like in post.liked_users.all()]),
            'like_or_unlike': 'like'
            })

                
