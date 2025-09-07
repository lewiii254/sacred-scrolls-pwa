# 📖 Bible PWA - Your Digital Scripture Companion

> *"Your word is a lamp for my feet, a light on my path."* - Psalm 119:105

[![Built with Lovable](https://img.shields.io/badge/Built%20with-Lovable-ff69b4.svg)](https://lovable.dev)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-00C896.svg)](https://supabase.com/)

A beautiful, feature-rich Progressive Web App for Bible study, built with modern web technologies. Experience the power of God's Word with offline capabilities, personalized study tools, and a stunning interface that adapts to your preferences.

## ✨ Features

### 🎨 **Beautiful Interface**
- 🌙 **Dark/Light Mode** - Easy on the eyes, any time of day
- 📱 **Responsive Design** - Perfect on mobile, tablet, and desktop
- 🎯 **Modern UI** - Clean, distraction-free reading experience
- 🎨 **Custom Themes** - Personalize your Bible study environment

### 📚 **Bible Reading & Study**
- 📖 **Multiple Translations** - Choose from various Bible versions
- 🔍 **Smart Search** - Find verses instantly with advanced search
- 🖍️ **Highlighting System** - Mark important passages with colors
- ✏️ **Personal Notes** - Add your thoughts and reflections
- 🔖 **Bookmarks** - Save your favorite verses for quick access
- 📝 **Cross-References** - Explore connected scriptures

### 🎧 **Audio Experience**
- 🔊 **Audio Bible** - Listen to God's Word narrated
- ⏯️ **Playback Controls** - Play, pause, speed control
- 📻 **Background Play** - Continue listening while browsing

### 🌟 **Spiritual Growth**
- 📅 **Daily Devotionals** - Fresh inspiration every day
- 🔥 **Reading Streaks** - Track your consistency
- 📊 **Progress Tracking** - Monitor your Bible reading journey
- 🎯 **Reading Plans** - Structured approaches to scripture

### 🚀 **Advanced Features**
- 📱 **PWA Support** - Install on your device like a native app
- 🔄 **Offline Reading** - Access your saved content anywhere
- 👥 **Social Sharing** - Share verses with friends and family
- 🔐 **User Accounts** - Sync across all your devices
- 🔒 **Privacy First** - Your data stays secure

## 🛠️ Technology Stack

### **Frontend**
- ⚛️ **React 18** - Modern React with hooks and concurrent features
- 🏗️ **TypeScript** - Type-safe development
- ⚡ **Vite** - Lightning-fast build tool
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧩 **shadcn/ui** - Beautiful, accessible components
- 🎭 **Framer Motion** - Smooth animations
- 📱 **React Router** - Client-side routing

### **Backend & Database**
- 🗄️ **Supabase** - Backend-as-a-Service
- 🐘 **PostgreSQL** - Reliable, powerful database
- 🔐 **Row Level Security** - Secure data access
- 🔄 **Real-time Updates** - Live data synchronization
- 🗃️ **Supabase Storage** - File and media storage

### **PWA Features**
- 📱 **Service Worker** - Offline functionality
- 📦 **App Manifest** - Installable web app
- 🔄 **Background Sync** - Sync when connection returns
- 📮 **Push Notifications** - Stay engaged with reminders

## 🚀 Quick Start

### **Prerequisites**
- 📦 Node.js 18+ and npm
- 🗄️ Supabase account

### **Installation**

```bash
# 📥 Clone the repository
git clone https://github.com/yourusername/bible-pwa.git
cd bible-pwa

# 📦 Install dependencies
npm install

# ⚙️ Set up environment variables
cp .env.example .env
# Add your Supabase credentials

# 🚀 Start development server
npm run dev
```

### **Environment Setup**

Create a `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📖 Usage Guide

### **Getting Started**
1. 🔐 **Sign Up/Login** - Create your account or sign in
2. 📚 **Choose Translation** - Select your preferred Bible version
3. 🔍 **Explore Features** - Discover all the study tools available

### **Key Features**

#### **📖 Reading**
- Navigate through books and chapters
- Use the search bar to find specific verses
- Tap verse numbers to see references

#### **🖍️ Highlighting & Notes**
- Long press any verse to highlight
- Choose from 5 different highlight colors
- Add personal notes to any verse
- View all your highlights and notes in one place

#### **🔖 Bookmarks**
- Save important verses for quick access
- Organize bookmarks by categories
- Export your bookmarks for sharing

#### **📅 Daily Devotionals**
- Start each day with inspiration
- Track your reading streak
- Reflect on daily messages

## 🗺️ Roadmap

### **🎯 Phase 1: Foundation** ✅
- [x] 🏗️ Basic app structure and design system
- [x] 🔐 User authentication and profiles
- [x] 📚 Bible text display and navigation
- [x] 🖍️ Highlighting and notes system
- [x] 🔖 Bookmarks functionality

### **⚡ Phase 2: Enhanced Features** 🚧
- [ ] 🔍 Advanced search with filters
- [ ] 📱 PWA installation prompts
- [ ] 🔄 Offline content caching
- [ ] 📊 Reading statistics and insights
- [ ] 🎨 Additional themes and customization

### **🌟 Phase 3: Social & Audio** 📋
- [ ] 🎧 Audio Bible integration
- [ ] 👥 Social sharing improvements
- [ ] 💬 Community features
- [ ] 📅 Reading plans and challenges
- [ ] 🔔 Smart notifications

### **🚀 Phase 4: Advanced Study Tools** 🔮
- [ ] 📖 Cross-references and commentaries
- [ ] 🔍 Concordance and word studies
- [ ] 📚 Multiple translation comparison
- [ ] 🗺️ Biblical maps and timelines
- [ ] 🎓 Study guides and curricula

### **🌍 Phase 5: Global Features** 💫
- [ ] 🌐 Multiple language support
- [ ] 🌏 Offline-first architecture
- [ ] 📱 Native mobile apps
- [ ] ☁️ Enhanced cloud sync
- [ ] 🤖 AI-powered study assistance

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### **🐛 Bug Reports**
- 🔍 Check existing issues first
- 📝 Provide detailed reproduction steps
- 🖼️ Include screenshots if applicable

### **💡 Feature Requests**
- 🎯 Describe the feature clearly
- 📋 Explain the use case
- 🤔 Consider implementation challenges

### **👨‍💻 Code Contributions**
1. 🍴 Fork the repository
2. 🌿 Create a feature branch
3. ✨ Make your changes
4. ✅ Add tests if applicable
5. 📝 Update documentation
6. 🔄 Submit a pull request

### **Development Guidelines**
- 📏 Follow TypeScript best practices
- 🎨 Use the existing design system
- ✅ Write tests for new features
- 📚 Update documentation
- 🔍 Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- 📖 **Bible Gateway** - For verse text and translations
- 🎨 **shadcn/ui** - For beautiful UI components
- 🗄️ **Supabase** - For backend infrastructure
- ❤️ **Open Source Community** - For making this possible

## 📞 Support

- 📧 **Email**: support@biblepwa.com
- 💬 **Discord**: [Join our community](https://discord.gg/biblepwa)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/bible-pwa/issues)
- 📖 **Documentation**: [Full Docs](https://docs.biblepwa.com)

## 🌟 Show Your Support

If this project has blessed you, please consider:
- ⭐ Starring the repository
- 🍴 Forking and contributing
- 📢 Sharing with your community
- 🙏 Praying for the project and team

---

<div align="center">

**Built with ❤️ for the Kingdom of God**

*"Let the word of Christ dwell in you richly, teaching and admonishing one another in all wisdom"* - Colossians 3:16

[🌐 Visit Website](https://biblepwa.com) • [📱 Download App](https://app.biblepwa.com) • [📖 Documentation](https://docs.biblepwa.com)

</div>
