# 🚀 Vibed to Cracked

**A mood-driven JavaScript learning platform that adapts to your learning style**

Vibed to Cracked is an innovative educational platform where users choose their learning vibe and progress through comprehensive JavaScript tutorials, challenges, and projects. Whether you're feeling **CHILL**, **RUSH**, or **GRIND**, the platform adapts to match your mood and pace.

## ✨ Features

### 🎯 Mood-Based Learning
- **CHILL**: Relaxed pace, no time limits, easier content
- **RUSH**: Fast-paced with time limits, medium difficulty  
- **GRIND**: Intense focus, hard content, minimal distractions

### 📚 Comprehensive Content
- **Interactive Tutorials**: MDX-based learning with live code execution
- **Coding Challenges**: Algorithm problems with automated testing
- **Real Projects**: Build actual applications while learning
- **Smart Quizzes**: Reinforce learning with targeted questions
- **Learning Phases**: Structured progression from basics to advanced

### 🌟 Social & Gamification
- **Achievement System**: Unlock badges and certificates
- **Progress Sharing**: Connect with friends and track together
- **Leaderboards**: Compete on coding challenges
- **Study Plans**: Personalized learning paths

### 💎 Premium Features
- **Multiple Subscription Tiers**: FREE, PRO, PREMIUM
- **Advanced Content**: Exclusive tutorials and challenges
- **Priority Support**: Direct access to instructors
- **Certification**: Shareable certificates of completion

## 🛠️ Tech Stack

### Core Technologies
- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Google/GitHub providers)
- **Styling**: Tailwind CSS with custom mood theming
- **Payment**: Stripe integration

### Development Tools
- **Code Execution**: WebContainer API for in-browser JavaScript
- **Content**: MDX for interactive tutorials
- **Testing**: Jest with Testing Library
- **Type Safety**: TypeScript throughout
- **Deployment**: Docker-ready with compose files

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/vibed-to-cracked.git
cd vibed-to-cracked/app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database and API keys

# Set up the database
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📋 Available Scripts

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode

### Database Management
- `npm run db:migrate` - Deploy Prisma migrations
- `npm run db:seed` - Seed database with initial data
- `npm run db:reset` - Reset database (force)
- `npm run db:studio` - Open Prisma Studio

### Docker Deployment
- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run Docker container
- `npm run deploy:up` - Docker Compose up with build
- `npm run deploy:down` - Docker Compose down
- `npm run deploy:logs` - View Docker Compose logs

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/               # Backend API endpoints
│   ├── (dashboard)/       # Protected dashboard pages
│   └── (auth)/           # Authentication pages
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── providers/        # Context providers
│   └── interactive/      # Learning-specific components
├── content/              # MDX tutorial content
│   └── tutorials/        # Organized by category
├── data/                 # Static data (challenges, quizzes)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions & services
└── types/                # TypeScript type definitions

prisma/
├── schema.prisma         # Database schema
├── migrations/           # Database migrations
└── seed*.ts             # Database seeding scripts
```

## 🎓 Content Categories

### Learning Phases
1. **HTML Foundations** - Web markup basics
2. **CSS Foundations** - Styling and layout
3. **JavaScript Fundamentals** - Core JS concepts
4. **DOM Manipulation** - Interactive web pages
5. **Object-Oriented Programming** - Classes and patterns
6. **Asynchronous JavaScript** - Promises and async/await
7. **Advanced JavaScript** - Deep concepts and patterns
8. **Data Structures & Algorithms** - Computer science fundamentals
9. **Backend Development** - Node.js and server-side concepts

### Content Types
- **Tutorials**: Step-by-step interactive lessons
- **Challenges**: Coding problems with test cases
- **Projects**: Real-world application building
- **Quizzes**: Knowledge reinforcement

## 🔧 Configuration

### Environment Variables
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/vibed_to_cracked"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# Payment
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### Database Schema
The application uses Prisma with PostgreSQL. Key models include:
- **User**: Authentication and preferences
- **Tutorial/Quiz/Challenge/Project**: Learning content
- **Progress**: User completion tracking
- **Achievement**: Gamification system
- **Subscription**: Payment and access control

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test -- tutorial.test.js
```

## 🚢 Deployment

### Docker Deployment
```bash
# Build and start with Docker Compose
npm run deploy:up

# View logs
npm run deploy:logs

# Stop services
npm run deploy:down
```

### Production Build
```bash
# Build for production
npm run build:production

# Start production server
npm run start:production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following the existing code style
4. Add tests for new functionality
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines
- Follow the existing component patterns
- Write comprehensive tests
- Use TypeScript for type safety
- Follow the established file structure
- Keep components under 400 lines
- Write educational, beginner-friendly content

## 📖 Learning Philosophy

**Vibed to Cracked** is designed around these principles:
- **Mood-driven learning**: Match content delivery to user energy
- **Interactive engagement**: Hands-on coding in every lesson
- **Progressive complexity**: Build skills systematically
- **Real-world relevance**: Practical projects and scenarios
- **Community connection**: Social features for motivation

## 🐛 Troubleshooting

### Common Issues

**Database connection issues:**
```bash
# Reset and reseed database
npm run db:reset
npm run db:seed
```

**Build errors:**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**WebContainer not working:**
- Ensure you're using a modern browser with SharedArrayBuffer support
- Check that the site is served over HTTPS in production

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Prisma](https://prisma.io/)
- Authentication via [NextAuth.js](https://next-auth.js.org/)
- Payments by [Stripe](https://stripe.com/)
- Code execution via [WebContainer API](https://webcontainer.dev/)

---

**Ready to go from vibed to cracked?** 🚀 Start your JavaScript mastery journey today!