import uuid
from django.db import models
from django.contrib.auth.models import User

class Gender(models.TextChoices):
    MALE = 'MALE', 'Male'
    FEMALE = 'FEMALE', 'Female'

class Race(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class CharacterTrait(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Character(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='characters')
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255, blank=True)
    nickname = models.CharField(max_length=255, blank=True)
    gender = models.CharField(max_length=10, choices=Gender.choices, blank=True)
    race = models.ForeignKey(Race, on_delete=models.SET_NULL, null=True, blank=True, related_name='characters')

    def __str__(self):
        return self.name

class RelationshipType(models.TextChoices):
    FRIEND = 'FRIEND', 'Friend'
    ENEMY = 'ENEMY', 'Enemy'
    MENTOR = 'MENTOR', 'Mentor'
    LOVER = 'LOVER', 'Lover'
    FAMILY = 'FAMILY', 'Family'

class CharacterRelationship(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    from_character = models.ForeignKey(Character, on_delete=models.CASCADE, related_name='relationships_from')
    to_character = models.ForeignKey(Character, on_delete=models.CASCADE, related_name='relationships_to')
    types = models.JSONField(default=list)  # Store multiple relationship types as a list
    description = models.TextField(blank=True)

    def __str__(self):
        return f"Relationship from {self.from_character.name} to {self.to_character.name}"

class CharacterArcType(models.TextChoices):
    POSITIVE = 'POSITIVE', 'Positive'
    NEGATIVE = 'NEGATIVE', 'Negative'
    FLAT = 'FLAT', 'Flat'

class CharacterArc(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    character = models.ForeignKey(Character, on_delete=models.CASCADE, related_name='arcs')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='character_arcs')
    description = models.TextField()
    arc_type = models.CharField(max_length=10, choices=CharacterArcType.choices, default=CharacterArcType.POSITIVE)
    start_trait = models.TextField(blank=True)
    end_trait = models.TextField(blank=True)
    change_trigger = models.TextField(blank=True)

    def __str__(self):
        return f"Arc for {self.character.name}"

class Place(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='places')
    name = models.CharField(max_length=255)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='places')
    adjectives = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Item(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=255)
    origin = models.TextField(blank=True)
    owners = models.ManyToManyField(Character, related_name='owned_items', blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Items"

class Story(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stories')
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
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scenes')
    short_description = models.TextField()
    characters = models.ManyToManyField(Character, related_name='scenes', blank=True)
    place = models.ForeignKey(Place, on_delete=models.SET_NULL, null=True, blank=True, related_name='scenes')
    items = models.ManyToManyField(Item, related_name='scenes', blank=True)
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
    CONFLICT = 'CONFLICT', 'Conflict'
    DIALOGUE = 'DIALOGUE', 'Dialogue'
    CONCEPT = 'CONCEPT', 'Concept'
    WORLD_DETAIL = 'WORLD_DETAIL', 'World Detail'
    PLOT_TWIST = 'PLOT_TWIST', 'Plot Twist'

class Idea(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ideas')
    content = models.TextField()
    type = models.CharField(max_length=20, choices=IdeaType.choices)
    tags = models.JSONField(default=list)  # Store tags as a list
    linked_elements = models.JSONField(default=list)  # Store UUIDs as a list

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
