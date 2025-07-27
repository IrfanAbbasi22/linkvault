# 🔐 LinkVault

A modern, elegant bookmark manager built with Next.js.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd linkvault
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Adding Bookmarks
1. Click the **"Add Bookmark"** button
2. Fill in the title and URL (required)
3. Add an optional description
4. Add tags separated by commas
5. Click **"Add Bookmark"** to save

### Managing Bookmarks
- **Edit**: Click the edit icon on any bookmark
- **Delete**: Click the delete icon (with confirmation)
- **Open Link**: Click the external link icon to open in a new tab

### Filtering & Sorting
- **Search**: Use the search bar to find bookmarks
- **Tag Filtering**: Click on tags to filter bookmarks
- **Sorting**: Use the sort controls to order by title, creation date, or update date
- **Clear Filters**: Click "Clear all" to remove active filters

### Sample Data
- Click **"Add Sample Data"** when no bookmarks exist
- Use **"Clear All"** to reset everything

## 🏗️ Project Structure

```
linkvault/
├── app/
│   ├── globals.css          # Global styles and CSS variables
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main application page
├── components/
│   ├── BookmarkForm.tsx     # Add/edit bookmark modal
│   ├── BookmarkList.tsx     # Display list of bookmarks
│   ├── SortControls.tsx     # Sorting controls
│   └── TagFilter.tsx        # Tag filtering component
├── lib/
│   ├── types.ts             # TypeScript type definitions
│   └── utils.ts             # Utility functions
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary**: Purple (#8B5CF6) - Main brand color
- **Secondary**: Gray tones for UI elements
- **Accent**: Purple gradients for highlights
- **Success**: Green for positive actions
- **Warning**: Red for destructive actions

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: Regular, Medium, Semibold, Bold
- **Sizes**: Responsive text scaling

### Components
- **Cards**: Glass morphism with backdrop blur
- **Buttons**: Gradient backgrounds with hover effects
- **Inputs**: Rounded corners with focus states
- **Tags**: Pill-shaped with gradient backgrounds

## 🔧 Technical Details

### State Management
- **React Hooks** for local state
- **useState** for component state
- **useEffect** for side effects
- **localStorage** for data persistence

### Data Flow
1. **Load**: Read from localStorage on mount
2. **Update**: Modify state and save to localStorage
3. **Filter**: Real-time filtering and sorting
4. **Persist**: Automatic saving on changes

### Performance
- **Client-side rendering** for dynamic content
- **Optimized re-renders** with proper dependencies
- **Efficient filtering** with memoization
- **Fast search** with real-time updates

## 🌐 Browser Support

- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (not supported)

## 📱 Responsive Design

- **Desktop**: Full layout with sidebar
- **Tablet**: Adaptive grid layout
- **Mobile**: Stacked layout with touch-friendly buttons

## 🔒 Data Privacy

- **Local Storage**: Data stays in your browser
- **No Server**: No data sent to external servers
- **Private**: Your bookmarks are yours alone
- **Export Ready**: Easy to backup and restore

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Netlify
```bash
npm run build
# Deploy to Netlify
```

### Static Export
```bash
npm run build
npm run export
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain component reusability
- Add proper error handling
- Write meaningful commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icons
- **Vercel** for the deployment platform

## 🔮 Future Enhancements

- [ ] **Dark Mode Toggle**
- [ ] **Export/Import Functionality**
- [ ] **Cloud Sync Support**
- [ ] **Bookmark Categories/Folders**
- [ ] **Keyboard Shortcuts**
- [ ] **Bookmark Sharing**
- [ ] **Analytics Dashboard**
- [ ] **PWA Support**
- [ ] **Offline Mode**
- [ ] **Multi-language Support**

## 📞 Support

If you have any questions or need help:

- **Issues**: Create an issue on GitHub
- **Discussions**: Start a discussion
- **Email**: Contact the maintainer

---

**Made with ❤️ and Next.js** 