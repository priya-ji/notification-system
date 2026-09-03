from django.db import migrations


DEFAULT_TRIGGERS = [
    ("login", "User signs in to the website."),
    ("logout", "User signs out of the website."),
    ("not_logged_1day", "User has not visited the website for 24 hours."),
    ("not_logged_1week", "User has not visited the website for 7 days."),
    ("password_reset", "User requests a password reset."),
    ("order_placed", "User completes a purchase."),
]


def seed_default_triggers(apps, schema_editor):
    Trigger = apps.get_model("notifications", "Trigger")
    for name, description in DEFAULT_TRIGGERS:
        Trigger.objects.get_or_create(name=name, defaults={"description": description})


def remove_default_triggers(apps, schema_editor):
    Trigger = apps.get_model("notifications", "Trigger")
    Trigger.objects.filter(name__in=[name for name, _ in DEFAULT_TRIGGERS]).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("notifications", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_default_triggers, remove_default_triggers),
    ]
