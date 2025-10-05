# breakfast4U Local Setup Instructions

## Prerequisites
- Node.js (version 16 or higher)
- npm or yarn
- VS Code (recommended)

## Step-by-Step Setup

### 1. Create Project Directory
```bash
mkdir breakfast4u-website
cd breakfast4u-website
```

### 2. Initialize Vite React Project
```bash
npm create vite@latest . -- --template react
```

### 3. Install Dependencies
```bash
npm install
npm install @supabase/supabase-js framer-motion lucide-react react-hook-form react-router-dom
npm install -D autoprefixer postcss tailwindcss
```

### 4. Initialize Tailwind CSS
```bash
npx tailwindcss init -p
```

### 5. Replace Default Files
Replace the following files with the breakfast4U code:

- `src/App.jsx`
- `src/main.jsx`
- `src/index.css`
- `index.html`
- `tailwind.config.js`
- `package.json` (update dependencies)

### 6. Create Component Structure
Create these directories and files:
```
src/
├── components/
│   ├── Header.jsx
│   └── Footer.jsx
├── pages/
│   ├── Home.jsx
│   ├── Menu.jsx
│   ├── Stores.jsx
│   ├── About.jsx
│   └── Contact.jsx
└── App.jsx
```

### 7. Start Development Server
```bash
npm run dev
```

## File Locations in VS Code

When working in VS Code, your project structure should look like this:

```
breakfast4u-website/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Menu.jsx
│   │   ├── Stores.jsx
│   │   ├── About.jsx
│   │   └── Contact.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Common Issues and Solutions

### Issue: npm install fails
**Solution:** Make sure you're in the correct directory with package.json

### Issue: Tailwind styles not working
**Solution:** Ensure tailwind.config.js is properly configured and index.css has Tailwind imports

### Issue: React Router not working
**Solution:** Make sure react-router-dom is installed and BrowserRouter is properly set up

### Issue: Icons not displaying
**Solution:** Verify lucide-react is installed and imported correctly

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## VS Code Extensions (Recommended)

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Bracket Pair Colorizer
- Prettier - Code formatter