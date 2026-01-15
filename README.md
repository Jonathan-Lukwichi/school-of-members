# 🎓 School of Members

A modern, full-stack Learning Management System (LMS) designed for educational institutions, churches, and organizations to manage courses, students, teachers, and learning progress.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase)

---

## 📖 Overview

**School of Members** is a comprehensive learning platform that enables organizations to:

- ✅ Create and manage courses with modular content
- ✅ Enroll and track student progress
- ✅ Assign teachers to students for personalized mentorship
- ✅ Communicate with students via WhatsApp integration
- ✅ Monitor attendance and learning analytics

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **Multi-Role Dashboard** | Separate dashboards for Admins, Teachers, and Students |
| **Course Management** | Create courses with modules, lessons, and resources |
| **Student Enrollment** | Easy registration via phone number with WhatsApp PIN authentication |
| **Teacher Assignment** | Assign teachers to students for guided learning |
| **Progress Tracking** | Monitor student progress, completion rates, and attendance |
| **WhatsApp Integration** | Send notifications, PINs, and updates via Twilio WhatsApp API |
| **Modern UI/UX** | Dark theme with purple/cyan accents, glass morphism, and smooth animations |
| **Responsive Design** | Fully responsive across desktop, tablet, and mobile devices |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui** | Pre-built accessible components |
| **Lucide Icons** | Beautiful icon library |
| **Sonner** | Toast notifications |

### Backend & Database
| Technology | Purpose |
|------------|---------|
| **Supabase** | PostgreSQL database & authentication |
| **Row Level Security** | Secure data access policies |
| **Supabase Auth** | User authentication & session management |

### Integrations
| Technology | Purpose |
|------------|---------|
| **Twilio** | WhatsApp messaging API |
| **libphonenumber-js** | Phone number validation |

---

## 📁 Project Structure

```
school-of-members/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Authentication pages
│   │   │   ├── login/          # Admin/Teacher login
│   │   │   ├── register/       # Admin registration
│   │   │   └── student/        # Student auth flow
│   │   ├── (dashboard)/        # Protected dashboard routes
│   │   │   ├── admin/          # Admin pages
│   │   │   │   ├── courses/    # Course management
│   │   │   │   ├── students/   # Student management
│   │   │   │   └── teachers/   # Teacher management
│   │   │   └── student/        # Student pages
│   │   │       ├── courses/    # Enrolled courses
│   │   │       └── profile/    # Student profile
│   │   ├── api/                # API routes
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── forms/              # Form components
│   │   ├── layout/             # Layout components
│   │   └── shared/             # Shared components
│   ├── lib/
│   │   ├── supabase/           # Supabase client config
│   │   └── utils.ts            # Utility functions
│   └── styles/
│       └── globals.css         # Global styles & theme
├── supabase/
│   └── migrations/             # Database migrations
├── public/                     # Static assets
└── package.json
```

---

## 🗄️ Database Schema

### Core Tables

| Table | Description |
|-------|-------------|
| **profiles** | User profiles with roles (admin, teacher, student) |
| **courses** | Course information and settings |
| **modules** | Course modules/chapters |
| **enrollments** | Student course enrollments |
| **module_progress** | Student progress per module |
| **attendance** | Session attendance records |
| **teachers** | Teacher profiles and assignments |
| **students** | Student-specific data with WhatsApp info |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Twilio account (for WhatsApp)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/school-of-members.git
   cd school-of-members
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Twilio (WhatsApp)
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   ```

4. **Run database migrations**

   Execute the SQL files in `supabase/migrations/` in your Supabase SQL editor.

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 👥 User Roles

| Role | Access |
|------|--------|
| **Admin** | Full platform access - manage courses, students, teachers, settings |
| **Teacher** | View assigned students, track progress, manage sessions |
| **Student** | View enrolled courses, complete modules, track progress |

---

## 🔐 Authentication Flow

### Admin/Teacher
1. Register/Login with email and password
2. Access role-based dashboard

### Student
1. Register with phone number
2. Receive 6-digit PIN via WhatsApp
3. Login with phone + PIN
4. Access student dashboard

---

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#0a0118` | Main dark background |
| Card | `#1a0a2e` | Card backgrounds |
| Primary | `#a855f7` | Purple - Primary actions |
| Accent | `#22d3ee` | Cyan - Accent elements |
| Success | `#22c55e` | Green - Success states |
| Warning | `#f59e0b` | Amber - Warning states |
| Error | `#ef4444` | Red - Error states |

### UI Components

- **Glass Morphism**: Frosted glass effect cards
- **Gradient Accents**: Purple to cyan gradients
- **Glow Effects**: Subtle glow on hover
- **Smooth Transitions**: 300ms ease transitions

---

## 🌐 API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/student/register` | POST | Register new student |
| `/api/student/login` | POST | Student PIN login |
| `/api/admin/students` | GET, PATCH, DELETE | Manage students |
| `/api/admin/teachers` | GET, POST, DELETE | Manage teachers |

---

## 📦 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

For support, please open an issue in the GitHub repository.

---

<p align="center">
  Built with ❤️ using Next.js, Supabase, and Tailwind CSS
</p>
