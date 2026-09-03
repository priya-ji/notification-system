# 🔔 Notification System - Complete Project

## 📦 What You Get

This is a **complete, production-ready multi-channel notification system** built with:
- **Backend:** Django REST API
- **Frontend:** React + Vite
- **Channels:** WhatsApp, Email, Web Push
- **Database:** SQLite (extendable to PostgreSQL)

---

## 📥 Files Included

### 1. **SETUP_GUIDE.md** ← START HERE
Complete step-by-step guide covering:
- Local development setup
- External service configuration (WhatsApp, Postmark, OneSignal)
- Task-by-task workflow (A, B, C, D)
- Deployment instructions
- Troubleshooting

### 2. **notification-backend.zip**
Django backend with:
```
✅ Database models (Trigger, Template, NotificationLog, UserSession)
✅ REST API endpoints for CRUD operations
✅ Notification service (WhatsApp, Email, Web Push)
✅ Admin dashboard integration
✅ User authentication (login/logout triggers)
✅ Django admin for management
✅ Complete documentation
```

**Key Files:**
- `settings.py` - Django configuration
- `models.py` - Database models
- `views.py` - API endpoints
- `services.py` - Notification logic
- `serializers.py` - API serialization
- `admin.py` - Admin panel config
- `requirements.txt` - Python dependencies

### 3. **notification-frontend.zip**
React frontend with:
```
✅ Admin panel dashboard
✅ Login/logout pages
✅ Template management UI
✅ Test notification sending
✅ Real-time notification logs
✅ Responsive design
✅ Complete styling
```

**Key Files:**
- `App.jsx` - Main component
- `AdminPanel.jsx` - Admin dashboard
- `Auth.jsx` - Login/logout
- `api.js` - API integration
- `styles/` - Complete CSS styling

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Unzip Files
```bash
unzip notification-backend.zip
unzip notification-frontend.zip
```

### Step 2: Backend Setup
```bash
cd notification-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser  # username: admin, password: password123
python manage.py runserver
```

### Step 3: Frontend Setup
```bash
cd notification-frontend
npm install
npm run dev
```

### Step 4: Test
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- Admin: http://localhost:3000/admin

---

## 🔐 Test Credentials

Default admin user (create during setup):
```
Username: admin
Password: password123
```

---

## 📋 Project Structure

```
notification-system/
│
├── notification-backend/
│   ├── manage.py                    # Django entry point
│   ├── requirements.txt             # Python dependencies
│   ├── .env.example                 # Environment variables template
│   ├── README.md                    # Backend documentation
│   │
│   ├── notification_system/
│   │   ├── settings.py              # Django settings
│   │   ├── urls.py                  # URL routing
│   │   └── wsgi.py                  # WSGI app
│   │
│   └── notifications/
│       ├── models.py                # Database models
│       ├── views.py                 # API endpoints
│       ├── serializers.py           # API serializers
│       ├── services.py              # Notification sending
│       ├── admin.py                 # Admin configuration
│       ├── apps.py                  # App configuration
│       └── migrations/              # Database migrations
│
├── notification-frontend/
│   ├── index.html                   # HTML entry point
│   ├── package.json                 # npm dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── README.md                    # Frontend documentation
│   │
│   └── src/
│       ├── main.jsx                 # React entry point
│       ├── App.jsx                  # Main component
│       │
│       ├── components/
│       │   ├── AdminPanel.jsx       # Admin dashboard
│       │   └── Auth.jsx             # Login/logout
│       │
│       ├── services/
│       │   └── api.js               # API calls
│       │
│       └── styles/
│           ├── index.css            # Global styles
│           ├── App.css              # App styles
│           ├── Auth.css             # Auth component styles
│           └── AdminPanel.css       # Admin panel styles
│
└── SETUP_GUIDE.md                   # Complete setup instructions
```

---

## 🚀 Key Features

