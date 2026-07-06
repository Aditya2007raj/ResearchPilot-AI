# ResearchPilot AI - Frontend Architecture

## Technology Stack
- **Framework**: React 18+ with Vite
- **Language**: JavaScript (ES6+) or TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API + Hooks
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **UI Components**: Headless UI / Radix UI (optional)
- **Icons**: Lucide React
- **Forms**: React Hook Form (optional)
- **Build Tool**: Vite

## Architecture Overview

### Component Architecture
```
┌─────────────────────────────────────┐
│         App Component               │
│  - Router Setup                     │
│  - Global Providers                 │
│  - Error Boundaries                 │
└──────────────┬──────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼───┐  ┌──▼───┐  ┌──▼────┐
│ Pages │  │Layout│  │Common │
│       │  │      │  │Components
└───┬───┘  └──┬───┘  └──┬────┘
    │         │         │
    └─────────┼─────────┘
              │
    ┌─────────▼─────────┐
    │   Services Layer  │
    │  - API Calls      │
    │  - Data Transform │
    └───────────────────┘
```

## Core Components

### 1. Layout Components (`src/components/layout/`)

#### Header.jsx
```jsx
<Header>
  - Logo/Brand
  - Navigation (Home, Upload, History)
  - Theme Toggle (Dark/Light)
  - GitHub Link
</Header>
```

**Features**:
- Responsive navigation
- Active route highlighting
- Mobile menu toggle

#### Sidebar.jsx
```jsx
<Sidebar>
  - File history
  - Quick actions
  - Analysis status
</Sidebar>
```

**Features**:
- Collapsible sidebar
- Recent files list
- Analysis progress indicators

#### Footer.jsx
```jsx
<Footer>
  - Copyright
  - Links
  - Version info
</Footer>
```

### 2. Common Components (`src/components/common/`)

#### Button.jsx
```jsx
<Button variant="primary|secondary|ghost" size="sm|md|lg">
  - Loading state
  - Disabled state
  - Icon support
</Button>
```

#### Card.jsx
```jsx
<Card>
  - Title
  - Content
  - Actions
  - Hover effects
</Card>
```

#### LoadingSpinner.jsx
```jsx
<LoadingSpinner>
  - Different sizes
  - Custom messages
  - Progress bars
</LoadingSpinner>
```

#### ErrorBoundary.jsx
```jsx
<ErrorBoundary>
  - Catch React errors
  - Fallback UI
  - Error logging
</ErrorBoundary>
```

#### Modal.jsx
```jsx
<Modal>
  - Open/Close control
  - Backdrop
  - Animation
  - Accessibility
</Modal>
```

### 3. Upload Components (`src/components/upload/`)

#### FileDropZone.jsx
```jsx
<FileDropZone>
  - Drag & drop support
  - File validation
  - Progress indicator
  - Preview
</FileDropZone>
```

**Features**:
- Visual feedback on drag
- File type validation (PDF only)
- File size validation (10MB max)
- Upload progress bar

#### UploadProgress.jsx
```jsx
<UploadProgress>
  - Percentage complete
  - Current step
  - Cancel button
</UploadProgress>
```

### 4. Analysis Components (`src/components/analysis/`)

#### SummaryCard.jsx
```jsx
<SummaryCard>
  - Smart summary display
  - Key points list
  - Expand/collapse
  - Copy to clipboard
</SummaryCard>
```

#### BeginnerExplanation.jsx
```jsx
<BeginnerExplanation>
  - Simplified explanation
  - Concept definitions
  - Visual aids
  - Examples
</BeginnerExplanation>
```

#### ResearchReview.jsx
```jsx
<ResearchReview>
  - Review content
  - Strengths/Weaknesses
  - Rating badges
  - Expandable sections
</ResearchReview>
```

#### ActionPlan.jsx
```jsx
<ActionPlan>
  - Action plan steps
  - Resource links
  - Checklist
  - Progress tracking
</ActionPlan>
```

### 5. Chat Components (`src/components/chat/`)

#### ChatInterface.jsx
```jsx
<ChatInterface>
  - Message list
  - Input field
  - Send button
  - Source citations
</ChatInterface>
```

