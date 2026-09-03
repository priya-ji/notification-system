from rest_framework import serializers
from .models import Trigger, NotificationTemplate, NotificationLog, UserSession


class NotificationTemplateSerializer(serializers.ModelSerializer):
    channel_display = serializers.CharField(source='get_channel_display', read_only=True)
    
    class Meta:
        model = NotificationTemplate
        fields = [
            'id', 'trigger', 'channel', 'channel_display', 'is_enabled',
            'title', 'body', 'whatsapp_template_name', 'whatsapp_status',
            'created_at', 'updated_at'
        ]


class TriggerSerializer(serializers.ModelSerializer):
    templates = NotificationTemplateSerializer(many=True, read_only=True)
    name_display = serializers.CharField(source='get_name_display', read_only=True)
    
    class Meta:
        model = Trigger
        fields = ['id', 'name', 'name_display', 'description', 'templates', 'created_at', 'updated_at']


class NotificationLogSerializer(serializers.ModelSerializer):
    template_display = serializers.SerializerMethodField()
    
    def get_template_display(self, obj):
        return str(obj.template)
    
    class Meta:
        model = NotificationLog
        fields = ['id', 'template', 'template_display', 'recipient', 'status', 'message', 'external_id', 'error', 'sent_at', 'created_at']


class UserSessionSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = UserSession
        fields = ['id', 'user', 'username', 'ip_address', 'user_agent', 'last_seen', 'logged_in_at', 'logged_out_at']
