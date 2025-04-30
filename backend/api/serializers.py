from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Story, Character, Chapter

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class CharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Character
        fields = ['id', 'name', 'description', 'story', 'created_at', 'updated_at']

class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ['id', 'title', 'content', 'story', 'order', 'created_at', 'updated_at']

class StorySerializer(serializers.ModelSerializer):
    characters = CharacterSerializer(many=True, read_only=True)
    chapters = ChapterSerializer(many=True, read_only=True)
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Story
        fields = ['id', 'title', 'description', 'author', 'characters', 'chapters', 'created_at', 'updated_at']
