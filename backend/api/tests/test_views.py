from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from api.models import Project, Character, CharacterArc, Story, Chapter

class ProjectViewSetTest(APITestCase):
    def setUp(self):
        # Create a user
        self.user = User.objects.create_user(username='testuser', password='12345')

        # Create a client and force authentication
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # Create a project
        self.project = Project.objects.create(
            name='Test Project',
            author=self.user
        )

        # URL for projects list
        self.projects_url = reverse('project-list')

    def test_get_projects_list(self):
        response = self.client.get(self.projects_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_project(self):
        data = {
            'name': 'New Project'
        }
        response = self.client.post(self.projects_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 2)
        # Get the newly created project by filtering instead of by ID
        new_project = Project.objects.filter(name='New Project').first()
        self.assertIsNotNone(new_project)
        self.assertEqual(new_project.name, 'New Project')

    def test_get_project_detail(self):
        url = reverse('project-detail', args=[self.project.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Project')

    def test_update_project(self):
        url = reverse('project-detail', args=[self.project.id])
        data = {
            'name': 'Updated Project'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.project.refresh_from_db()
        self.assertEqual(self.project.name, 'Updated Project')

    def test_delete_project(self):
        url = reverse('project-detail', args=[self.project.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Project.objects.count(), 0)

class CharacterViewSetTest(APITestCase):
    def setUp(self):
        # Create a user
        self.user = User.objects.create_user(username='testuser', password='12345')

        # Create a client and force authentication
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # Create a project
        self.project = Project.objects.create(
            name='Test Project',
            author=self.user
        )

        # Create a character
        self.character = Character.objects.create(
            name='Test Character',
            surname='Test Surname',
            nickname='Test Nickname',
            project=self.project
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
            'project': str(self.project.id)
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

        # Create a project
        self.project = Project.objects.create(
            name='Test Project',
            author=self.user
        )

        # Create a character
        self.character = Character.objects.create(
            name='Test Character',
            project=self.project
        )

        # Create a character arc
        self.arc = CharacterArc.objects.create(
            project=self.project,
            character=self.character,
            description='Test character arc description'
        )

        # URL for character arcs list
        self.arcs_url = reverse('character-arc-list')

    def test_get_arcs_list(self):
        response = self.client.get(self.arcs_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_arc(self):
        data = {
            'project': str(self.project.id),
            'character': str(self.character.id),
            'description': 'New character arc description'
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

        # Create a project
        self.project = Project.objects.create(
            name='Test Project',
            author=self.user
        )

        # Create a story
        self.story = Story.objects.create(
            title='Test Story',
            project=self.project,
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
            'project': str(self.project.id),
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

        # Create a project
        self.project = Project.objects.create(
            name='Test Project',
            author=self.user
        )

        # Create a story
        self.story = Story.objects.create(
            title='Test Story',
            project=self.project
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
