# Notification System - Complete Setup Guide

Complete multi-channel notification system with Django backend and React frontend.

---

## 📋 Project Overview

- **Backend:** Django REST API with multi-channel notification support
- **Frontend:** React + Vite admin dashboard
- **Channels:** WhatsApp (Meta), Email (Postmark), Web Push (OneSignal)
- **Deployment:** Backend on Render, Frontend on Vercel

---

## 🚀 Quick Start (Local Development)

### Part 1: Backend Setup

#### 1.1 Clone and Navigate
```bash
cd notification-backend
```

#### 1.2 Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### 1.3 Install Dependencies
```bash
pip install -r requirements.txt
```

#### 1.4 Setup Environment Variables
```bash
cp .env.example .env
# Edit .env with your API keys
```

#### 1.5 Initialize Database
```bash
python manage.py migrate
python manage.py createsuperuser
```

Follow prompts:
```
Username: admin
Email: admin@example.com
Password: password123
```

#### 1.6 Run Backend Server
```bash
python manage.py runserver
```

Backend running at: **http://localhost:8000**
Admin panel at: **http://localhost:8000/admin**

---

### Part 2: Frontend Setup

#### 2.1 Open New Terminal and Navigate
```bash
cd notification-frontend
```

#### 2.2 Install Dependencies
```bash
npm install
```

#### 2.3 Start Development Server
```bash
npm run dev
```

Frontend running at: **http://localhost:3000**

---

## ⚙️ Configure External Services

### WhatsApp (Meta Sandbox)

1. Go to https://developers.facebook.com
2. Create an app (or use existing)
3. Add WhatsApp product
4. Go to **API Setup** section
5. Copy these values:
   - `access_token` → `WHATSAPP_ACCESS_TOKEN` in `.env`
   - `phone_number_id` → `WHATSAPP_PHONE_NUMBER_ID` in `.env`
6. Add your phone number to test recipients
7. Save and test

**Important:** Tokens expire after 24 hours. Regenerate when needed.

### Email (Postmark)

1. Sign up at https://postmarkapp.com (free)
2. Create a developer server
3. Verify your email as sender
4. Copy these values:
   - Server Token → `POSTMARK_TOKEN` in `.env`
   - Your email → `POSTMARK_FROM_EMAIL` in `.env`

**Free tier:** ~100 emails/month

### Web Push (OneSignal)

1. Sign up at https://onesignal.com (free)
2. Create new website app
3. **Important:** Choose "Web Push" only (skip Android/iOS)
4. Go to Settings → Keys & IDs
5. Copy these values:
   - App ID → `ONESIGNAL_APP_ID` in `.env`
   - REST API Key → `ONESIGNAL_REST_API_KEY` in `.env`

---

## 📝 Step-by-Step Workflow

### Task A: Test Login Trigger

**Goal:** Create a login trigger and test it on all 3 channels.

1. **Login to Admin Panel:**
   - Go to http://localhost:3000
   - Click "Admin Panel" (or see login form)
   - Note: Only works if logged in as "admin" user

2. **Create WhatsApp Template:**
   - Click "+ Create Template"
   - Select Trigger: "Login"
   - Select Channel: "WhatsApp"
   - Title: "Welcome"
   - Body: "Welcome back to our service!"
   - WhatsApp Template Name: "welcome"
   - Click "Create Template"

3. **Create Email Template:**
   - Click "+ Create Template"
   - Select Trigger: "Login"
   - Select Channel: "Email"
   - Title: "Login Successful"
   - Body: "You have successfully logged in to our platform."
   - Click "Create Template"

4. **Create Web Push Template:**
   - Click "+ Create Template"
   - Select Trigger: "Login"
   - Select Channel: "Web Push"
   - Title: "Welcome Back"
   - Body: "You're logged in!"
   - Click "Create Template"

5. **Set Test Recipient Info:**
   - Phone Number: +1234567890 (or your actual WhatsApp number)
   - Email: admin@example.com (or your email)
   - User ID: 1
   - These stay for all test sends

6. **Test Each Channel:**
   - Find "Login" row in table
   - You should see 3 cells with green status (●)
   - Click "Test" button on WhatsApp cell
   - ✅ Check WhatsApp for message
   - Click "Test" button on Email cell
   - ✅ Check email inbox
   - Click "Test" button on Web Push cell
   - ✅ Check browser notification (bottom right)

✅ **Task A Complete:** All 3 channels received messages

---

### Task B: Test Second Trigger

**Goal:** Create logout trigger and test it.

