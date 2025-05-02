from django.test import TestCase
from django.contrib.auth.models import User
from api.models import (
    Character, CharacterArc, Place, Item,
    Story, Scene, Idea, IdeaType, Chapter, Race, CharacterTrait,
    CharacterRelationship, Gender, CharacterArcType, RelationshipType
)



class RaceModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a race
        cls.race = Race.objects.create(
            name='Test Race',
            description='Test race description'
        )

    def test_name_max_length(self):
        max_length = self.race._meta.get_field('name').max_length
        self.assertEqual(max_length, 255)

    def test_object_name_is_name(self):
        expected_object_name = self.race.name
        self.assertEqual(str(self.race), expected_object_name)

class CharacterTraitModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a character trait
        cls.trait = CharacterTrait.objects.create(
            name='Test Trait',
            description='Test trait description'
        )

    def test_name_max_length(self):
        max_length = self.trait._meta.get_field('name').max_length
        self.assertEqual(max_length, 255)

    def test_object_name_is_name(self):
        expected_object_name = self.trait.name
        self.assertEqual(str(self.trait), expected_object_name)

class CharacterModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.test_user = User.objects.create_user(username='testuser', password='12345')

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
            author=cls.test_user,
            gender=Gender.MALE,
            race=cls.race
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



    def test_author_relationship(self):
        self.assertEqual(self.character.author, self.test_user)

    def test_gender_field(self):
        self.assertEqual(self.character.gender, Gender.MALE)

    def test_race_relationship(self):
        self.assertEqual(self.character.race, self.race)

class CharacterRelationshipModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.test_user = User.objects.create_user(username='testuser', password='12345')

        # Create characters
        cls.character1 = Character.objects.create(
            name='Character 1',
            author=cls.test_user
        )

        cls.character2 = Character.objects.create(
            name='Character 2',
            author=cls.test_user
        )

        # Create a relationship
        cls.relationship = CharacterRelationship.objects.create(
            from_character=cls.character1,
            to_character=cls.character2,
            types=[RelationshipType.FRIEND, RelationshipType.MENTOR],
            description='Test relationship description'
        )

    def test_object_name(self):
        expected_object_name = f"Relationship from {self.character1.name} to {self.character2.name}"
        self.assertEqual(str(self.relationship), expected_object_name)

    def test_from_character_relationship(self):
        self.assertEqual(self.relationship.from_character, self.character1)

    def test_to_character_relationship(self):
        self.assertEqual(self.relationship.to_character, self.character2)

    def test_types_field(self):
        self.assertEqual(self.relationship.types, [RelationshipType.FRIEND, RelationshipType.MENTOR])

class CharacterArcModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.test_user = User.objects.create_user(username='testuser', password='12345')

        # Create a character
        cls.character = Character.objects.create(
            name='Test Character',
            author=cls.test_user
        )

        # Create a character arc
        cls.arc = CharacterArc.objects.create(
            character=cls.character,
            author=cls.test_user,
            description='Test character arc description',
            arc_type=CharacterArcType.POSITIVE,
            start_trait='Shy',
            end_trait='Confident',
            change_trigger='Overcame fear'
        )

    def test_object_name(self):
        expected_object_name = f"Arc for {self.character.name}"
        self.assertEqual(str(self.arc), expected_object_name)



    def test_character_relationship(self):
        self.assertEqual(self.arc.character, self.character)

    def test_author_relationship(self):
        self.assertEqual(self.arc.author, self.test_user)

    def test_arc_type_field(self):
        self.assertEqual(self.arc.arc_type, CharacterArcType.POSITIVE)

    def test_trait_fields(self):
        self.assertEqual(self.arc.start_trait, 'Shy')
        self.assertEqual(self.arc.end_trait, 'Confident')
        self.assertEqual(self.arc.change_trigger, 'Overcame fear')

class PlaceModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.test_user = User.objects.create_user(username='testuser', password='12345')

        # Create a parent place
        cls.parent_place = Place.objects.create(
            name='Parent Place',
            author=cls.test_user,
            adjectives='big, spacious'
        )

        # Create a child place
        cls.child_place = Place.objects.create(
            name='Child Place',
            author=cls.test_user,
            parent=cls.parent_place,
            adjectives='small, cozy'
        )

    def test_name_max_length(self):
        max_length = self.parent_place._meta.get_field('name').max_length
        self.assertEqual(max_length, 255)

    def test_object_name_is_name(self):
        expected_object_name = self.parent_place.name
        self.assertEqual(str(self.parent_place), expected_object_name)



    def test_author_relationship(self):
        self.assertEqual(self.parent_place.author, self.test_user)

    def test_parent_child_relationship(self):
        self.assertEqual(self.child_place.parent, self.parent_place)
        self.assertIn(self.child_place, self.parent_place.places.all())

class ItemModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.test_user = User.objects.create_user(username='testuser', password='12345')

        # Create a character
        cls.character = Character.objects.create(
            name='Test Character',
            author=cls.test_user
        )

        # Create an item
        cls.item = Item.objects.create(
            name='Test Item',
            author=cls.test_user,
            origin='Test origin'
        )

        # Add owner to the item
        cls.item.owners.add(cls.character)

    def test_name_max_length(self):
        max_length = self.item._meta.get_field('name').max_length
        self.assertEqual(max_length, 255)

    def test_object_name_is_name(self):
        expected_object_name = self.item.name
        self.assertEqual(str(self.item), expected_object_name)



    def test_author_relationship(self):
        self.assertEqual(self.item.author, self.test_user)

    def test_origin_field(self):
        self.assertEqual(self.item.origin, 'Test origin')

    def test_owners_relationship(self):
        self.assertEqual(self.item.owners.count(), 1)
        self.assertIn(self.character, self.item.owners.all())

    def test_verbose_name_plural(self):
        self.assertEqual(Item._meta.verbose_name_plural, 'Items')

class StoryModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.test_user = User.objects.create_user(username='testuser', password='12345')

        # Create a story
        cls.story = Story.objects.create(
            title='Test Story',
            author=cls.test_user,
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



    def test_author_relationship(self):
        self.assertEqual(self.story.author, self.test_user)

    def test_content_fields(self):
        self.assertEqual(self.story.promise, 'Test promise')
        self.assertEqual(self.story.plot, 'Test plot')
        self.assertEqual(self.story.emotional_matter, 'Test emotional matter')
        self.assertEqual(self.story.universal_truth, 'Test universal truth')
        self.assertEqual(self.story.logline, 'Test logline')

    def test_verbose_name_plural(self):
        self.assertEqual(Story._meta.verbose_name_plural, 'Stories')

class SceneModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.test_user = User.objects.create_user(username='testuser', password='12345')

        # Create a place
        cls.place = Place.objects.create(
            name='Test Place',
            author=cls.test_user
        )

        # Create characters
        cls.character1 = Character.objects.create(
            name='Character 1',
            author=cls.test_user
        )

        cls.character2 = Character.objects.create(
            name='Character 2',
            author=cls.test_user
        )

        # Create items
        cls.item1 = Item.objects.create(
            name='Item 1',
            author=cls.test_user
        )

        cls.item2 = Item.objects.create(
            name='Item 2',
            author=cls.test_user
        )

        # Create a scene
        cls.scene = Scene.objects.create(
            author=cls.test_user,
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



    def test_author_relationship(self):
        self.assertEqual(self.scene.author, self.test_user)

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

    def test_conflict_fields(self):
        self.assertEqual(self.scene.external_conflict, 'Test external conflict')
        self.assertEqual(self.scene.interpersonal_conflict, 'Test interpersonal conflict')
        self.assertEqual(self.scene.internal_conflict, 'Test internal conflict')

class IdeaModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.test_user = User.objects.create_user(username='testuser', password='12345')

        # Create ideas of different types
        cls.character_idea = Idea.objects.create(
            author=cls.test_user,
            content='Test character idea',
            type=IdeaType.CHARACTER,
            tags=['protagonist', 'hero'],
            linked_elements=['some-uuid-1', 'some-uuid-2']
        )

        cls.place_idea = Idea.objects.create(
            author=cls.test_user,
            content='Test place idea',
            type=IdeaType.PLACE
        )

        cls.item_idea = Idea.objects.create(
            author=cls.test_user,
            content='Test item idea',
            type=IdeaType.ITEM
        )

        cls.scene_idea = Idea.objects.create(
            author=cls.test_user,
            content='Test scene idea',
            type=IdeaType.SCENE
        )

        cls.conflict_idea = Idea.objects.create(
            author=cls.test_user,
            content='Test conflict idea',
            type=IdeaType.CONFLICT
        )

        cls.dialogue_idea = Idea.objects.create(
            author=cls.test_user,
            content='Test dialogue idea',
            type=IdeaType.DIALOGUE
        )

        cls.concept_idea = Idea.objects.create(
            author=cls.test_user,
            content='Test concept idea',
            type=IdeaType.CONCEPT
        )

        cls.world_detail_idea = Idea.objects.create(
            author=cls.test_user,
            content='Test world detail idea',
            type=IdeaType.WORLD_DETAIL
        )

        cls.plot_twist_idea = Idea.objects.create(
            author=cls.test_user,
            content='Test plot twist idea',
            type=IdeaType.PLOT_TWIST
        )

    def test_object_name(self):
        expected_object_name = f"Character idea: {self.character_idea.content[:50]}"
        self.assertEqual(str(self.character_idea), expected_object_name)

    def test_author_relationship(self):
        self.assertEqual(self.character_idea.author, self.test_user)



    def test_tags_field(self):
        self.assertEqual(self.character_idea.tags, ['protagonist', 'hero'])

    def test_linked_elements_field(self):
        self.assertEqual(self.character_idea.linked_elements, ['some-uuid-1', 'some-uuid-2'])

    def test_idea_types(self):
        self.assertEqual(self.character_idea.type, IdeaType.CHARACTER)
        self.assertEqual(self.place_idea.type, IdeaType.PLACE)
        self.assertEqual(self.item_idea.type, IdeaType.ITEM)
        self.assertEqual(self.scene_idea.type, IdeaType.SCENE)
        self.assertEqual(self.conflict_idea.type, IdeaType.CONFLICT)
        self.assertEqual(self.dialogue_idea.type, IdeaType.DIALOGUE)
        self.assertEqual(self.concept_idea.type, IdeaType.CONCEPT)
        self.assertEqual(self.world_detail_idea.type, IdeaType.WORLD_DETAIL)
        self.assertEqual(self.plot_twist_idea.type, IdeaType.PLOT_TWIST)

class ChapterModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user
        cls.test_user = User.objects.create_user(username='testuser', password='12345')

        # Create a story
        cls.story = Story.objects.create(
            title='Test Story',
            author=cls.test_user
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
