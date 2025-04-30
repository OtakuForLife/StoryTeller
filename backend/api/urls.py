from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, StoryViewSet, CharacterViewSet, ChapterViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'stories', StoryViewSet, basename='story')
router.register(r'characters', CharacterViewSet, basename='character')
router.register(r'chapters', ChapterViewSet, basename='chapter')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('rest_framework.urls')),
]
