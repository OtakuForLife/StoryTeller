from django.test import TestCase
from django.contrib.auth.models import User
from api.models import Story, Character, Chapter

class StoryModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        test_user = User.objects.create_user(username='testuser', password='12345')
        
        # Create a story
        Story.objects.create(
            title='Test Story',
            description='This is a test story',
            author=test_user
        )
    
    def test_title_max_length(self):
        story = Story.objects.get(id=1)
        max_length = story._meta.get_field('title').max_length
        self.assertEqual(max_length, 255)
    
    def test_object_name_is_title(self):
        story = Story.objects.get(id=1)
        expected_object_name = story.title
        self.assertEqual(str(story), expected_object_name)
    
    def test_verbose_name_plural(self):
        self.assertEqual(Story._meta.verbose_name_plural, 'Stories')

class CharacterModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        test_user = User.objects.create_user(username='testuser', password='12345')
        
        # Create a story
        test_story = Story.objects.create(
            title='Test Story',
            description='This is a test story',
            author=test_user
        )
        
        # Create a character
        Character.objects.create(
            name='Test Character',
            description='This is a test character',
            story=test_story
        )
    
    def test_name_max_length(self):
        character = Character.objects.get(id=1)
        max_length = character._meta.get_field('name').max_length
        self.assertEqual(max_length, 255)
    
    def test_object_name_is_name(self):
        character = Character.objects.get(id=1)
        expected_object_name = character.name
        self.assertEqual(str(character), expected_object_name)

class ChapterModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        test_user = User.objects.create_user(username='testuser', password='12345')
        
        # Create a story
        test_story = Story.objects.create(
            title='Test Story',
            description='This is a test story',
            author=test_user
        )
        
        # Create a chapter
        Chapter.objects.create(
            title='Test Chapter',
            content='This is a test chapter',
            story=test_story,
            order=1
        )
    
    def test_title_max_length(self):
        chapter = Chapter.objects.get(id=1)
        max_length = chapter._meta.get_field('title').max_length
        self.assertEqual(max_length, 255)
    
    def test_object_name_is_title(self):
        chapter = Chapter.objects.get(id=1)
        expected_object_name = chapter.title
        self.assertEqual(str(chapter), expected_object_name)
    
    def test_ordering(self):
        self.assertEqual(Chapter._meta.ordering, ['order'])
