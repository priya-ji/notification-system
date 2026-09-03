import requests
import json
from django.conf import settings
from django.utils import timezone
from .models import NotificationLog, NotificationTemplate


class NotificationService:
    """Handle sending notifications via WhatsApp, Email, and Web Push"""
    
    @staticmethod
    def send_whatsapp(phone_number, template_name, body, template_id=None):
        """Send WhatsApp message via Meta Cloud API"""
        try:
            url = f"https://graph.facebook.com/v20.0/{settings.WHATSAPP_PHONE_NUMBER_ID}/messages"
            headers = {
                "Authorization": f"Bearer {settings.WHATSAPP_ACCESS_TOKEN}",
                "Content-Type": "application/json",
            }
            
            payload = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": phone_number,
                "type": "text",
                "text": {
                    "preview_url": False,
                    "body": body
                }
            }
            
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            return {
                'success': True,
                'external_id': data.get('messages', [{}])[0].get('id', ''),
                'message': 'WhatsApp message sent'
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'message': f'WhatsApp send failed: {str(e)}'
            }
    
    @staticmethod
    def send_email(recipient_email, subject, body, html_body=None):
        """Send email via Postmark"""
        try:
            url = "https://api.postmarkapp.com/email"
            headers = {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-Postmark-Server-Token": settings.POSTMARK_TOKEN
            }
            
            payload = {
                "From": settings.POSTMARK_FROM_EMAIL,
                "To": recipient_email,
                "Subject": subject,
                "TextBody": body,
            }
            
            if html_body:
                payload["HtmlBody"] = html_body
            
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            return {
                'success': True,
                'external_id': data.get('MessageID', ''),
                'message': 'Email sent'
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'message': f'Email send failed: {str(e)}'
            }
    
    @staticmethod
    def send_web_push(user_id, title, body, data=None):
        """Send Web Push notification via OneSignal"""
        try:
            url = "https://onesignal.com/api/v1/notifications"
            headers = {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": f"Basic {settings.ONESIGNAL_REST_API_KEY}"
            }
            
            payload = {
                "app_id": settings.ONESIGNAL_APP_ID,
                "include_external_user_ids": [str(user_id)],
                "headings": {"en": title},
                "contents": {"en": body},
                "data": data or {}
            }
            
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            return {
                'success': True,
                'external_id': data.get('id', ''),
                'message': 'Web Push sent'
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'message': f'Web Push send failed: {str(e)}'
            }
    
    @staticmethod
    def send_notification(template_id, recipient_info):
        """
        Send notification using a template
        recipient_info: {
            'phone_number': '+1234567890',  # for WhatsApp
            'email': 'user@example.com',     # for Email
            'user_id': 123,                  # for Web Push
        }
        """
        try:
            template = NotificationTemplate.objects.get(id=template_id)
            
            if not template.is_enabled:
                return {
                    'success': False,
                    'message': 'Template is disabled'
                }
            
            channel = template.channel
            result = None
            
            if channel == 'whatsapp':
                result = NotificationService.send_whatsapp(
                    recipient_info.get('phone_number'),
                    template.whatsapp_template_name,
                    template.body
                )
                recipient = recipient_info.get('phone_number')
            
            elif channel == 'email':
                result = NotificationService.send_email(
                    recipient_info.get('email'),
                    template.title,
                    template.body
                )
                recipient = recipient_info.get('email')
            
            elif channel == 'web_push':
                result = NotificationService.send_web_push(
                    recipient_info.get('user_id'),
                    template.title,
                    template.body
                )
                recipient = str(recipient_info.get('user_id'))
            
            # Log the notification
            log = NotificationLog.objects.create(
                template=template,
                recipient=recipient,
                status='sent' if result['success'] else 'failed',
                message=result.get('message', ''),
                external_id=result.get('external_id', ''),
                error=result.get('error', ''),
                sent_at=timezone.now() if result['success'] else None
            )
            
            return {
                'success': result['success'],
                'log_id': log.id,
                'message': result.get('message'),
                'error': result.get('error')
            }
        
        except NotificationTemplate.DoesNotExist:
            return {
                'success': False,
                'message': 'Template not found'
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error sending notification: {str(e)}'
            }
