from django.db import models
from django.contrib.auth.models import User

class Story(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stories')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Stories"

class Character(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='characters')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Chapter(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True)
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='chapters')
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['order']