### Backend Features
- ✅ Multi-trigger support (Login, Logout, Password Reset, Order Placed, etc.)
- ✅ Three-channel notifications (WhatsApp, Email, Web Push)
- ✅ Template management with enable/disable
- ✅ Test send functionality
- ✅ Notification logging and history
- ✅ User session tracking
- ✅ Django admin integration
- ✅ REST API with filtering
- ✅ CORS enabled for frontend

### Frontend Features
- ✅ Admin dashboard with trigger table
- ✅ Create/edit/delete templates
- ✅ Toggle channels on/off
- ✅ Test notification sending
- ✅ User login/logout with triggers
- ✅ Recipient info management
- ✅ Real-time notifications
- ✅ Responsive design
- ✅ Clean, modern UI

---

## 📡 Supported Channels

### 1. WhatsApp (Meta Cloud API)
- Sandbox testing with test phone numbers
- Simple text message sending
- Perfect for business notifications
- Free tier available

### 2. Email (Postmark)
- Professional transactional email
- ~100 emails/month free tier
- Alternatives: Brevo, Resend, Mailgun, Amazon SES
- HTML support

### 3. Web Push (OneSignal)
- Browser notifications
- Free tier available
- Works across all modern browsers
- No app installation needed

---

## 🔄 Workflow

### Admin Setup
1. Admin logs in to frontend
2. Goes to Admin Panel
3. Creates templates for each trigger/channel
4. Tests notifications
5. Enables/disables as needed

### User Interaction
1. User logs in
2. **Login trigger** fires
3. Notifications sent on all enabled channels:
   - WhatsApp: "Welcome back!"
   - Email: "You logged in"
   - Web Push: "Welcome back!" (browser notification)

### Template Management
```
One Trigger (e.g., Login)
    ├── WhatsApp Channel
    │   └── Template (enable/disable)
    ├── Email Channel
    │   └── Template (enable/disable)
    └── Web Push Channel
        └── Template (enable/disable)
```

---

## 🎓 Learning Outcomes

By completing this project, you'll learn:

**Backend (Django):**
- REST API development
- Database modeling
- Service-oriented architecture
- External API integration
- Django admin
- CORS handling
- Authentication basics

**Frontend (React):**
- Component-based architecture
- State management
- API integration
- Form handling
- Routing
- CSS styling
- Responsive design

**DevOps:**
- Environment configuration
- Deployment (Render, Vercel)
- Database migration
- Git workflow

**Integrations:**
- WhatsApp Cloud API
- Postmark Email
- OneSignal Web Push

---

## 📚 API Endpoints

### Triggers
```
GET  /api/triggers/          # List all
POST /api/triggers/          # Create
GET  /api/triggers/{id}/     # Get one
PATCH/api/triggers/{id}/     # Update
```

### Templates
```
GET    /api/templates/                # List all
POST   /api/templates/                # Create
GET    /api/templates/{id}/           # Get one
PATCH  /api/templates/{id}/           # Update
POST   /api/templates/{id}/toggle/    # Enable/disable
POST   /api/templates/{id}/test_send/ # Send test
```

### User/Auth
```
POST /api/users/login/           # Login & fire trigger
POST /api/users/logout/          # Logout & fire trigger
GET  /api/users/current_user/    # Get current user
```

### Logs
```
GET /api/logs/                   # List all logs
GET /api/logs/?template_id=1     # Filter by template
```

### Admin
```
GET /api/admin/triggers_table/   # Get admin table data
```

---

## 🛠️ Configuration

### Environment Variables (.env)

```env
# Django
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000

# WhatsApp (Meta Sandbox)
WHATSAPP_ACCESS_TOKEN=your_test_token
WHATSAPP_PHONE_NUMBER_ID=your_test_phone_id

# Email (Postmark)
POSTMARK_TOKEN=your_postmark_token
POSTMARK_FROM_EMAIL=your_verified_email@example.com

# Web Push (OneSignal)
ONESIGNAL_APP_ID=your_app_id
ONESIGNAL_REST_API_KEY=your_api_key
```

---

