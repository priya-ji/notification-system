# Notification System - Django Backend

A Django REST API for managing multi-channel notifications (WhatsApp, Email, Web Push).

## Features

✅ Admin panel to manage notification triggers and templates
✅ Send notifications via 3 channels: WhatsApp, Email, Web Push
✅ Test send functionality
✅ Enable/disable templates
✅ Track notification logs
✅ User login/logout triggers

## Quick Start

### 1. Setup Python Environment

Use Python 3.13 (the pinned dependencies do not support Python 3.14 yet):

```bash
python3.13 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

```
WHATSAPP_ACCESS_TOKEN=your_test_token
WHATSAPP_PHONE_NUMBER_ID=your_test_phone_number_id
POSTMARK_TOKEN=your_postmark_server_token
POSTMARK_FROM_EMAIL=your_verified_email@example.com
ONESIGNAL_APP_ID=your_onesignal_app_id
ONESIGNAL_REST_API_KEY=your_onesignal_rest_api_key
```

### 3. Setup Database & Create Admin User

```bash
python manage.py migrate
python manage.py createsuperuser
```

The migration automatically creates the six default trigger rows (Login,
Logout, inactive-user, password reset, and order placed).

### 4. Run Development Server

```bash
python manage.py runserver
```

Server runs at `http://localhost:8000`

## API Endpoints

### Triggers
- `GET /api/triggers/` - List all triggers
- `POST /api/triggers/` - Create trigger
- `GET /api/triggers/{id}/` - Get trigger details
- `PATCH /api/triggers/{id}/` - Update trigger

### Templates
- `GET /api/templates/` - List all templates
- `POST /api/templates/` - Create template
- `PATCH /api/templates/{id}/` - Update template
- `POST /api/templates/{id}/toggle/` - Enable/disable template
- `POST /api/templates/{id}/test_send/` - Send test notification

**Test Send Payload:**
```json
{
  "recipient_info": {
    "phone_number": "+1234567890",
    "email": "user@example.com",
    "user_id": 1
  }
}
```

### User Sessions / Auth
- `POST /api/users/login/` - Login and fire login trigger
- `POST /api/users/logout/` - Logout and fire logout trigger
- `GET /api/users/current_user/` - Get current user info

**Login Payload:**
```json
{
  "username": "admin",
  "password": "password123",
  "phone_number": "+1234567890",
  "email": "user@example.com"
}
```

### Admin Dashboard
- `GET /api/admin/triggers_table/` - Get triggers table for admin UI

### Notification Logs
- `GET /api/logs/` - View notification logs
- `GET /api/logs/?template_id=1` - Filter by template

## Setting Up Sandbox Services

### WhatsApp (Meta Sandbox)

1. Go to https://developers.facebook.com
2. Create App → Add WhatsApp Product
3. Go to API Setup
4. Copy Access Token (test token)
5. Copy Phone Number ID
6. Add your phone number to test recipients
7. Put these in `.env`

**Important:** Test tokens expire often. Generate a new one when tests fail.

### Postmark (Free Tier)

1. Sign up at https://postmarkapp.com
2. Create a developer server
3. Verify your email as sender
4. Copy server token
5. Put in `.env` as `POSTMARK_TOKEN` and `POSTMARK_FROM_EMAIL`

**Alternative Email Services:**
- Brevo: 300 emails/day free
- Resend: 3,000 emails/month
- Mailgun: 100-300 emails/day
- Amazon SES: 62,000/month (first 12 months)

### OneSignal (Web Push)

1. Sign up at https://onesignal.com (free)
2. Create website app
3. Enable Web Push only
4. Copy App ID and REST API Key
5. Put in `.env`

## File Structure

```
notification-backend/
├── manage.py
├── requirements.txt
├── .env.example
├── README.md
├── notification_system/
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── __init__.py
├── notifications/
│   ├── models.py           # Database models
│   ├── serializers.py      # DRF serializers
│   ├── views.py            # API views
│   ├── services.py         # Notification sending logic
│   ├── admin.py
│   ├── apps.py
│   ├── migrations/
│   └── __init__.py
└── templates/              # Django templates (if needed)
```

## Admin Panel

Access Django admin at: `http://localhost:8000/admin/`

- Create triggers
- Manage templates
- View notification logs
- Manage users

## Deployment (Render)

1. Create GitHub repo
2. Push to GitHub
3. Create new Web Service on Render
4. Connect GitHub repo
5. Set environment variables in Render dashboard
6. Deploy

## Triggers Supported

- `login` - User signs in
- `logout` - User signs out
- `not_logged_1day` - User inactive 24 hours
- `not_logged_1week` - User inactive 7 days
- `password_reset` - Password reset request
- `order_placed` - Order completed

Add more in `notifications/models.py` → `Trigger.TRIGGER_CHOICES`

## Channels Supported

1. **WhatsApp** - Via Meta Cloud API (sandbox)
2. **Email** - Via Postmark or alternative
3. **Web Push** - Via OneSignal

## Testing Workflow

### Task A: Test Login Trigger
1. Go to admin panel
2. Find "Login" trigger
3. Create templates for all 3 channels
4. Use test_send endpoint or UI
5. Verify message on phone, email, browser

### Task B: Test Second Trigger
1. Pick logout or inactive user trigger
2. Create templates
3. Test all 3 channels

### Task C: Edit & Toggle
1. Edit a template text
2. Test send
3. Toggle channel on/off
4. Send again

## Troubleshooting

**WhatsApp token expired:**
- Generate new token on Meta Developers dashboard
- Update `.env`

**Email not sending:**
- Verify email in Postmark
- Check token is correct
- Check recipient email format

**Web Push not working:**
- Ensure OneSignal app is created
- Browser must be subscribed first
- Check app ID and API key

## Notes

- This is a sandbox setup - no production keys
- Database is SQLite (change to PostgreSQL in settings.py for production)
- CORS is enabled for localhost:3000 and localhost:5173
- All API endpoints return JSON
- Authentication can be added with Django Signals/tokens
