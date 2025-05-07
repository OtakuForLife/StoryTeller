from django.test import TestCase
from django.contrib.auth.models import User
from api.models import (
    Character, CharacterArc, Place, Item,
    Story, Scene, Idea, Chapter, Race, CharacterTrait,
    CharacterRelationship, Gender, CharacterArcType, RelationshipType, IdeaType
)
from api.serializers import (
    CharacterSerializer, CharacterArcSerializer, PlaceSerializer, ItemSerializer,
    StorySerializer, SceneSerializer, IdeaSerializer, ChapterSerializer,
    RaceSerializer, CharacterTraitSerializer, CharacterRelationshipSerializer
)


class RaceSerializerTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a race
        cls.race = Race.objects.create(
            name='Test Race',
            description='Test race description'
        )

    def test_race_serializer(self):
        serializer = RaceSerializer(self.race)
        self.assertEqual(serializer.data['name'], 'Test Race')
        self.assertEqual(serializer.data['description'], 'Test race description')


class CharacterTraitSerializerTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a character trait
        cls.trait = CharacterTrait.objects.create(
            name='Test Trait',
            description='Test trait description'
        )

    def test_trait_serializer(self):
        serializer = CharacterTraitSerializer(self.trait)
        self.assertEqual(serializer.data['name'], 'Test Trait')
        self.assertEqual(serializer.data['description'], 'Test trait description')


class CharacterSerializerTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.user = User.objects.create_user(username='testuser', password='12345')

        # Create a race
        cls.race = Race.objects.create(
            name='Test Race',
            description='Test race description'
        )

        # Create a character
        cls.character = Character.objects.create(
            name='Test Character',
            surname='Test Surname',
            nickname='Test Nickname',
            author=cls.user,
            gender=Gender.MALE,
            race=cls.race
        )

    def test_character_serializer(self):
        serializer = CharacterSerializer(self.character)
        self.assertEqual(serializer.data['name'], 'Test Character')
        self.assertEqual(serializer.data['surname'], 'Test Surname')
        self.assertEqual(serializer.data['nickname'], 'Test Nickname')
        self.assertEqual(serializer.data['gender'], Gender.MALE)
        self.assertEqual(serializer.data['race']['name'], 'Test Race')


class CharacterRelationshipSerializerTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.user = User.objects.create_user(username='testuser', password='12345')

        # Create characters
        cls.character1 = Character.objects.create(
            name='Character 1',
            author=cls.user
        )

        cls.character2 = Character.objects.create(
            name='Character 2',
            author=cls.user
        )

        # Create a relationship
        cls.relationship = CharacterRelationship.objects.create(
            from_character=cls.character1,
            to_character=cls.character2,
            types=[RelationshipType.FRIEND, RelationshipType.MENTOR],
            description='Test relationship description'
        )

    def test_relationship_serializer(self):
        serializer = CharacterRelationshipSerializer(self.relationship)
        # Convert UUID objects to strings for comparison
        self.assertEqual(str(serializer.data['from_character']), str(self.character1.id))
        self.assertEqual(str(serializer.data['to_character']), str(self.character2.id))
        self.assertEqual(serializer.data['types'], [RelationshipType.FRIEND, RelationshipType.MENTOR])
        self.assertEqual(serializer.data['description'], 'Test relationship description')


class CharacterArcSerializerTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.user = User.objects.create_user(username='testuser', password='12345')

        # Create a character
        cls.character = Character.objects.create(
            name='Test Character',
            author=cls.user
        )

        # Create a character arc
        cls.arc = CharacterArc.objects.create(
            character=cls.character,
            author=cls.user,
            description='Test character arc description',
            arc_type=CharacterArcType.POSITIVE,
            start_trait='Shy',
            end_trait='Confident',
            change_trigger='Overcame fear'
        )

    def test_arc_serializer(self):
        serializer = CharacterArcSerializer(self.arc)
        # Convert UUID objects to strings for comparison
        self.assertEqual(str(serializer.data['character']), str(self.character.id))
        self.assertEqual(serializer.data['description'], 'Test character arc description')
        self.assertEqual(serializer.data['arc_type'], CharacterArcType.POSITIVE)
        self.assertEqual(serializer.data['start_trait'], 'Shy')
        self.assertEqual(serializer.data['end_trait'], 'Confident')
        self.assertEqual(serializer.data['change_trigger'], 'Overcame fear')


class PlaceSerializerTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.user = User.objects.create_user(username='testuser', password='12345')

        # Create a parent place
        cls.parent_place = Place.objects.create(
            name='Parent Place',
            author=cls.user,
            adjectives='big, spacious'
        )

        # Create a child place
        cls.child_place = Place.objects.create(
            name='Child Place',
            author=cls.user,
            parent=cls.parent_place,
            adjectives='small, cozy'
        )

    def test_place_serializer(self):
        serializer = PlaceSerializer(self.parent_place)
        self.assertEqual(serializer.data['name'], 'Parent Place')
        self.assertEqual(serializer.data['adjectives'], 'big, spacious')
        self.assertEqual(len(serializer.data['places']), 1)
        self.assertEqual(serializer.data['places'][0]['name'], 'Child Place')


class ItemsSerializerTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.user = User.objects.create_user(username='testuser', password='12345')

        # Create a character
        cls.character = Character.objects.create(
            name='Test Character',
            author=cls.user
        )

        # Create an item
        cls.item = Item.objects.create(
            name='Test Item',
            author=cls.user,
            origin='Test origin'
        )

        # Add owner to the item
        cls.item.owners.add(cls.character)

    def test_item_serializer(self):
        serializer = ItemSerializer(self.item)
        self.assertEqual(serializer.data['name'], 'Test Item')
        self.assertEqual(serializer.data['origin'], 'Test origin')
        self.assertEqual(len(serializer.data['owners']), 1)
        self.assertEqual(serializer.data['owners'][0]['name'], 'Test Character')


class StorySerializerTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.user = User.objects.create_user(username='testuser', password='12345')

        # Create a story
        cls.story = Story.objects.create(
            title='Test Story',
            author=cls.user,
            promise='Test promise',
            plot='Test plot',
            emotional_matter='Test emotional matter',
            universal_truth='Test universal truth',
            logline='Test logline'
        )

        # Create chapters
        cls.chapter1 = Chapter.objects.create(
            story=cls.story,
            order=1,
            title='Chapter 1',
            content='Chapter 1 content'
        )

        cls.chapter2 = Chapter.objects.create(
            story=cls.story,
            order=2,
            title='Chapter 2',
            content='Chapter 2 content'
        )

    def test_story_serializer(self):
        serializer = StorySerializer(self.story)
        self.assertEqual(serializer.data['title'], 'Test Story')
        self.assertEqual(serializer.data['promise'], 'Test promise')
        self.assertEqual(serializer.data['plot'], 'Test plot')
        self.assertEqual(serializer.data['emotional_matter'], 'Test emotional matter')
        self.assertEqual(serializer.data['universal_truth'], 'Test universal truth')
        self.assertEqual(serializer.data['logline'], 'Test logline')
        self.assertEqual(len(serializer.data['chapters']), 2)
        self.assertEqual(serializer.data['chapters'][0]['title'], 'Chapter 1')
        self.assertEqual(serializer.data['chapters'][1]['title'], 'Chapter 2')


class ChapterSerializerTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.user = User.objects.create_user(username='testuser', password='12345')

        # Create a story
        cls.story = Story.objects.create(
            title='Test Story',
            author=cls.user
        )

        # Create a chapter
        cls.chapter = Chapter.objects.create(
            story=cls.story,
            order=1,
            title='Test Chapter',
            content='Test content'
        )

    def test_chapter_serializer(self):
        serializer = ChapterSerializer(self.chapter)
        # Convert UUID objects to strings for comparison
        self.assertEqual(str(serializer.data['story']), str(self.story.id))
        self.assertEqual(serializer.data['order'], 1)
        self.assertEqual(serializer.data['title'], 'Test Chapter')
        self.assertEqual(serializer.data['content'], 'Test content')


class SceneSerializerTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.user = User.objects.create_user(username='testuser', password='12345')

        # Create a place
        cls.place = Place.objects.create(
            name='Test Place',
            author=cls.user
        )

        # Create characters
        cls.character1 = Character.objects.create(
            name='Character 1',
            author=cls.user
        )

        cls.character2 = Character.objects.create(
            name='Character 2',
            author=cls.user
        )

        # Create items
        cls.item1 = Item.objects.create(
            name='Item 1',
            author=cls.user
        )

        cls.item2 = Item.objects.create(
            name='Item 2',
            author=cls.user
        )

        # Create a scene
        cls.scene = Scene.objects.create(
            author=cls.user,
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

    def test_scene_serializer(self):
        serializer = SceneSerializer(self.scene)
        self.assertEqual(serializer.data['short_description'], 'Test scene description')
        self.assertEqual(serializer.data['place']['name'], 'Test Place')
        self.assertEqual(serializer.data['external_conflict'], 'Test external conflict')
        self.assertEqual(serializer.data['interpersonal_conflict'], 'Test interpersonal conflict')
        self.assertEqual(serializer.data['internal_conflict'], 'Test internal conflict')
        self.assertEqual(serializer.data['time_order'], 1)
        self.assertEqual(len(serializer.data['characters']), 2)
        self.assertEqual(len(serializer.data['items']), 2)


class IdeaSerializerTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.user = User.objects.create_user(username='testuser', password='12345')

        # Create an idea
        cls.idea = Idea.objects.create(
            author=cls.user,
            content='Test idea content',
            type=IdeaType.CHARACTER,
            tags=['protagonist', 'hero'],
            linked_elements=['some-uuid-1', 'some-uuid-2']
        )

    def test_idea_serializer(self):
        serializer = IdeaSerializer(self.idea)
        self.assertEqual(serializer.data['content'], 'Test idea content')
        self.assertEqual(serializer.data['type'], IdeaType.CHARACTER)
        self.assertEqual(serializer.data['tags'], ['protagonist', 'hero'])
        self.assertEqual(serializer.data['linked_elements'], ['some-uuid-1', 'some-uuid-2'])
