import uuid
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('description', models.TextField()),
                ('time_order', models.IntegerField(default=0)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='events', to='auth.user')),
                ('characters', models.ManyToManyField(blank=True, related_name='events', to='api.character')),
                ('items', models.ManyToManyField(blank=True, related_name='events', to='api.item')),
                ('place', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='events', to='api.place')),
            ],
        ),
        migrations.AddField(
            model_name='story',
            name='events',
            field=models.ManyToManyField(blank=True, related_name='stories', to='api.event'),
        ),
        migrations.AddField(
            model_name='scene',
            name='shown_events',
            field=models.ManyToManyField(blank=True, related_name='shown_in_scenes', to='api.event'),
        ),
        migrations.AddField(
            model_name='scene',
            name='told_events',
            field=models.ManyToManyField(blank=True, related_name='told_in_scenes', to='api.event'),
        ),
        migrations.AddField(
            model_name='chapter',
            name='included_scenes',
            field=models.ManyToManyField(blank=True, related_name='chapters', to='api.scene'),
        ),
    ]
