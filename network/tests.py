from django.test import TestCase, Client
from .models import User, Post, Like, Following

# Create your tests here.
class NetworkTestCase(TestCase):
    def setUp(self):
        #create two users
        user1 = User.objects.create_user(username="mgmg",email="mgmg@example.com", password="mgmgpassword")
        user2 = User.objects.create(username="koko",email="koko@example.com", password="kokopassword")

        #create user posts
        for post_num in range(11):
            Post.objects.create(post_user=user1, content=f"This is user1's post{post_num}.")
            Post.objects.create(post_user=user2, content=f"This is user2's post{post_num}.")


        #create likes
        post1 = Post.objects.get(pk=1)
        post2 = Post.objects.get(pk=2)
        Like.objects.create(liked_user=user1, liked_post=post2)
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
        c = Client()
        login = c.login(username="mgmg", password="mgmgpassword")
        self.assertTrue(login)
        response = c.get("/following")
        self.assertEqual(len(response.context["page_obj"].object_list), 10)        
        
