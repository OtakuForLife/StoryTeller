from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from api.models import Story, Character, Chapter

class StoryViewSetTest(APITestCase):
    def setUp(self):
        # Create a user
        self.user = User.objects.create_user(username='testuser', password='12345')

        # Create a client and force authentication
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # Create a story
        self.story = Story.objects.create(
            title='Test Story',
            description='This is a test story',
            author=self.user
        )

        # URL for stories list
        self.stories_url = reverse('story-list')

    def test_get_stories_list(self):
        response = self.client.get(self.stories_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_story(self):
        data = {
            'title': 'New Story',
            'description': 'This is a new story'
        }
        response = self.client.post(self.stories_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Story.objects.count(), 2)
        # Get the newly created story by filtering instead of by ID
        new_story = Story.objects.filter(title='New Story').first()
        self.assertIsNotNone(new_story)
        self.assertEqual(new_story.title, 'New Story')

    def test_get_story_detail(self):
        url = reverse('story-detail', args=[self.story.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Story')

    def test_update_story(self):
        url = reverse('story-detail', args=[self.story.id])
        data = {
            'title': 'Updated Story',
            'description': 'This is an updated story'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.story.refresh_from_db()
        self.assertEqual(self.story.title, 'Updated Story')

    def test_delete_story(self):
        url = reverse('story-detail', args=[self.story.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Story.objects.count(), 0)

class CharacterViewSetTest(APITestCase):
    def setUp(self):
        # Create a user
        self.user = User.objects.create_user(username='testuser', password='12345')

        # Create a client and force authentication
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # Create a story
        self.story = Story.objects.create(
            title='Test Story',
            description='This is a test story',
            author=self.user
        )

        # Create a character
        self.character = Character.objects.create(
            name='Test Character',
            description='This is a test character',
            story=self.story
        )

        # URL for characters list
        self.characters_url = reverse('character-list')

    def test_get_characters_list(self):
        response = self.client.get(self.characters_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_character(self):
        data = {
            'name': 'New Character',
            'description': 'This is a new character',
            'story': self.story.id
        }
        response = self.client.post(self.characters_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Character.objects.count(), 2)
        # Get the newly created character by filtering instead of by ID
        new_character = Character.objects.filter(name='New Character').first()
        self.assertIsNotNone(new_character)
        self.assertEqual(new_character.name, 'New Character')

class ChapterViewSetTest(APITestCase):
    def setUp(self):
        # Create a user
        self.user = User.objects.create_user(username='testuser', password='12345')

        # Create a client and force authentication
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # Create a story
        self.story = Story.objects.create(
            title='Test Story',
            description='This is a test story',
            author=self.user
        )

        # Create a chapter
        self.chapter = Chapter.objects.create(
            title='Test Chapter',
            content='This is a test chapter',
            story=self.story,
            order=1
        )

        # URL for chapters list
        self.chapters_url = reverse('chapter-list')

    def test_get_chapters_list(self):
        response = self.client.get(self.chapters_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_chapter(self):
        data = {
            'title': 'New Chapter',
            'content': 'This is a new chapter',
            'story': self.story.id,
            'order': 2
        }
        response = self.client.post(self.chapters_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Chapter.objects.count(), 2)
        # Get the newly created chapter by filtering instead of by ID
        new_chapter = Chapter.objects.filter(title='New Chapter').first()
        self.assertIsNotNone(new_chapter)
        self.assertEqual(new_chapter.title, 'New Chapter')
