# EV Power Mini CRM

A comprehensive CRM (Customer Relationship Management) system for EV Power Energy built with React, Node.js/Express, and SQLite.

## Deployed Demo URL
 ```bash
   https://ev-power-1.onrender.com
   ```

## 🚀 Features

- **User Authentication**: Secure login with JWT tokens and bcryptjs password hashing
- **Dashboard**: Real-time overview of lead pipeline with status breakdown
- **Lead Management**: Create, read, update, and delete leads with comprehensive filtering
- **Search & Filter**: Advanced search by name/email/company with status and product interest filters
- **Activity Tracking**: Complete audit trail of all lead changes and status updates
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Product Categories**: Track interest in Solar, EV, and Battery solutions

## 📋 Tech Stack

**Frontend:**
- React 18
- React Router v6
- Axios (API client)
- Tailwind CSS (styling)

**Backend:**
- Node.js with Express
- SQLite3 database
- JWT for authentication
- bcryptjs for password hashing

## 🏗️ Project Structure

```
EV_Power/
├── backend/
│   ├── src/
│   │   ├── config/        # Configuration and database connection
│   │   ├── models/        # Data access layer (User, Lead, Activity)
│   │   ├── routes/        # API route definitions
│   │   ├── controllers/   # Route handlers and business logic
│   │   ├── middleware/    # Authentication and error handling
│   │   └── utils/         # Helper functions (auth, validation)
│   ├── db/                # Database initialization and seeders
│   └── server.js          # Express server entry point
│
├── frontend/
│   ├── src/
│   │   ├── pages/         # Page components (Login, Dashboard, etc.)
│   │   ├── components/    # Reusable UI components
│   │   ├── services/      # API client functions
│   │   ├── context/       # React context (Auth)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   ├── styles/        # CSS and Tailwind config
│   │   ├── App.js         # Main app component with routing
│   │   └── index.js       # React entry point
│   ├── public/            # Static files
│   └── package.json
│
└── specs/
    └── 001-mini-crm/      # Feature specification and planning
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js v14+ and npm
- SQLite3 (included with npm package)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Initialize database with schema:**
   ```bash
   npm run db:init
   ```

5. **Seed test data (optional):**
   ```bash
   npm run db:seed
   ```

6. **Start the server:**
   ```bash
   npm start
   ```
   
   The API will be available at `http://localhost:5000/api`
   
   **Test endpoint:** `http://localhost:5000/api/health`

### Frontend Setup

1. **Navigate to frontend directory (in a new terminal):**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.local .example.env.local
   ```
   (Update `.env.local` if backend API URL is different)

4. **Start the development server:**
   ```bash
   npm start
   ```
   
   The app will be available at `http://localhost:3000`

## 🔐 Test Credentials

After running `npm run db:seed` in the backend:

- **Email:** test@evpower.com
- **Password:** password123

## 📚 API Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/me` - Get current user info (requires token)
- `POST /api/auth/logout` - Logout

### Leads
- `GET /api/leads` - Get all leads with filtering/search
  - Query params: `search`, `status`, `product`, `page`, `limit`
- `POST /api/leads` - Create new lead
- `GET /api/leads/:id` - Get lead by ID
- `PATCH /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### Dashboard
- `GET /api/dashboard/stats` - Get lead statistics (total and by status)

### Activity
- `GET /api/activity/lead/:leadId` - Get activity log for a lead
- `GET /api/activity` - Get all activities (paginated)

## 🎯 Key Features in Detail

### Dashboard
- Total lead count display
- Status breakdown visualization
- Real-time metrics with 30-second auto-refresh
- Quick navigation to all leads

### Lead Management
- **List View**: Paginated table with search and dual filtering
- **Create**: Form with validation for name, product, status
- **Details**: Comprehensive view with editable fields
- **Activity Log**: Complete change history with timestamps
- **Delete**: Confirmation modal before permanent deletion

### Activity Tracking
- Automatic logging on lead creation, update, and deletion
- Tracks status changes separately from other updates
- Shows after values for status changes

## 📦 Database Schema

### users table
- `id` (UUID PRIMARY KEY)
- `email` (UNIQUE)
- `password_hash`
- `full_name`
- `created_at`
- `last_login_at`

### leads table
- `id` (UUID PRIMARY KEY)
- `name`, `email`, `phone`, `company`
- `product_interest` (Solar/EV/Battery)
- `budget` (optional)
- `status` (New/Contacted/Quotation/Won/Lost)
- `notes` (optional)
- `created_by` (FOREIGN KEY → users)
- `created_at`, `updated_at`

### activity_logs table
- `id` (UUID PRIMARY KEY)
- `lead_id` (FOREIGN KEY → leads, CASCADE DELETE)
- `user_id` (FOREIGN KEY → users)
- `action_type` (created/status_changed/info_updated/deleted)
- `previous_value`, `new_value`
- `timestamp`
- `description`

## 🚀 Deployment

### Deploy Backend (Render/Railway)

1. Push code to GitHub
2. Connect GitHub repo to Render/Railway
3. Set environment variables:
   - `JWT_SECRET` - Random secret key
   - `NODE_ENV` - development
   - `DEFAULT_ADMIN_EMAIL` - test@evpower.com
   - `DEFAULT_ADMIN_NAME` - Test User
   - `DEFAULT_ADMIN_PASSWORD` - password123
   - `PORT` - 5000
4. Deploy

## 🐛 Known Limitations (MVP)

- Single-user permissions (all users see all leads)
- No real-time notifications
- No email notifications
- No file attachments
- No bulk operations
- SQLite for development only 

## 🔮 Future Enhancements

- Role-based access control (Sales Rep, Manager, Admin)
- Email notifications on lead status changes
- Advanced reporting and analytics
- Lead assignment to team members
- Custom fields and metadata
- Integration with email/calendar services
- Bulk import/export


## 👨‍💻 Development Notes

### Making Changes

1. **Backend**: Changes to routes/controllers require server restart (`npm start`)
2. **Frontend**: Hot reload enabled - changes auto-refresh
3. **Database**: Run `npm run db:init` to reset schema
4. **Seeds**: Run `npm run db:seed` to repopulate test data

### Debugging

- **Frontend**: Check browser DevTools console (F12)
- **Backend**: Check terminal output (npm start)
- **Database**: Inspect `db/crm.db` with SQLite client

