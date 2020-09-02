from django.test import TestCase, Client
from .models import User, Post, Like, Following

# Create your tests here.
class NetworkTestCase(TestCase):
    def setUp(self):
        #create two users
        user1 = User.objects.create_user(username="mgmg",email="mgmg@example.com", password="mgmgpassword")
        user2 = User.objects.create(username="koko",email="koko@example.com", password="kokopassword")

        #create user posts
        post1 = Post.objects.create(post_user=user1, content="This is user1's post1.")
        Post.objects.create(post_user=user1, content="This is user1's post2.")
        Post.objects.create(post_user=user1, content="This is user1's post3.")
        Post.objects.create(post_user=user1, content="This is user1's post4.")
        Post.objects.create(post_user=user1, content="This is user1's post5.")
        Post.objects.create(post_user=user1, content="This is user1's post6.")
        post7 = Post.objects.create(post_user=user2, content="This is user2's post1.")
        Post.objects.create(post_user=user2, content="This is user2's post2.")
        Post.objects.create(post_user=user2, content="This is user2's post3.")
        Post.objects.create(post_user=user2, content="This is user2's post4.")
        Post.objects.create(post_user=user2, content="This is user2's post5.")
        Post.objects.create(post_user=user2, content="This is user2's post6.")


        #create likes
        Like.objects.create(liked_user=user1, liked_post=post7)
        Like.objects.create(liked_user=user2, liked_post=post1)

        #create following
        Following.objects.create(following_user=user1, followed_user=user2)
        Following.objects.create(following_user=user2, followed_user=user1)

    def test_index(self):
        """check if status code of index page is 200 and paginate 10 posts per page"""
        c = Client()
        response = c.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context["page_obj"].object_list.count(), 10)

    def test_following(self):
        """check if response of login user is True and paginate 10posts per following page"""
        user1 = User.objects.get(pk=1)
        user2 = User.objects.get(pk=2)
        for post_num in range(13,18):
            Post.objects.create(post_user=user1, content=f"This is user1's post{post_num}.")
        for post_num in range(18,23):
            Post.objects.create(post_user=user2, content=f"This is user2's post{post_num}.")

        c = Client()
        login = c.login(username="mgmg", password="mgmgpassword")
        self.assertTrue(login)
        response = c.get("/following")
        self.assertEqual(len(response.context["page_obj"].object_list), 10)        
        
