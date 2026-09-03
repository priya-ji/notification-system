from django.db import models
from django.contrib.auth.models import User

class Trigger(models.Model):
    """Represents an event that fires notifications"""
    TRIGGER_CHOICES = [
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('not_logged_1day', 'Not logged in for 1 day'),
        ('not_logged_1week', 'Not logged in for 1 week'),
        ('password_reset', 'Password reset'),
        ('order_placed', 'Order placed'),
    ]
    
    name = models.CharField(max_length=100, choices=TRIGGER_CHOICES, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.get_name_display()
    
    class Meta:
        ordering = ['name']


class NotificationTemplate(models.Model):
    """Template for a notification on a specific channel"""
    CHANNEL_CHOICES = [
        ('whatsapp', 'WhatsApp'),
        ('email', 'Email'),
        ('web_push', 'Web Push'),
    ]
    
    trigger = models.ForeignKey(Trigger, on_delete=models.CASCADE, related_name='templates')
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES)
    is_enabled = models.BooleanField(default=True)
    
    # Template content
    title = models.CharField(max_length=200, blank=True, help_text="For Email subject and Web Push title")
    body = models.TextField(help_text="Message body for all channels")
    
    # WhatsApp specific
    whatsapp_template_name = models.CharField(max_length=200, blank=True, help_text="Template name on Meta")
    whatsapp_status = models.CharField(
        max_length=50, 
        default='pending',
        choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')]
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        unique_together = ('trigger', 'channel')
        ordering = ['trigger', 'channel']
    
    def __str__(self):
        return f"{self.trigger.get_name_display()} - {self.get_channel_display()}"


class NotificationLog(models.Model):
    """Log of sent notifications"""
    STATUS_CHOICES = [
        ('sent', 'Sent'),
        ('failed', 'Failed'),
        ('pending', 'Pending'),
    ]
    
    template = models.ForeignKey(NotificationTemplate, on_delete=models.CASCADE, related_name='logs')
    recipient = models.CharField(max_length=255, help_text="Phone number, email, or user ID")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    message = models.TextField(blank=True)
    external_id = models.CharField(max_length=255, blank=True, help_text="ID from external API")
    error = models.TextField(blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.template} -> {self.recipient} ({self.status})"


class UserSession(models.Model):
    """Track user login/logout for triggers"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    ip_address = models.CharField(max_length=50, blank=True)
    user_agent = models.CharField(max_length=500, blank=True)
    last_seen = models.DateTimeField(auto_now=True)
    logged_in_at = models.DateTimeField(auto_now_add=True)
    logged_out_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-logged_in_at']
    
    def __str__(self):
        return f"{self.user} - {self.logged_in_at}"