## 📊 Database Models

### Trigger
```python
- name: CharField (unique trigger name)
- description: TextField
- created_at: DateTimeField
- updated_at: DateTimeField
```

### NotificationTemplate
```python
- trigger: ForeignKey(Trigger)
- channel: CharField (whatsapp, email, web_push)
- is_enabled: BooleanField
- title: CharField
- body: TextField
- whatsapp_template_name: CharField
- whatsapp_status: CharField
- created_at: DateTimeField
- updated_at: DateTimeField
- created_by: ForeignKey(User)
```

### NotificationLog
```python
- template: ForeignKey(NotificationTemplate)
- recipient: CharField
- status: CharField (sent, failed, pending)
- message: TextField
- external_id: CharField
- error: TextField
- sent_at: DateTimeField
- created_at: DateTimeField
```

### UserSession
```python
- user: ForeignKey(User)
- ip_address: CharField
- user_agent: CharField
- last_seen: DateTimeField
- logged_in_at: DateTimeField
- logged_out_at: DateTimeField
```

---

## ✅ Task Checklist

### Task A: Login Trigger
- [ ] Create WhatsApp template for Login
- [ ] Create Email template for Login
- [ ] Create Web Push template for Login
- [ ] Send test to each channel
- [ ] Verify messages received

### Task B: Second Trigger
- [ ] Create templates for Logout/other trigger
- [ ] Test all 3 channels
- [ ] Verify messages received

### Task C: Edit & Toggle
- [ ] Edit a template
- [ ] Test the change
- [ ] Toggle template off
- [ ] Verify disabled state
- [ ] Toggle back on

### Task D: Explain System
- [ ] What is a trigger? (with 3 examples)
- [ ] What are the 3 channels?
- [ ] Why use admin panel vs external sites?
- [ ] What is Web Push?

---

## 🐛 Troubleshooting

**Common Issues & Solutions:**

### Backend won't start
```bash
python --version      # Check Python 3.8+
pip install -r requirements.txt  # Reinstall deps
python manage.py check            # Check setup
```

### Frontend won't build
```bash
node --version        # Check Node 16+
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### API not connecting
- Backend running on 8000?
- CORS enabled in Django settings?
- Correct API URL in frontend?

### Notifications not sending
- API keys correct in .env?
- External service accounts set up?
- Test recipients configured?

---

## 🚀 Deployment

### Deploy Backend (Render)
1. Push to GitHub
2. Create Render Web Service
3. Set environment variables
4. Deploy

### Deploy Frontend (Vercel)
1. Push to GitHub
2. Import to Vercel
3. Set REACT_APP_API_URL
4. Deploy

See SETUP_GUIDE.md for detailed steps.

---

## 📞 Support

If you have questions:
1. Check SETUP_GUIDE.md
2. Read backend/README.md
3. Read frontend/README.md
4. Check Django admin at /admin
5. Review API endpoints at /api/

---

## 📝 Next Steps

1. **Extract files:** Unzip both zip files
2. **Read SETUP_GUIDE.md:** Follow step-by-step
3. **Configure services:** WhatsApp, Postmark, OneSignal
4. **Run locally:** Backend + Frontend
5. **Complete tasks:** A, B, C, D
6. **Deploy:** Render + Vercel
7. **Record video:** Walkthrough
8. **Submit:** GitHub + live URLs + video

---

## 🎉 You're Ready!

Everything is set up and ready to go. Start with SETUP_GUIDE.md and follow along. Good luck! 🚀

---

**Project Size:**
- Backend: ~15KB (zipped)
- Frontend: ~17KB (zipped)
- Total: ~32KB
- Ready to deploy!

**Deployment Time:**
- Backend: ~5 minutes (Render)
- Frontend: ~5 minutes (Vercel)
- Total: ~10 minutes

**Development Time:**
- Basic setup: ~15 minutes
- Task A-D completion: ~30-60 minutes
- Total to submission: ~2 hours

Good luck! 🔔✨