**Features**:
- Streaming response display
- Message history
- Source highlighting
- Auto-scroll to latest

#### ChatMessage.jsx
```jsx
<ChatMessage role="user|assistant">
  - Avatar
  - Message content
  - Timestamp
  - Sources (if assistant)
</ChatMessage>
```

#### SourceCitation.jsx
```jsx
<SourceCitation>
  - Source text snippet
  - Page number
  - Relevance score
  - View context button
</SourceCitation>
```

## Page Components (`src/pages/`)

### Home.jsx
```jsx
<Home>
  - Hero section
  - Feature highlights
  - How it works
  - CTA to upload
</Home>
```

**Sections**:
- Hero with value proposition
- Feature cards (Summary, Beginner, Review, Action Plan)
- Step-by-step guide
- Testimonials (future)
- Upload CTA

### Upload.jsx
```jsx
<Upload>
  - FileDropZone
  - UploadProgress
  - Success/Error states
  - Redirect to analysis
</Upload>
```

**States**:
- Initial (drop zone visible)
- Uploading (progress bar)
- Processing (indexing)
- Success (redirect)
- Error (retry option)

### Analysis.jsx
```jsx
<Analysis>
  - Paper metadata
  - Tab navigation
  - SummaryCard
  - BeginnerExplanation
  - ResearchReview
  - ActionPlan
  - ChatInterface
</Analysis>
```

**Features**:
- Tab-based navigation
- Lazy loading of analysis types
- Real-time status updates
- Download all as PDF (future)

### Chat.jsx
```jsx
<Chat>
  - ChatInterface
  - Paper context sidebar
  - Source viewer
</Chat>
```

**Features**:
- Dedicated chat page
- Paper context visible
- Source document viewer

## Services Layer (`src/services/`)

### api.js
```javascript
// Axios configuration
- Base URL from environment
- Request/response interceptors
- Error handling
- Timeout configuration
- Retry logic
```

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth (future)
api.interceptors.request.use(/* ... */);

// Response interceptor for errors
api.interceptors.response.use(/* ... */);
```

### uploadService.js
```javascript
class UploadService {
  - uploadPDF(file: File): Promise<UploadResponse>
  - getUploadStatus(fileId: string): Promise<UploadStatus>
  - deleteFile(fileId: string): Promise<void>
}
```

### analysisService.js
```javascript
class AnalysisService {
  - getSummary(fileId: string): Promise<SummaryResponse>
  - getBeginnerExplanation(fileId: string): Promise<BeginnerResponse>
  - getResearchReview(fileId: string): Promise<ReviewResponse>
  - getActionPlan(fileId: string): Promise<ActionPlanResponse>
  - getAllAnalysis(fileId: string): Promise<AllAnalysisResponse>
}
```

### chatService.js
```javascript
class ChatService {
  - sendMessage(fileId: string, question: string, history: array): Promise<ChatResponse>
  - streamMessage(fileId: string, question: string, history: array): AsyncGenerator
}
```

## Custom Hooks (`src/hooks/`)

### useUpload.js
```javascript
function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  
  const uploadFile = async (file) => { /* ... */ };
  
  return { uploadFile, uploading, progress, error };
}
```

### useAnalysis.js
```javascript
function useAnalysis(fileId) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  const fetchSummary = useCallback(async () => { /* ... */ }, [fileId]);
  const fetchBeginner = useCallback(async () => { /* ... */ }, [fileId]);
  const fetchReview = useCallback(async () => { /* ... */ }, [fileId]);
  const fetchActionPlan = useCallback(async () => { /* ... */ }, [fileId]);
  
  return { 
    loading, 
    data, 
    error, 
    fetchSummary, 
    fetchBeginner, 
    fetchReview, 
    fetchActionPlan 
  };
}
```

### useChat.js
```javascript
function useChat(fileId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  
  const sendMessage = async (question) => { /* ... */ };
  const clearHistory = () => { /* ... */ };
  
  return { messages, loading, streaming, sendMessage, clearHistory };
}
```

### useLocalStorage.js
```javascript
function useLocalStorage(key, initialValue) {
  // Persist state to localStorage
  // Useful for theme, recent files, etc.
}
```

## Context (`src/context/`)

### AppContext.jsx
```javascript
const AppContext = createContext();

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [recentFiles, setRecentFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  
  const value = {
    theme,
    setTheme,
    recentFiles,
    setRecentFiles,
    currentFile,
    setCurrentFile,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
```

**Global State**:
- Theme preference
- Recent files history
- Current active file
- User preferences (future)

## Routing Configuration

### main.jsx
```javascript
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'upload', element: <Upload /> },
      { path: 'analysis/:fileId', element: <Analysis /> },
      { path: 'chat/:fileId', element: <Chat /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
```

## State Management Strategy

### Local State
- Component-specific UI state (modals, toggles, inputs)
- Form state
- Temporary data

### Context State
- Global theme
- Recent files
- Current active file
- User session (future)

### Server State
- Analysis results (via hooks)
- Chat history (via hooks)
- File metadata (via hooks)

**Note**: Consider React Query for server state caching in future iterations

## Styling Strategy

### Tailwind CSS Configuration
```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        // Custom color palette
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    // Add plugins as needed
  ],
};
```

### CSS Variables
```css
/* src/styles/variables.css */
:root {
  --color-primary: #0ea5e9;
  --color-secondary: #6366f1;
  --spacing-unit: 0.25rem;
  --border-radius: 0.5rem;
  --transition: 0.2s ease;
}

