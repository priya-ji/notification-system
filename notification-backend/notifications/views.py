from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Trigger, NotificationTemplate, NotificationLog, UserSession
from .serializers import (
    TriggerSerializer, NotificationTemplateSerializer,
    NotificationLogSerializer, UserSessionSerializer
)
from .services import NotificationService


class TriggerViewSet(viewsets.ModelViewSet):
    """ViewSet for managing triggers"""
    queryset = Trigger.objects.all()
    serializer_class = TriggerSerializer
    
    def get_queryset(self):
        return Trigger.objects.prefetch_related('templates')


class NotificationTemplateViewSet(viewsets.ModelViewSet):
    """ViewSet for managing notification templates"""
    queryset = NotificationTemplate.objects.all()
    serializer_class = NotificationTemplateSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def test_send(self, request, pk=None):
        """Send a test notification"""
        template = self.get_object()
        recipient_info = request.data.get('recipient_info', {})
        
        if not recipient_info:
            return Response(
                {'error': 'recipient_info required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        result = NotificationService.send_notification(template.id, recipient_info)
        return Response(result)
    
    @action(detail=True, methods=['post'])
    def toggle(self, request, pk=None):
        """Toggle template on/off"""
        template = self.get_object()
        template.is_enabled = not template.is_enabled
        template.save()
        return Response({
            'is_enabled': template.is_enabled,
            'message': f"Template {'enabled' if template.is_enabled else 'disabled'}"
        })


class NotificationLogViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing notification logs"""
    queryset = NotificationLog.objects.all()
    serializer_class = NotificationLogSerializer
    
    def get_queryset(self):
        queryset = NotificationLog.objects.all()
        template_id = self.request.query_params.get('template_id')
        if template_id:
            queryset = queryset.filter(template_id=template_id)
        return queryset.order_by('-created_at')


class UserSessionViewSet(viewsets.ViewSet):
    """ViewSet for user authentication and session tracking"""

    @action(detail=False, methods=['post'])
    def register(self, request):
        """Create a standard user account. Admin accounts use createsuperuser."""
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '')
        email = request.data.get('email', '').strip()

        if not username or not password:
            return Response(
                {'error': 'Username and password are required'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if User.objects.filter(username__iexact=username).exists():
            return Response(
                {'error': 'That username is already in use'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User(username=username, email=email)
        try:
            validate_password(password, user)
        except ValidationError as error:
            return Response({'error': ' '.join(error.messages)}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(password)
        user.save()
        return Response(
            {
                'success': True,
                'user_id': user.id,
                'username': user.username,
                'is_staff': user.is_staff,
                'message': 'Account created successfully',
            },
            status=status.HTTP_201_CREATED,
        )
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        """User login - fires login trigger"""
        username = request.data.get('username')
        password = request.data.get('password')
        phone_number = request.data.get('phone_number', '')
        email = request.data.get('email', '')
        
        try:
            user = User.objects.get(username__iexact=username)
            
            # Check password (simplified for demo)
            if user.check_password(password):
                # Create session
                session = UserSession.objects.create(
                    user=user,
                    ip_address=self.get_client_ip(request),
                    user_agent=request.META.get('HTTP_USER_AGENT', '')
                )
                
                # Fire login triggers
                login_trigger = Trigger.objects.filter(name='login').first()
                for template in login_trigger.templates.filter(is_enabled=True) if login_trigger else []:
                    recipient_info = {
                        'phone_number': phone_number or '1234567890',
                        'email': email or user.email,
                        'user_id': user.id
                    }
                    NotificationService.send_notification(template.id, recipient_info)
                
                return Response({
                    'success': True,
                    'user_id': user.id,
                    'username': user.username,
                    'is_staff': user.is_staff,
                    'message': 'Login successful'
                })
            else:
                return Response(
                    {'error': 'Invalid credentials'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        """User logout - fires logout trigger"""
        user_id = request.data.get('user_id')
        phone_number = request.data.get('phone_number', '')
        email = request.data.get('email', '')
        
        try:
            user = User.objects.get(id=user_id)
            
            # A newly registered user may not have a login session yet. Logout
            # should still complete and fire notifications in that case.
            session = UserSession.objects.filter(user=user).order_by('-logged_in_at').first()
            if session:
                session.logged_out_at = timezone.now()
                session.save()
            
            # Fire logout triggers
            logout_trigger = Trigger.objects.filter(name='logout').first()
            for template in logout_trigger.templates.filter(is_enabled=True) if logout_trigger else []:
                recipient_info = {
                    'phone_number': phone_number or '1234567890',
                    'email': email or user.email,
                    'user_id': user.id
                }
                NotificationService.send_notification(template.id, recipient_info)
            
            return Response({
                'success': True,
                'message': 'Logout successful'
            })
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def current_user(self, request):
        """Get current user info"""
        if request.user.is_authenticated:
            return Response({
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'is_staff': request.user.is_staff
            })
        return Response(
            {'error': 'Not authenticated'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class AdminDashboardViewSet(viewsets.ViewSet):
    """ViewSet for admin dashboard"""
    
    @action(detail=False, methods=['get'])
    def triggers_table(self, request):
        """Get all triggers with their templates for admin table"""
        triggers = Trigger.objects.prefetch_related('templates').all()
        data = []
        
        for trigger in triggers:
            row = {
                'trigger_id': trigger.id,
                'trigger_name': trigger.get_name_display(),
                'trigger_key': trigger.name,
                'channels': {}
            }
            
            for template in trigger.templates.all():
                row['channels'][template.channel] = {
                    'id': template.id,
                    'is_enabled': template.is_enabled,
                    'title': template.title,
                    'body': template.body,
                    'channel': template.channel
                }
            
            data.append(row)
        
        return Response(data)
