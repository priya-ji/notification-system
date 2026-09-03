# Notification System - React Frontend

A modern React + Vite application for managing multi-channel notifications with an admin dashboard.

## Features

✅ User authentication (login/logout with notification triggers)
✅ Admin dashboard with notification template management
✅ Create, edit, and test notifications
✅ Enable/disable templates
✅ Support for 3 channels: WhatsApp, Email, Web Push
✅ Real-time notification logs
✅ Responsive design

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment (Optional)

Create `.env` file if you need to customize the API URL:

```
REACT_APP_API_URL=http://localhost:8000/api
```

By default, it connects to `http://localhost:8000/api`

### 3. Start Development Server

```bash
npm run dev
```

App runs at `http://localhost:3000`

## Project Structure

```
notification-frontend/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── src/
│   ├── main.jsx              # Entry point
│   ├── App.jsx               # Main app component
│   ├── components/
│   │   ├── AdminPanel.jsx    # Admin dashboard
│   │   └── Auth.jsx          # Login/logout
│   ├── services/
│   │   └── api.js            # API calls
│   └── styles/
│       ├── index.css
│       ├── App.css
│       ├── Auth.css
│       └── AdminPanel.css
```

## Key Components

### Auth.jsx
Handles user login and logout. Fires notifications when:
- User logs in → fires **login** trigger
- User logs out → fires **logout** trigger

**Login Form:**
- Username
- Password
- Phone Number (for WhatsApp)
- Email

### AdminPanel.jsx
Admin-only dashboard for managing notification templates.

**Features:**
- View all triggers and templates in a table
- Create templates for each trigger/channel combo
- Edit existing templates
- Toggle templates on/off
- Send test notifications
- View recipient info (phone, email, user ID)

**Table Structure:**
```
Trigger | WhatsApp | Email | Web Push
Login   | [cell]   | [cell]| [cell]
Logout  | [cell]   | [cell]| [cell]
```

## API Integration

The frontend connects to the Django backend via REST API.

### Key Endpoints Used

**Authentication:**
- `POST /users/login/` - Login user
- `POST /users/logout/` - Logout user

**Templates:**
- `GET /templates/` - List all templates
- `POST /templates/` - Create template
- `PATCH /templates/{id}/` - Update template
- `POST /templates/{id}/toggle/` - Enable/disable
- `POST /templates/{id}/test_send/` - Send test

**Triggers:**
- `GET /triggers/` - List all triggers

**Admin:**
- `GET /admin/triggers_table/` - Get table data

See `src/services/api.js` for all API calls.

## Workflow

### Task A: Test Login Trigger

1. Open app at `http://localhost:3000`
2. Go to **Admin Panel**
3. Scroll to "Login" trigger row
4. Create templates for WhatsApp, Email, Web Push
5. Fill in recipient info (phone, email, user ID)
6. Click **Test** on each cell
7. Verify messages arrive on phone, email, browser

### Task B: Test Second Trigger

1. Pick "Logout" or another trigger
2. Create templates for all 3 channels
3. Click **Test** on each
4. Verify notifications

### Task C: Edit & Toggle

1. Click **Edit** on a template
2. Change message text
3. Click **Update**
4. Click **Test** again
5. Click **Off** to disable channel
6. Click **On** to enable

### Task D: Understand the System

- **Trigger:** Event that causes notifications (login, logout, order, etc.)
- **Template:** Message content for a trigger + channel combo
- **Channel:** Where message goes (WhatsApp, Email, Web Push)
- **Admin Panel:** Single place to manage everything

## Building for Production

```bash
npm run build
```

Output: `dist/` folder ready to deploy to Vercel

## Deployment (Vercel)

1. Push to GitHub
2. Import repo to Vercel
3. Set environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```
4. Deploy

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Testing with Backend

**Backend must be running:**
```bash
# Terminal 1: Backend
cd notification-backend
python manage.py runserver

# Terminal 2: Frontend
cd notification-frontend
npm run dev
```

Then visit `http://localhost:3000`

## Test Credentials

Use these to test login:

```
Username: admin
Password: password123
Phone: +1234567890
Email: admin@example.com
```

Create more users in Django admin at `http://localhost:8000/admin/`

## Troubleshooting

### API Connection Failed
- Check backend is running at `http://localhost:8000`
- Check CORS is enabled in Django settings
- Verify API_BASE_URL in `src/services/api.js`

### Template Test Not Sending
- Verify recipient info is filled (phone, email, user ID)
- Check backend logs for API errors
- Verify external service tokens are correct (WhatsApp, Postmark, OneSignal)

### Admin Panel Not Loading
- Login first as admin user
- Check user is_staff flag in Django admin
- Clear browser cache and reload

## Notes

- All data is stored in backend Django database
- Frontend is stateless (no local database)
- Authentication tokens can be added later
- Responsive design works on mobile devices
- All forms validate before submission
