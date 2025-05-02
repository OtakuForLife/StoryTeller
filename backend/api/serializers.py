from rest_framework import serializers
from .models import (
    Character, CharacterArc, Place, Item,
    Story, Scene, Idea, Chapter, Race, CharacterTrait,
    CharacterRelationship, Gender, CharacterArcType, RelationshipType
)
from accounts.serializers import UserSerializer

class RaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Race
        fields = ['id', 'name', 'description']

class CharacterTraitSerializer(serializers.ModelSerializer):
    class Meta:
        model = CharacterTrait
        fields = ['id', 'name', 'description']

class CharacterArcSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = CharacterArc
        fields = [
            'id', 'character', 'author', 'description',
            'arc_type', 'start_trait', 'end_trait', 'change_trigger'
        ]

class CharacterRelationshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = CharacterRelationship
        fields = ['id', 'from_character', 'to_character', 'types', 'description']

class CharacterSerializer(serializers.ModelSerializer):
    arcs = CharacterArcSerializer(many=True, read_only=True)
    race = RaceSerializer(read_only=True)
    author = UserSerializer(read_only=True)
    relationships_from = CharacterRelationshipSerializer(many=True, read_only=True)
    relationships_to = CharacterRelationshipSerializer(many=True, read_only=True)

    class Meta:
        model = Character
        fields = [
            'id', 'author', 'name', 'surname', 'nickname',
            'gender', 'race', 'arcs', 'relationships_from', 'relationships_to'
        ]

class PlaceSerializer(serializers.ModelSerializer):
    places = serializers.SerializerMethodField()
    author = UserSerializer(read_only=True)

    class Meta:
        model = Place
        fields = ['id', 'author', 'name', 'parent', 'places', 'adjectives']

    def get_places(self, obj):
        places = obj.places.all()
        return PlaceSerializer(places, many=True, context=self.context).data if places else []

class ItemSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    owners = CharacterSerializer(many=True, read_only=True)

    class Meta:
        model = Item
        fields = ['id', 'author', 'name', 'origin', 'owners']

class SceneSerializer(serializers.ModelSerializer):
    characters = CharacterSerializer(many=True, read_only=True)
    items = ItemSerializer(many=True, read_only=True)
    author = UserSerializer(read_only=True)
    place = PlaceSerializer(read_only=True)

    class Meta:
        model = Scene
        fields = [
            'id', 'author', 'short_description', 'characters', 'place',
            'items', 'external_conflict', 'interpersonal_conflict',
            'internal_conflict', 'time_order'
        ]

class IdeaSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Idea
        fields = ['id', 'author', 'content', 'type', 'tags', 'linked_elements']

class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ['id', 'story', 'order', 'title', 'content']

class StorySerializer(serializers.ModelSerializer):
    chapters = ChapterSerializer(many=True, read_only=True)
    author = UserSerializer(read_only=True)

    class Meta:
        model = Story
        fields = [
            'id', 'author', 'title', 'promise', 'plot', 'emotional_matter',
            'universal_truth', 'logline', 'chapters'
        ]
