from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import (
    Character, CharacterArc, Place, Item,
    Story, Scene, Idea, Chapter, Race, CharacterTrait,
    CharacterRelationship
)
from .serializers import (
    UserSerializer, CharacterSerializer, CharacterArcSerializer,
    PlaceSerializer, ItemSerializer, StorySerializer, SceneSerializer,
    IdeaSerializer, ChapterSerializer, RaceSerializer, CharacterTraitSerializer,
    CharacterRelationshipSerializer
)

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]



class CharacterViewSet(viewsets.ModelViewSet):
    serializer_class = CharacterSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Character.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class CharacterArcViewSet(viewsets.ModelViewSet):
    serializer_class = CharacterArcSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CharacterArc.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class PlaceViewSet(viewsets.ModelViewSet):
    serializer_class = PlaceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Place.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Item.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class StoryViewSet(viewsets.ModelViewSet):
    serializer_class = StorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Story.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class SceneViewSet(viewsets.ModelViewSet):
    serializer_class = SceneSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Scene.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class IdeaViewSet(viewsets.ModelViewSet):
    serializer_class = IdeaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Idea.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class ChapterViewSet(viewsets.ModelViewSet):
    serializer_class = ChapterSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Chapter.objects.filter(story__author=self.request.user)

class RaceViewSet(viewsets.ModelViewSet):
    serializer_class = RaceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Race.objects.all()

class CharacterTraitViewSet(viewsets.ModelViewSet):
    serializer_class = CharacterTraitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CharacterTrait.objects.all()

class CharacterRelationshipViewSet(viewsets.ModelViewSet):
    serializer_class = CharacterRelationshipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CharacterRelationship.objects.filter(
            from_character__author=self.request.user
        )
