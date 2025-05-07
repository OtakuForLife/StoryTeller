from rest_framework import serializers
from .models import (
    Character, CharacterArc, Place, Item,
    Story, Scene, Idea, Chapter, Race, CharacterTrait,
    CharacterRelationship, Gender, CharacterArcType, RelationshipType,
    Event
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

    class Meta:
        model = CharacterArc
        fields = [
            'id', 'character', 'description',
            'arc_type', 'start_trait', 'end_trait', 'change_trigger'
        ]

class CharacterRelationshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = CharacterRelationship
        fields = ['id', 'from_character', 'to_character', 'types', 'description']

class CharacterSerializer(serializers.ModelSerializer):
    arcs = CharacterArcSerializer(many=True, read_only=True)
    race = RaceSerializer(read_only=True)
    relationships_from = CharacterRelationshipSerializer(many=True, read_only=True)
    relationships_to = CharacterRelationshipSerializer(many=True, read_only=True)

    class Meta:
        model = Character
        fields = [
            'id', 'name', 'surname', 'nickname',
            'gender', 'race', 'arcs', 'relationships_from', 'relationships_to'
        ]

class PlaceSerializer(serializers.ModelSerializer):
    places = serializers.SerializerMethodField()

    class Meta:
        model = Place
        fields = ['id', 'name', 'parent', 'places', 'adjectives']

    def get_places(self, obj):
        places = obj.places.all()
        return PlaceSerializer(places, many=True, context=self.context).data if places else []

class ItemSerializer(serializers.ModelSerializer):
    owners = CharacterSerializer(many=True, read_only=True)

    class Meta:
        model = Item
        fields = ['id', 'name', 'origin', 'owners']

class EventSerializer(serializers.ModelSerializer):
    characters = CharacterSerializer(many=True, read_only=True)
    place = PlaceSerializer(read_only=True)
    items = ItemSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = ['id', 'description', 'characters', 'place', 'items', 'time_order']

class SceneSerializer(serializers.ModelSerializer):
    characters = CharacterSerializer(many=True, read_only=True)
    items = ItemSerializer(many=True, read_only=True)
    place = PlaceSerializer(read_only=True)
    shown_events = EventSerializer(many=True, read_only=True)
    told_events = EventSerializer(many=True, read_only=True)

    class Meta:
        model = Scene
        fields = [
            'id', 'short_description', 'characters', 'place',
            'items', 'shown_events', 'told_events', 'external_conflict',
            'interpersonal_conflict', 'internal_conflict', 'time_order'
        ]

class IdeaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Idea
        fields = ['id', 'content', 'type', 'tags', 'linked_elements']

class ChapterSerializer(serializers.ModelSerializer):
    included_scenes = SceneSerializer(many=True, read_only=True)

    class Meta:
        model = Chapter
        fields = ['id', 'story', 'included_scenes', 'order', 'title', 'content']

class StorySerializer(serializers.ModelSerializer):
    chapters = ChapterSerializer(many=True, read_only=True)
    events = EventSerializer(many=True, read_only=True)

    class Meta:
        model = Story
        fields = [
            'id', 'title', 'promise', 'plot', 'emotional_matter',
            'universal_truth', 'logline', 'events', 'chapters'
        ]
