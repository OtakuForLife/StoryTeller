from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from api.models import (
    Character, CharacterArc, Story, Chapter, Race, CharacterTrait,
    CharacterRelationship, Gender, CharacterArcType, RelationshipType
)



class CharacterViewSetTest(APITestCase):
    def setUp(self):
        # Create a user
        self.user = User.objects.create_user(username='testuser', password='12345')

        # Create a client and force authentication
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # Create a race
        self.race = Race.objects.create(
            name='Test Race',
            description='Test race description'
        )

        # Create a character
        self.character = Character.objects.create(
            name='Test Character',
            surname='Test Surname',
            nickname='Test Nickname',
            author=self.user,
            gender=Gender.MALE,
            race=self.race
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
            'surname': 'New Surname',
            'nickname': 'New Nickname',
            'gender': Gender.FEMALE,
            'race': str(self.race.id)
        }
        response = self.client.post(self.characters_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Character.objects.count(), 2)
        # Get the newly created character by filtering instead of by ID
        new_character = Character.objects.filter(name='New Character').first()
        self.assertIsNotNone(new_character)
        self.assertEqual(new_character.name, 'New Character')
        self.assertEqual(new_character.surname, 'New Surname')
        self.assertEqual(new_character.nickname, 'New Nickname')

class CharacterArcViewSetTest(APITestCase):
    def setUp(self):
        # Create a user
        self.user = User.objects.create_user(username='testuser', password='12345')

        # Create a client and force authentication
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # Create a character
        self.character = Character.objects.create(
            name='Test Character',
            author=self.user
        )

        # Create a character arc
        self.arc = CharacterArc.objects.create(
            character=self.character,
            author=self.user,
            description='Test character arc description',
            arc_type=CharacterArcType.POSITIVE,
            start_trait='Shy',
            end_trait='Confident',
            change_trigger='Overcame fear'
        )

        # URL for character arcs list
        self.arcs_url = reverse('character-arc-list')

    def test_get_arcs_list(self):
        response = self.client.get(self.arcs_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_arc(self):
        data = {
            'character': str(self.character.id),
            'description': 'New character arc description',
            'arc_type': CharacterArcType.NEGATIVE,
            'start_trait': 'Confident',
            'end_trait': 'Fearful',
            'change_trigger': 'Traumatic event'
        }
        response = self.client.post(self.arcs_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CharacterArc.objects.count(), 2)

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
            author=self.user,
            promise='Test promise',
            plot='Test plot',
            emotional_matter='Test emotional matter',
            universal_truth='Test universal truth',
            logline='Test logline'
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
            'promise': 'New promise',
            'plot': 'New plot',
            'emotional_matter': 'New emotional matter',
            'universal_truth': 'New universal truth',
            'logline': 'New logline'
        }
        response = self.client.post(self.stories_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Story.objects.count(), 2)
        # Get the newly created story by filtering instead of by ID
        new_story = Story.objects.filter(title='New Story').first()
        self.assertIsNotNone(new_story)
        self.assertEqual(new_story.title, 'New Story')

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
            'story': str(self.story.id),
            'order': 2
        }
        response = self.client.post(self.chapters_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Chapter.objects.count(), 2)
        # Get the newly created chapter by filtering instead of by ID
        new_chapter = Chapter.objects.filter(title='New Chapter').first()
        self.assertIsNotNone(new_chapter)
        self.assertEqual(new_chapter.title, 'New Chapter')
