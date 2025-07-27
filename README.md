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