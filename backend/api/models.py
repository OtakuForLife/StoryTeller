import uuid
from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')

    def __str__(self):
        return self.name

class Character(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='characters')
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255, blank=True)
    nickname = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.name

class CharacterArc(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='character_arcs')
    character = models.ForeignKey(Character, on_delete=models.CASCADE, related_name='arcs')
    description = models.TextField()

    def __str__(self):
        return f"Arc for {self.character.name}"

class Place(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='places')
    name = models.CharField(max_length=255)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='places')
    adjectives = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Items(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Items"

class Story(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='stories')
    title = models.CharField(max_length=255)
    promise = models.TextField(blank=True)
    plot = models.TextField(blank=True)
    emotional_matter = models.TextField(blank=True)
    universal_truth = models.TextField(blank=True)
    logline = models.TextField(blank=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Stories"

class Scene(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='scenes')
    short_description = models.TextField()
    characters = models.ManyToManyField(Character, related_name='scenes', blank=True)
    place = models.ForeignKey(Place, on_delete=models.SET_NULL, null=True, blank=True, related_name='scenes')
    items = models.ManyToManyField(Items, related_name='scenes', blank=True)
    external_conflict = models.TextField(blank=True)
    interpersonal_conflict = models.TextField(blank=True)
    internal_conflict = models.TextField(blank=True)
    time_order = models.IntegerField(default=0)

    def __str__(self):
        return self.short_description

class IdeaType(models.TextChoices):
    CHARACTER = 'CHARACTER', 'Character'
    PLACE = 'PLACE', 'Place'
    ITEM = 'ITEM', 'Item'
    SCENE = 'SCENE', 'Scene'

class Idea(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ideas')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='ideas')
    content = models.TextField()
    type = models.CharField(max_length=20, choices=IdeaType.choices)

    def __str__(self):
        return f"{self.get_type_display()} idea: {self.content[:50]}"

class Chapter(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='chapters')
    order = models.IntegerField(default=0)
    title = models.TextField()
    content = models.TextField(blank=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['order']