[data-theme='dark'] {
  --color-primary: #38bdf8;
  --color-secondary: #818cf8;
}
```

## Performance Optimization

### Code Splitting
```javascript
// Lazy load pages
const Analysis = lazy(() => import('./pages/Analysis'));
const Chat = lazy(() => import('./pages/Chat'));
```

### Memoization
- Use `React.memo` for expensive components
- Use `useMemo` for computed values
- Use `useCallback` for event handlers

### Image Optimization
- Use next-gen formats (WebP)
- Lazy load images
- Responsive images

### Bundle Optimization
- Tree shaking (Vite default)
- Dynamic imports
- Minification

## Accessibility

### ARIA Labels
- Semantic HTML
- ARIA attributes for dynamic content
- Keyboard navigation support

### Focus Management
- Visible focus indicators
- Focus traps in modals
- Skip to content link

### Screen Reader Support
- Alt text for images
- Descriptive link text
- Error announcements

### Color Contrast
- WCAG AA compliant colors
- High contrast mode support
- Color-independent information

## Error Handling

### Error Boundary
```javascript
class ErrorBoundary extends React.Component {
  // Catch React errors
  // Display fallback UI
  // Log errors
}
```

### API Error Handling
```javascript
// Global error interceptor
api.interceptors.response.use(
  response => response,
  error => {
    // Handle 400, 401, 404, 500 errors
    // Show user-friendly messages
    // Log technical details
  }
);
```

### User Feedback
- Toast notifications for errors
- Inline error messages for forms
- Retry buttons for failed operations

## Responsive Design

### Breakpoints
```javascript
// Tailwind default breakpoints
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
```

### Mobile-First Approach
- Default styles for mobile
- `md:` and `lg:` prefixes for larger screens
- Touch-friendly targets (44px minimum)

### Adaptive Layouts
- Stack columns on mobile
- Grid layouts on desktop
- Collapsible sidebar on mobile

## Development Experience

### Hot Module Replacement (HMR)
- Vite provides instant HMR
- State preservation during updates
- Fast refresh

### ESLint Configuration
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    // Custom rules
  },
};
```

### Prettier Configuration
```javascript
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

## Environment Configuration

### .env.example
```bash
VITE_API_URL=http://localhost:8000
VITE_APP_TITLE=ResearchPilot AI
VITE_ENABLE_ANALYTICS=false
```

### Build Configuration
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

## Future Enhancements

### Phase 2 (Post-MVP)
- TypeScript migration
- React Query for server state
- Component testing with React Testing Library
- E2E testing with Playwright
- PWA capabilities
- Offline support

### Phase 3
- User authentication
- Saved papers
- Comparison tool
- Export to multiple formats
- Collaboration features
- Advanced analytics
