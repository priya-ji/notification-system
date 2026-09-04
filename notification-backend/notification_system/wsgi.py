import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'notification_system.settings')


def initialize_serverless_database():
    """Create the demo schema in Vercel's writable temporary filesystem."""
    if os.environ.get('VERCEL'):
        import django
        from django.core.management import call_command

        django.setup()
        call_command('migrate', interactive=False, verbosity=0)


initialize_serverless_database()

application = get_wsgi_application()
