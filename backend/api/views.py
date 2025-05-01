from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import (
    Project, Character, CharacterArc, Place, Items,
    Story, Scene, Idea, Chapter
)
from .serializers import (
    UserSerializer, ProjectSerializer, CharacterSerializer, CharacterArcSerializer,
    PlaceSerializer, ItemsSerializer, StorySerializer, SceneSerializer,
    IdeaSerializer, ChapterSerializer
)

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class CharacterViewSet(viewsets.ModelViewSet):
    serializer_class = CharacterSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Character.objects.filter(project__author=self.request.user)

class CharacterArcViewSet(viewsets.ModelViewSet):
    serializer_class = CharacterArcSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CharacterArc.objects.filter(project__author=self.request.user)

class PlaceViewSet(viewsets.ModelViewSet):
    serializer_class = PlaceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Place.objects.filter(project__author=self.request.user)

class ItemsViewSet(viewsets.ModelViewSet):
    serializer_class = ItemsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Items.objects.filter(project__author=self.request.user)

class StoryViewSet(viewsets.ModelViewSet):
    serializer_class = StorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Story.objects.filter(project__author=self.request.user)

class SceneViewSet(viewsets.ModelViewSet):
    serializer_class = SceneSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Scene.objects.filter(project__author=self.request.user)

class IdeaViewSet(viewsets.ModelViewSet):
    serializer_class = IdeaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Idea.objects.filter(project__author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class ChapterViewSet(viewsets.ModelViewSet):
    serializer_class = ChapterSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Chapter.objects.filter(story__project__author=self.request.user)
