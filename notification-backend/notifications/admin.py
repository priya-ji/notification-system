from django.contrib import admin
from .models import Trigger, NotificationTemplate, NotificationLog, UserSession


@admin.register(Trigger)
class TriggerAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(NotificationTemplate)
class NotificationTemplateAdmin(admin.ModelAdmin):
    list_display = ('trigger', 'channel', 'is_enabled', 'whatsapp_status', 'created_at')
    list_filter = ('channel', 'is_enabled', 'whatsapp_status')
    search_fields = ('trigger__name', 'title', 'body')
    readonly_fields = ('created_at', 'updated_at', 'created_by')
    
    fieldsets = (
        ('Trigger & Channel', {
            'fields': ('trigger', 'channel')
        }),
        ('Status', {
            'fields': ('is_enabled', 'whatsapp_status')
        }),
        ('Content', {
            'fields': ('title', 'body')
        }),
        ('WhatsApp', {
            'fields': ('whatsapp_template_name',),
            'classes': ('collapse',)
        }),
        ('Meta', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )


@admin.register(NotificationLog)
class NotificationLogAdmin(admin.ModelAdmin):
    list_display = ('template', 'recipient', 'status', 'sent_at', 'created_at')
    list_filter = ('status', 'template__channel', 'created_at')
    search_fields = ('recipient', 'template__trigger__name', 'message')
    readonly_fields = ('created_at', 'sent_at')
    
    fieldsets = (
        ('Template & Recipient', {
            'fields': ('template', 'recipient')
        }),
        ('Status', {
            'fields': ('status', 'message', 'error')
        }),
        ('External', {
            'fields': ('external_id',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('sent_at', 'created_at'),
            'classes': ('collapse',)
        })
    )


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'ip_address', 'logged_in_at', 'logged_out_at', 'last_seen')
    list_filter = ('logged_in_at', 'logged_out_at')
    search_fields = ('user__username', 'ip_address')
    readonly_fields = ('logged_in_at', 'last_seen')
