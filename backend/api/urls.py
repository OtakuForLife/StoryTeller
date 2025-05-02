from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, CharacterViewSet, CharacterArcViewSet,
    PlaceViewSet, ItemViewSet, StoryViewSet, SceneViewSet,
    IdeaViewSet, ChapterViewSet, RaceViewSet, CharacterTraitViewSet,
    CharacterRelationshipViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'characters', CharacterViewSet, basename='character')
router.register(r'character-arcs', CharacterArcViewSet, basename='character-arc')
router.register(r'character-relationships', CharacterRelationshipViewSet, basename='character-relationship')
router.register(r'places', PlaceViewSet, basename='place')
router.register(r'items', ItemViewSet, basename='item')
router.register(r'stories', StoryViewSet, basename='story')
router.register(r'scenes', SceneViewSet, basename='scene')
router.register(r'ideas', IdeaViewSet, basename='idea')
router.register(r'chapters', ChapterViewSet, basename='chapter')
router.register(r'races', RaceViewSet, basename='race')
router.register(r'character-traits', CharacterTraitViewSet, basename='character-trait')

urlpatterns = [
    path('', include(router.urls)),
]
