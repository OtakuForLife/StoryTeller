from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, ProjectViewSet, CharacterViewSet, CharacterArcViewSet,
    PlaceViewSet, ItemsViewSet, StoryViewSet, SceneViewSet,
    IdeaViewSet, ChapterViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'characters', CharacterViewSet, basename='character')
router.register(r'character-arcs', CharacterArcViewSet, basename='character-arc')
router.register(r'places', PlaceViewSet, basename='place')
router.register(r'items', ItemsViewSet, basename='item')
router.register(r'stories', StoryViewSet, basename='story')
router.register(r'scenes', SceneViewSet, basename='scene')
router.register(r'ideas', IdeaViewSet, basename='idea')
router.register(r'chapters', ChapterViewSet, basename='chapter')

urlpatterns = [
    path('', include(router.urls)),
]
