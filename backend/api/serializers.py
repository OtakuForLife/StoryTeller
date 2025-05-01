from rest_framework import serializers
from .models import (
    Project, Character, CharacterArc, Place, Items,
    Story, Scene, Idea, Chapter
)
from accounts.serializers import UserSerializer

class ProjectSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'author']

class CharacterArcSerializer(serializers.ModelSerializer):
    class Meta:
        model = CharacterArc
        fields = ['id', 'project', 'character', 'description']

class CharacterSerializer(serializers.ModelSerializer):
    arcs = CharacterArcSerializer(many=True, read_only=True)

    class Meta:
        model = Character
        fields = ['id', 'project', 'name', 'surname', 'nickname', 'arcs']

class PlaceSerializer(serializers.ModelSerializer):
    places = serializers.SerializerMethodField()

    class Meta:
        model = Place
        fields = ['id', 'project', 'name', 'parent', 'places', 'adjectives']

    def get_places(self, obj):
        places = obj.places.all()
        return PlaceSerializer(places, many=True, context=self.context).data if places else []

class ItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Items
        fields = ['id', 'project', 'name']

class SceneSerializer(serializers.ModelSerializer):
    characters = CharacterSerializer(many=True, read_only=True)
    items = ItemsSerializer(many=True, read_only=True)

    class Meta:
        model = Scene
        fields = [
            'id', 'project', 'short_description', 'characters', 'place',
            'items', 'external_conflict', 'interpersonal_conflict',
            'internal_conflict', 'time_order'
        ]

class IdeaSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Idea
        fields = ['id', 'author', 'project', 'content', 'type']

class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ['id', 'story', 'order', 'title', 'content']

class StorySerializer(serializers.ModelSerializer):
    chapters = ChapterSerializer(many=True, read_only=True)

    class Meta:
        model = Story
        fields = [
            'id', 'project', 'title', 'promise', 'plot', 'emotional_matter',
            'universal_truth', 'logline', 'chapters'
        ]