1. **Create Logout Templates:**
   - Follow same steps as Task A
   - Select Trigger: "Logout" instead of "Login"
   - Use different message text:
     - WhatsApp: "See you soon!"
     - Email: "You've logged out successfully"
     - Web Push: "See you later!"

2. **Test Each Channel:**
   - Click "Test" on each cell for Logout row
   - Verify you receive messages on all 3 channels

✅ **Task B Complete:** Second trigger has 3 working templates

---

### Task C: Edit and Toggle

**Goal:** Edit template text and toggle channels on/off.

1. **Edit a Template:**
   - Click "Edit" button on any template cell
   - Change the message text
   - Click "Update Template"

2. **Test Again:**
   - Click "Test" button
   - Verify you see the updated text

3. **Toggle Off:**
   - Click "Off" button on a template cell
   - Status should change to gray (○)

4. **Test Disabled:**
   - Click "Test" on that cell
   - Should see error message: "Template is disabled"

5. **Toggle Back On:**
   - Click "On" button to re-enable
   - Click "Test" again
   - Should work normally

✅ **Task C Complete:** You understand edit + on/off

---

### Task D: Explain the System

**Answer these questions in simple words:**

**Q1: What is a trigger? Give 3 examples (not only login).**

A trigger is an event or action that happens on your website that causes notifications to be sent out. Examples:
- Login (user signs in)
- Logout (user signs out)
- Password reset (user requests new password)
- Order placed (user completes purchase)
- Not logged in for 7 days (user hasn't visited in a week)

**Q2: What are the three channels?**

- WhatsApp: Message sent to user's WhatsApp via Meta Cloud API
- Email: Email sent to user's inbox via Postmark
- Web Push: Browser notification (like Chrome push notification)

**Q3: Why create templates in admin panel instead of Postmark / WhatsApp site?**

Because it's centralized! You manage everything in one place instead of logging into 3 different websites. The admin panel talks to WhatsApp, Postmark, and OneSignal in the background.

**Q4: What is Web Push?**

Web Push is a browser notification. When your site wants to send a message, it shows up in the browser (bottom right corner) even if the user isn't on your website. Works on Chrome, Firefox, Safari, Edge.

✅ **Task D Complete:** You understand the system

---

## 🧪 Real-World Testing Flow

Once everything is set up, here's how to test the ENTIRE flow:

### Scenario: User Registration Trigger

Let's say you add a "user_registered" trigger:

1. **Backend:** Add to `Trigger.TRIGGER_CHOICES` in `models.py`:
   ```python
   ('user_registered', 'User Registered')
   ```

2. **Frontend:** Create templates for all 3 channels

3. **Backend:** When user signs up, fire the trigger:
   ```python
   # In your signup view
   register_trigger = Trigger.objects.get(name='user_registered')
   for template in register_trigger.templates.filter(is_enabled=True):
       NotificationService.send_notification(template.id, recipient_info)
   ```

4. **Test:** Create new user and watch notifications appear on all channels

---

## 🚀 Deployment

### Deploy Backend (Render)

1. **Create GitHub Repository**
   ```bash
   cd notification-backend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/notification-backend.git
   git push -u origin main
   ```

2. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

3. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repo
   - Name: `notification-backend`
   - Runtime: Python
   - Build Command: `pip install -r requirements.txt && python manage.py migrate`
   - Start Command: `gunicorn notification_system.wsgi`

4. **Add Environment Variables**
   - Click "Environment"
   - Add all variables from `.env`:
     ```
     DEBUG=False
     SECRET_KEY=your_secret_key_here
     ALLOWED_HOSTS=yourdomain.onrender.com
     WHATSAPP_ACCESS_TOKEN=...
     POSTMARK_TOKEN=...
     ONESIGNAL_APP_ID=...
     ONESIGNAL_REST_API_KEY=...
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your backend URL: `https://yourdomain.onrender.com`

### Deploy Frontend (Vercel)

1. **Create GitHub Repository**
   ```bash
   cd notification-frontend
   git init
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. **Import to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repo
   - Framework: React
   - Build Command: `npm run build`

3. **Add Environment Variables**
   - Add `VITE_API_URL=https://yourdomain.onrender.com/api`
   - On Render, add `CORS_ALLOWED_ORIGINS=https://your-vercel-site.vercel.app`

4. **Deploy**
   - Click "Deploy"
   - Your frontend URL: `https://yoursite.vercel.app`

---

## 📊 API Endpoints Reference

### Triggers
```
GET    /api/triggers/              # List all triggers
POST   /api/triggers/              # Create trigger
GET    /api/triggers/{id}/         # Get trigger
PATCH  /api/triggers/{id}/         # Update trigger
```

### Templates
```
GET    /api/templates/             # List all templates
POST   /api/templates/             # Create template
GET    /api/templates/{id}/        # Get template
PATCH  /api/templates/{id}/        # Update template
POST   /api/templates/{id}/toggle/ # Enable/disable
POST   /api/templates/{id}/test_send/ # Send test
```

### User/Auth
```
POST   /api/users/login/           # Login & fire trigger
POST   /api/users/logout/          # Logout & fire trigger
GET    /api/users/current_user/    # Get logged in user
```

### Logs
```
GET    /api/logs/                  # List notification logs
GET    /api/logs/?template_id=1    # Filter by template
```

### Admin
```
GET    /api/admin/triggers_table/  # Get table for admin UI
```

---

## ✅ Complete Checklist

- ☐ Backend running locally
- ☐ Frontend running locally
- ☐ WhatsApp sandbox configured
- ☐ Postmark account created
- ☐ OneSignal account created
- ☐ Test credentials working (admin / password123)
- ☐ Task A: Login trigger, all 3 channels tested
- ☐ Task B: Second trigger, all 3 channels tested
- ☐ Task C: Edit and toggle working
- ☐ Task D: Can explain system
- ☐ GitHub repos created
- ☐ Backend deployed to Render
- ☐ Frontend deployed to Vercel
- ☐ Live URLs added to submission
- ☐ Walkthrough video recorded and linked

---

## 🎥 Walkthrough Video

Record a 3-5 minute screen recording:

1. **Show login:** Go to frontend, login as admin
2. **Show admin panel:** Navigate to admin panel
3. **Create template:** Create a WhatsApp template
4. **Test send:** Send test, show message on phone
5. **Test email:** Send test, show email received
6. **Test web push:** Send test, show browser notification
7. **Explain:** Briefly explain triggers, channels, templates

**Tools to record:**
- Loom (free) - https://loom.com
- OBS (free) - https://obsproject.com
- ScreenFlow (Mac)
- Windows Game Bar (Windows)

Upload to YouTube (unlisted) or Google Drive and share link.

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Python version
python --version  # Should be 3.8+

# Reinstall dependencies
pip install --upgrade -r requirements.txt

# Check Django
python manage.py check
```

### Frontend won't build
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 16+
```

### API not connecting
- Check backend is running: `http://localhost:8000/api/triggers/`
- Check frontend console (F12) for CORS errors
- Check CORS_ALLOWED_ORIGINS in Django settings

### WhatsApp not working
- Token expired? Generate new one on Meta Developers
- Phone number format wrong? Should be +country code
- Test recipient not added? Add your number to test list

### Email not sending
- Sender verified in Postmark?
- Token correct and not expired?
- Recipient email valid format?

### Web Push not showing
- OneSignal app created for Web only (no Android/iOS)?
- Subscribed in browser? Accept notifications prompt
- App ID and API key correct?

---

## 📚 File Structure

```
notification-system/
├── notification-backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── README.md
│   ├── notification_system/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── notifications/
│       ├── models.py
│       ├── views.py
│       ├── serializers.py
│       ├── services.py
│       ├── admin.py
│       └── apps.py
│
└── notification-frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── README.md
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── components/
        │   ├── AdminPanel.jsx
        │   └── Auth.jsx
        ├── services/
        │   └── api.js
        └── styles/
            ├── index.css
            ├── App.css
            ├── Auth.css
            └── AdminPanel.css
```

---

## 🎯 Next Steps

1. **Local Setup:** Follow Part 1 & 2 above
2. **Configure Services:** Add API keys from WhatsApp, Postmark, OneSignal
3. **Complete Tasks:** Do Tasks A, B, C, D
4. **Test Everything:** Verify all 3 channels work
5. **Record Video:** Screen record walkthrough
6. **Deploy:** Push to Render (backend) and Vercel (frontend)
7. **Submit:** Share GitHub links, live URLs, and video

---

## 💡 Tips

- **Start simple:** Test with just login trigger first
- **Use test numbers:** Always use sandbox/test accounts during development
- **Save tokens safely:** Never commit .env file
- **Document everything:** Comment your code
- **Test thoroughly:** Check each trigger on all channels
- **Keep UI simple:** Focus on functionality not design
- **Read error messages:** They tell you what's wrong

---

Good luck! 🚀 Let me know if you have questions!
