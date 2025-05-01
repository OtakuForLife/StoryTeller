from django.test import TestCase
from django.contrib.auth.models import User
from api.models import (
    Project, Character, CharacterArc, Place, Items,
    Story, Scene, Idea, IdeaType, Chapter
)

class ProjectModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.test_user = User.objects.create_user(username='testuser', password='12345')

        # Create a project
        cls.project = Project.objects.create(
            name='Test Project',
            author=cls.test_user
        )

    def test_name_max_length(self):
        max_length = self.project._meta.get_field('name').max_length
        self.assertEqual(max_length, 255)

    def test_object_name_is_name(self):
        expected_object_name = self.project.name
        self.assertEqual(str(self.project), expected_object_name)

    def test_author_relationship(self):
        self.assertEqual(self.project.author, self.test_user)

class CharacterModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.test_user = User.objects.create_user(username='testuser', password='12345')

        # Create a project
        cls.project = Project.objects.create(
            name='Test Project',
            author=cls.test_user
        )

        # Create a character
        cls.character = Character.objects.create(
            name='Test Character',
            surname='Test Surname',
            nickname='Test Nickname',
            project=cls.project
        )

    def test_name_max_length(self):
        max_length = self.character._meta.get_field('name').max_length
        self.assertEqual(max_length, 255)

    def test_surname_max_length(self):
        max_length = self.character._meta.get_field('surname').max_length
        self.assertEqual(max_length, 255)

    def test_nickname_max_length(self):
        max_length = self.character._meta.get_field('nickname').max_length
        self.assertEqual(max_length, 255)

    def test_object_name_is_name(self):
        expected_object_name = self.character.name
        self.assertEqual(str(self.character), expected_object_name)

    def test_project_relationship(self):
        self.assertEqual(self.character.project, self.project)

class CharacterArcModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.test_user = User.objects.create_user(username='testuser', password='12345')

        # Create a project
        cls.project = Project.objects.create(
            name='Test Project',
            author=cls.test_user
        )

        # Create a character
        cls.character = Character.objects.create(
            name='Test Character',
            project=cls.project
        )

        # Create a character arc
        cls.arc = CharacterArc.objects.create(
            project=cls.project,
            character=cls.character,
            description='Test character arc description'
        )

    def test_object_name(self):
        expected_object_name = f"Arc for {self.character.name}"
        self.assertEqual(str(self.arc), expected_object_name)

    def test_project_relationship(self):
        self.assertEqual(self.arc.project, self.project)

    def test_character_relationship(self):
        self.assertEqual(self.arc.character, self.character)

class PlaceModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.test_user = User.objects.create_user(username='testuser', password='12345')

        # Create a project
        cls.project = Project.objects.create(
            name='Test Project',
            author=cls.test_user
        )

        # Create a parent place
        cls.parent_place = Place.objects.create(
            name='Parent Place',
            project=cls.project,
            adjectives='big, spacious'
        )

        # Create a child place
        cls.child_place = Place.objects.create(
            name='Child Place',
            project=cls.project,
            parent=cls.parent_place,
            adjectives='small, cozy'
        )

    def test_name_max_length(self):
        max_length = self.parent_place._meta.get_field('name').max_length
        self.assertEqual(max_length, 255)

    def test_object_name_is_name(self):
        expected_object_name = self.parent_place.name
        self.assertEqual(str(self.parent_place), expected_object_name)

    def test_project_relationship(self):
        self.assertEqual(self.parent_place.project, self.project)

    def test_parent_child_relationship(self):
        self.assertEqual(self.child_place.parent, self.parent_place)
        self.assertIn(self.child_place, self.parent_place.places.all())

class ItemsModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.test_user = User.objects.create_user(username='testuser', password='12345')

        # Create a project
        cls.project = Project.objects.create(
            name='Test Project',
            author=cls.test_user
        )

        # Create an item
        cls.item = Items.objects.create(
            name='Test Item',
            project=cls.project
        )

    def test_name_max_length(self):
        max_length = self.item._meta.get_field('name').max_length
        self.assertEqual(max_length, 255)

    def test_object_name_is_name(self):
        expected_object_name = self.item.name
        self.assertEqual(str(self.item), expected_object_name)

    def test_project_relationship(self):
        self.assertEqual(self.item.project, self.project)

    def test_verbose_name_plural(self):
        self.assertEqual(Items._meta.verbose_name_plural, 'Items')

class StoryModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.test_user = User.objects.create_user(username='testuser', password='12345')

        # Create a project
        cls.project = Project.objects.create(
            name='Test Project',
            author=cls.test_user
        )

        # Create a story
        cls.story = Story.objects.create(
            title='Test Story',
            project=cls.project,
            promise='Test promise',
            plot='Test plot',
            emotional_matter='Test emotional matter',
            universal_truth='Test universal truth',
            logline='Test logline'
        )

    def test_name_max_length(self):
        max_length = self.story._meta.get_field('title').max_length
        self.assertEqual(max_length, 255)

    def test_object_name_is_name(self):
        expected_object_name = self.story.title
        self.assertEqual(str(self.story), expected_object_name)

    def test_project_relationship(self):
        self.assertEqual(self.story.project, self.project)

    def test_verbose_name_plural(self):
        self.assertEqual(Story._meta.verbose_name_plural, 'Stories')

class SceneModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.test_user = User.objects.create_user(username='testuser', password='12345')

        # Create a project
        cls.project = Project.objects.create(
            name='Test Project',
            author=cls.test_user
        )

        # Create a place
        cls.place = Place.objects.create(
            name='Test Place',
            project=cls.project
        )

        # Create characters
        cls.character1 = Character.objects.create(
            name='Character 1',
            project=cls.project
        )

        cls.character2 = Character.objects.create(
            name='Character 2',
            project=cls.project
        )

        # Create items
        cls.item1 = Items.objects.create(
            name='Item 1',
            project=cls.project
        )

        cls.item2 = Items.objects.create(
            name='Item 2',
            project=cls.project
        )

        # Create a scene
        cls.scene = Scene.objects.create(
            project=cls.project,
            short_description='Test scene description',
            place=cls.place,
            external_conflict='Test external conflict',
            interpersonal_conflict='Test interpersonal conflict',
            internal_conflict='Test internal conflict',
            time_order=1
        )

        # Add characters and items to the scene
        cls.scene.characters.add(cls.character1, cls.character2)
        cls.scene.items.add(cls.item1, cls.item2)

    def test_object_name_is_short_description(self):
        expected_object_name = self.scene.short_description
        self.assertEqual(str(self.scene), expected_object_name)

    def test_project_relationship(self):
        self.assertEqual(self.scene.project, self.project)

    def test_place_relationship(self):
        self.assertEqual(self.scene.place, self.place)

    def test_characters_relationship(self):
        self.assertEqual(self.scene.characters.count(), 2)
        self.assertIn(self.character1, self.scene.characters.all())
        self.assertIn(self.character2, self.scene.characters.all())

    def test_items_relationship(self):
        self.assertEqual(self.scene.items.count(), 2)
        self.assertIn(self.item1, self.scene.items.all())
        self.assertIn(self.item2, self.scene.items.all())

class IdeaModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.test_user = User.objects.create_user(username='testuser', password='12345')

        # Create a project
        cls.project = Project.objects.create(
            name='Test Project',
            author=cls.test_user
        )

        # Create ideas of different types
        cls.character_idea = Idea.objects.create(
            author=cls.test_user,
            project=cls.project,
            content='Test character idea',
            type=IdeaType.CHARACTER
        )

        cls.place_idea = Idea.objects.create(
            author=cls.test_user,
            project=cls.project,
            content='Test place idea',
            type=IdeaType.PLACE
        )

        cls.item_idea = Idea.objects.create(
            author=cls.test_user,
            project=cls.project,
            content='Test item idea',
            type=IdeaType.ITEM
        )

        cls.scene_idea = Idea.objects.create(
            author=cls.test_user,
            project=cls.project,
            content='Test scene idea',
            type=IdeaType.SCENE
        )

    def test_object_name(self):
        expected_object_name = f"Character idea: {self.character_idea.content[:50]}"
        self.assertEqual(str(self.character_idea), expected_object_name)

    def test_author_relationship(self):
        self.assertEqual(self.character_idea.author, self.test_user)

    def test_project_relationship(self):
        self.assertEqual(self.character_idea.project, self.project)

    def test_idea_types(self):
        self.assertEqual(self.character_idea.type, IdeaType.CHARACTER)
        self.assertEqual(self.place_idea.type, IdeaType.PLACE)
        self.assertEqual(self.item_idea.type, IdeaType.ITEM)
        self.assertEqual(self.scene_idea.type, IdeaType.SCENE)

class ChapterModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.test_user = User.objects.create_user(username='testuser', password='12345')

        # Create a project
        cls.project = Project.objects.create(
            name='Test Project',
            author=cls.test_user
        )

        # Create a story
        cls.story = Story.objects.create(
            title='Test Story',
            project=cls.project
        )

        # Create chapters
        cls.chapter1 = Chapter.objects.create(
            title='Chapter 1',
            content='This is chapter 1',
            story=cls.story,
            order=1
        )

        cls.chapter2 = Chapter.objects.create(
            title='Chapter 2',
            content='This is chapter 2',
            story=cls.story,
            order=2
        )

    def test_object_name_is_title(self):
        expected_object_name = self.chapter1.title
        self.assertEqual(str(self.chapter1), expected_object_name)

    def test_story_relationship(self):
        self.assertEqual(self.chapter1.story, self.story)

    def test_ordering(self):
        self.assertEqual(Chapter._meta.ordering, ['order'])

        # Test that chapters are retrieved in the correct order
        chapters = Chapter.objects.filter(story=self.story)
        self.assertEqual(chapters[0], self.chapter1)
        self.assertEqual(chapters[1], self.chapter2)
