from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from notifications.views import (
    TriggerViewSet, NotificationTemplateViewSet,
    NotificationLogViewSet, UserSessionViewSet, AdminDashboardViewSet
)

router = DefaultRouter()
router.register(r'triggers', TriggerViewSet, basename='trigger')
router.register(r'templates', NotificationTemplateViewSet, basename='template')
router.register(r'logs', NotificationLogViewSet, basename='log')
router.register(r'users', UserSessionViewSet, basename='user')
router.register(r'admin', AdminDashboardViewSet, basename='admin')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]
