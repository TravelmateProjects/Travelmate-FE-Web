# 🌍 Travelmate Frontend Web Application

[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.1-646CFF.svg)](https://vitejs.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.6-7952B3.svg)](https://getbootstrap.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📖 Project Overview

**Travelmate** is a comprehensive travel management and social networking web application built with modern React ecosystem. The platform serves as a multi-role system providing distinct interfaces and functionalities for different user types:

- 🏢 **System Administrators**: Complete system oversight, user management, partner onboarding, and comprehensive analytics dashboard
- 🤝 **Travel Partners**: Profile management, travel blog publishing, photo album curation, and customer engagement tools
- 🌟 **End Users**: Travel discovery, social networking, experience sharing, and trip planning capabilities

## 🚀 Technology Stack

### Core Framework & Runtime
- **React**: 19.0.0 - Latest React with concurrent features and automatic batching
- **TypeScript**: 5.7.2 - Enhanced type safety with latest language features
- **Vite**: 6.3.1 - Next-generation frontend build tool with HMR and optimized bundling
- **Node.js**: 20+ LTS - Runtime environment with ES modules support

### Frontend Architecture
- **React Router DOM**: 7.6.0 - Client-side routing with nested routes and lazy loading
- **State Management**: React Context API + useReducer pattern for predictable state updates
- **HTTP Client**: Axios 1.8.4 - Promise-based HTTP client with interceptors and request/response transformation
- **Form Handling**: Controlled components with validation hooks
- **Error Boundaries**: Comprehensive error handling and fallback UI components

### UI/UX Framework
- **Bootstrap**: 5.3.6 - Responsive CSS framework with utility classes
- **React Bootstrap**: 2.10.10 - Bootstrap components optimized for React
- **Framer Motion**: 12.23.1 - Production-ready motion library for complex animations
- **React Icons**: 5.5.0 - Popular icon library with tree-shaking support
- **React Toastify**: 11.0.5 - Notification system with positioning and styling options

### Advanced Features
- **Charts & Analytics**: Recharts 3.1.0 - Composable charting library built on D3
- **Image Handling**: 
  - React Dropzone 14.3.8 - Drag-and-drop file uploads with validation
  - Yet Another React Lightbox 3.24.0 - Accessible image gallery with touch gestures
- **Internationalization**: React i18next 15.5.1 - Translation management with namespace support
- **Development Tools**:
  - ESLint 9.22.0 - Static code analysis with React-specific rules
  - TypeScript ESLint - Type-aware linting rules
  - Prettier integration for consistent code formatting

### DevOps & Deployment
- **Containerization**: Docker with multi-stage builds for optimized production images
- **Web Server**: Nginx Alpine for lightweight production serving
- **CI/CD**: GitHub Actions integration for automated testing and deployment
- **Hosting**: Vercel with SPA routing configuration
- **Monitoring**: Built-in error tracking and performance monitoring hooks

## 🏗️ Project Architecture

### Directory Structure
```
src/
├── assets/                     # Static assets and resources
├── components/                 # Reusable UI components
│   ├── admin/                 # Admin-specific components
│   │   ├── UserTable.tsx      # Data grid for user management
│   │   ├── PartnerForm.tsx    # Partner creation form
│   │   └── ReportCharts.tsx   # Analytics visualizations
│   ├── partner/               # Partner-specific components
│   │   ├── BlogEditor.tsx     # Rich text editor for blogs
│   │   ├── AlbumGrid.tsx      # Photo album grid layout
│   │   └── ProfileCard.tsx    # Partner profile display
│   └── share/                 # Shared components across roles
│       ├── Header.tsx         # Navigation header
│       ├── Footer.tsx         # Footer component
│       ├── LoadingSpinner.tsx # Loading states
│       └── ErrorBoundary.tsx  # Error handling wrapper
├── configs/                   # Application configuration
│   ├── api.ts                # API endpoints and settings
│   ├── i18n.ts               # Internationalization setup
│   └── constants.ts          # Application constants
├── contexts/                  # React Context providers
│   ├── AuthContext.tsx       # Authentication state management
│   │   ├── AuthState interface
│   │   ├── AuthActions (LOGIN, LOGOUT, RESTORE)
│   │   ├── Token refresh logic
│   │   └── Role-based authorization
│   └── LanguageContext.tsx   # Multi-language support
├── hooks/                     # Custom React hooks
│   ├── useAuth.tsx           # Authentication hook
│   ├── useApi.tsx            # API calling hook
│   ├── useLocalStorage.tsx   # Local storage management
│   └── useDebounce.tsx       # Input debouncing
├── layouts/                   # Layout components
│   ├── AdminLayout.tsx       # Admin dashboard layout
│   │   ├── Sidebar navigation
│   │   ├── Header with user menu
│   │   └── Main content area
│   └── PartnerLayout.tsx     # Partner portal layout
├── pages/                     # Route components
│   ├── admin/                # Admin pages
│   │   ├── Home.tsx          # Dashboard with metrics
│   │   ├── UserManagement.tsx # CRUD operations for users
│   │   ├── CreatePartner.tsx  # Partner onboarding
│   │   └── Reports.tsx        # Analytics and reporting
│   ├── partner/              # Partner pages
│   │   ├── Home.tsx          # Partner dashboard
│   │   ├── Profile.tsx       # Profile management
│   │   ├── ChangePassword.tsx # Security settings
│   │   ├── albums/           # Photo album management
│   │   │   ├── AlbumsManagement.tsx
│   │   │   ├── CreateAlbum.tsx
│   │   │   └── ViewAlbum.tsx
│   │   └── blog/             # Blog content management
│   │       ├── BlogManagement.tsx
│   │       ├── AddBlog.tsx
│   │       ├── UpdateBlog.tsx
│   │       └── ViewBlog.tsx
│   ├── share/                # Shared pages
│   │   ├── Login.tsx         # Authentication page
│   │   ├── ForgotPassword.tsx # Password recovery
│   │   ├── VerifyOtp.tsx     # OTP verification
│   │   └── ResetPassword.tsx  # Password reset
│   └── LandingPage.tsx       # Public homepage
├── services/                  # API service layer
│   ├── api.ts                # Axios instance configuration
│   ├── authService.ts        # Authentication API calls
│   ├── userService.ts        # User management APIs
│   ├── reportService.ts      # Analytics APIs
│   └── travelHistoryService.ts # Travel data APIs
├── types/                     # TypeScript type definitions
│   ├── Account.ts            # Account entity types
│   ├── User.ts               # User entity types
│   ├── Blog.ts               # Blog entity types
│   └── ApiResponse.ts        # API response interfaces
├── utils/                     # Utility functions
│   ├── formatters.ts         # Data formatting utilities
│   ├── validators.ts         # Input validation functions
│   └── helpers.ts            # Common helper functions
├── App.tsx                   # Root application component
└── main.tsx                  # Application entry point
```

### Component Architecture Patterns

#### 1. Container-Presentation Pattern
```tsx
// Container Component (Smart)
const UserManagementContainer: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Business logic here
  
  return <UserManagementView users={users} loading={loading} />;
};

// Presentation Component (Dumb)
interface UserManagementViewProps {
  users: User[];
  loading: boolean;
}
const UserManagementView: React.FC<UserManagementViewProps> = ({ users, loading }) => {
  // Pure UI rendering
};
```

#### 2. Custom Hooks Pattern
```tsx
// Custom hook for API operations
const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userService.getUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { users, loading, error, fetchUsers };
};
```

#### 3. Context + Reducer Pattern
```tsx
// State management with useReducer
interface AuthState {
  isAuthenticated: boolean;
  account: Account | null;
  user: User | null;
  isLoading: boolean;
}

type AuthAction = 
  | { type: 'LOGIN'; payload: { account: Account; user: User } }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE'; payload: { account: Account | null; user: User | null } };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        account: action.payload.account,
        user: action.payload.user,
        isLoading: false,
      };
    // Other cases...
  }
};
```

## 🔧 Installation & Development Setup

### System Requirements
- **Node.js**: >= 20.x LTS (with npm >= 9.x)
- **Git**: Latest version for version control
- **Docker**: >= 20.x (optional, for containerized development)
- **VS Code**: Recommended IDE with TypeScript and React extensions

### 1. Repository Setup
```bash
# Clone the repository
git clone https://github.com/Nhatthach2703/Travelmate-FE-Web.git
cd Travelmate-FE-Web

# Switch to development branch
git checkout dev
```

### 2. Dependencies Installation
```bash
# Install all dependencies
npm install

# Verify installation
npm audit
```

### 3. Environment Configuration

#### API Configuration
Update `src/configs/api.ts` with your backend configuration:
```typescript
// Development environment
export const API_BASE_URL = "http://localhost:5000/";
export const API_TIMEOUT = 50000; // 50 seconds

// Production environment (update before deployment)
// export const API_BASE_URL = "https://your-api-domain.com/";
```

#### Environment Variables (Optional)
Create `.env.local` for environment-specific configurations:
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=Travelmate
VITE_APP_VERSION=1.0.0
```

### 4. Development Server
```bash
# Start development server with hot reload
npm run dev

# Server will start at http://localhost:3000
# API calls will be made to http://localhost:5000
```

### 5. Build Process
```bash
# Type checking
npm run build

# Preview production build
npm run preview

# Build analysis (optional)
npm run build -- --analyze
```

### 6. Code Quality Tools
```bash
# Run ESLint
npm run lint

# Fix auto-fixable ESLint issues
npm run lint -- --fix

# Type checking only
npx tsc --noEmit
```

## 🐳 Docker Development & Deployment

### Multi-Stage Docker Build
The project uses a optimized multi-stage Docker build process:

```dockerfile
# Stage 1: Build the React app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN npm run build

# Stage 2: Production server with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
```

### Development with Docker
```bash
# Build development image
docker build -t travelmate-fe-web:dev .

# Run development container
docker run -p 3000:3000 -v $(pwd):/app travelmate-fe-web:dev

# Using Docker Compose for full development stack
docker-compose -f docker-compose.dev.yml up -d
```

### Production Deployment
```bash
# Build production image
docker build -t travelmate-fe-web:prod --target production .

# Run production container
docker run -d -p 80:3000 --name travelmate-web travelmate-fe-web:prod

# Using Docker Compose for production
docker-compose up -d
```

### Docker Compose Configuration
```yaml
version: '3.8'
services:
  travelmate-fe-web:
    build: 
      context: .
      target: production
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## 📱 Core Features & Functionality

### 🔐 Authentication System

#### Multi-Role Authentication Architecture
```typescript
interface AuthState {
  isAuthenticated: boolean;
  account: Account | null;  // Account with role information
  user: User | null;        // User profile data (for partners)
  isLoading: boolean;
}

// Role-based access control
type UserRole = 'admin' | 'partner' | 'user';

// Authentication flow
const authFlow = {
  login: '(credentials) -> JWT tokens -> role-based redirect',
  refresh: 'Auto-refresh on token expiry -> maintain session',
  logout: 'Clear tokens -> redirect to landing page'
};
```

#### Security Features
- **JWT Token Management**: Access tokens with automatic refresh mechanism
- **HTTP-Only Cookies**: Secure token storage preventing XSS attacks
- **Role-Based Access Control (RBAC)**: Protected routes based on user roles
- **Password Recovery**: Multi-step password reset with OTP verification
- **Session Persistence**: Automatic session restoration on app reload

#### Authentication Flow Implementation
```typescript
// Login process
const login = async (credentials: LoginCredentials) => {
  const response = await authService.login(credentials);
  dispatch({
    type: 'LOGIN',
    payload: {
      account: response.account,
      user: response.user
    }
  });
  // Automatic redirect based on role
  navigate(account.role === 'admin' ? '/admin/home' : '/partner/home');
};

// Token refresh mechanism
const refreshToken = async () => {
  try {
    await authService.refreshToken({ platform: 'web' });
    // Continue with existing session
  } catch (error) {
    // Force logout on refresh failure
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  }
};
```

### 👨‍💼 Admin Dashboard Features

#### User Management System
- **CRUD Operations**: Create, read, update, delete user accounts
- **Role Assignment**: Assign and modify user roles dynamically
- **Account Status Management**: Enable/disable user accounts
- **Bulk Operations**: Mass user operations with selection tools
- **Advanced Filtering**: Filter users by role, status, registration date
- **Export Functionality**: Export user data in multiple formats (CSV, PDF)

#### Partner Onboarding
- **Multi-Step Registration**: Guided partner registration process
- **Document Verification**: Upload and verify business documents
- **Profile Validation**: Comprehensive profile validation before approval
- **Automated Notifications**: Email notifications for registration status
- **Approval Workflow**: Admin review and approval system

#### Analytics & Reporting
```typescript
// Report data structures
interface DashboardMetrics {
  totalUsers: number;
  activePartners: number;
  monthlyGrowth: number;
  systemUptime: number;
  revenueMetrics: RevenueData[];
}

// Chart configurations for different report types
const reportTypes = {
  userGrowth: 'Line chart showing user registration trends',
  partnerActivity: 'Bar chart of partner engagement metrics',
  systemUsage: 'Pie chart of feature usage distribution',
  revenueAnalysis: 'Combined chart of revenue streams'
};
```

### 🤝 Partner Portal Features

#### Profile Management
- **Comprehensive Profile Editor**: Rich form with validation
- **Profile Photo Management**: Image upload with cropping and optimization
- **Business Information**: Detailed business profile with verification
- **Social Media Integration**: Link social media accounts
- **Availability Settings**: Set availability status and schedule
- **Rating & Reviews**: Display partner ratings and customer feedback

#### Content Management System

##### Blog Management
```typescript
interface BlogPost {
  id: string;
  title: string;
  content: string;      // Rich text content
  excerpt: string;
  featuredImage: Image;
  tags: string[];
  category: BlogCategory;
  status: 'draft' | 'published' | 'archived';
  publishedAt: Date;
  author: Partner;
  viewCount: number;
  likeCount: number;
}

// Blog editor features
const blogFeatures = {
  richTextEditor: 'WYSIWYG editor with formatting options',
  imageUpload: 'Drag-and-drop image upload with optimization',
  autoSave: 'Automatic draft saving every 30 seconds',
  seoOptimization: 'SEO metadata management',
  socialSharing: 'Social media sharing integration'
};
```

##### Photo Album Management
- **Album Creation**: Create themed photo albums
- **Batch Upload**: Multiple photo upload with progress tracking
- **Image Optimization**: Automatic image compression and resizing
- **Album Organization**: Drag-and-drop photo reordering
- **Privacy Settings**: Public/private album visibility options
- **Image Metadata**: EXIF data extraction and display

#### Customer Engagement Tools
- **Messaging System**: Direct communication with customers
- **Review Management**: Respond to customer reviews
- **Booking Management**: Handle travel booking requests
- **Availability Calendar**: Manage availability and scheduling

### 🌐 Shared Features

#### Internationalization (i18n)
```typescript
// Language configuration
const languages = {
  en: 'English',
  vi: 'Tiếng Việt'
};

// Translation namespace structure
const namespaces = {
  common: 'Common UI elements',
  auth: 'Authentication pages',
  admin: 'Admin dashboard',
  partner: 'Partner portal',
  errors: 'Error messages'
};

// Usage example
const { t } = useTranslation(['common', 'auth']);
return <h1>{t('auth:welcome')}</h1>;
```

#### Responsive Design System
- **Mobile-First Approach**: Optimized for mobile devices
- **Bootstrap Grid**: Responsive 12-column grid system
- **Adaptive Components**: Components that adapt to screen size
- **Touch Optimization**: Touch-friendly interface for mobile users
- **Progressive Web App**: PWA features for mobile app-like experience

#### Real-Time Features
- **Live Notifications**: Toast notifications for user actions
- **Real-Time Updates**: WebSocket integration for live data
- **Auto-Refresh**: Automatic data refresh for critical information
- **Progress Tracking**: Real-time progress indicators for uploads

#### Performance Optimization
- **Code Splitting**: Route-based code splitting for faster loading
- **Lazy Loading**: Lazy load components and images
- **Memoization**: React.memo and useMemo for performance optimization
- **Bundle Optimization**: Tree shaking and bundle analysis
- **Caching Strategy**: Service worker for offline functionality

## 🔧 Advanced Configuration

### API Configuration Management
```typescript
// src/configs/api.ts
export const API_CONFIG = {
  // Base configuration
  BASE_URL: process.env.VITE_API_BASE_URL || "http://localhost:5000/",
  TIMEOUT: 50000, // 50 seconds
  
  // Request configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  
  // Authentication
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
  
  // Upload limits
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
};

// Axios interceptor configuration
API.interceptors.request.use(
  (config) => {
    // Add authentication token
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => {
    // Log response time
    const endTime = new Date();
    const duration = endTime.getTime() - response.config.metadata.startTime.getTime();
    console.log(`API call to ${response.config.url} took ${duration}ms`);
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await refreshTokens();
        return API(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

### State Management Architecture
```typescript
// Advanced AuthContext with middleware
interface AuthContextValue {
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
  
  // Action creators
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  
  // Utilities
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: Permission) => boolean;
  isTokenExpiring: () => boolean;
}

// Middleware for auth actions
const authMiddleware = (action: AuthAction, dispatch: Dispatch<AuthAction>) => {
  // Log all auth actions
  console.log(`[Auth] Action: ${action.type}`, action.payload);
  
  // Analytics tracking
  if (action.type === 'LOGIN') {
    analytics.track('user_login', {
      role: action.payload.account.role,
      timestamp: new Date().toISOString()
    });
  }
  
  // Execute action
  dispatch(action);
  
  // Post-action effects
  if (action.type === 'LOGOUT') {
    // Clear all stored data
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cache
    queryClient.clear();
  }
};
```

### Form Validation & Error Handling
```typescript
// Custom validation hooks
const useFormValidation = <T>(initialValues: T, validationRules: ValidationRules<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  
  const validate = useCallback((fieldName?: keyof T) => {
    const fieldsToValidate = fieldName ? [fieldName] : Object.keys(validationRules) as (keyof T)[];
    const newErrors: Partial<Record<keyof T, string>> = {};
    
    fieldsToValidate.forEach(field => {
      const rule = validationRules[field];
      const value = values[field];
      
      if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
        newErrors[field] = `${String(field)} is required`;
        return;
      }
      
      if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
        newErrors[field] = `${String(field)} must be at least ${rule.minLength} characters`;
        return;
      }
      
      if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        newErrors[field] = rule.message || `${String(field)} format is invalid`;
        return;
      }
      
      if (rule.custom) {
        const customError = rule.custom(value, values);
        if (customError) {
          newErrors[field] = customError;
          return;
        }
      }
    });
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  }, [values, validationRules]);
  
  const setValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate on change for real-time feedback
    setTimeout(() => validate(field), 100);
  }, [validate]);
  
  return {
    values,
    errors,
    touched,
    setValue,
    validate,
    isValid: Object.keys(errors).length === 0,
    hasErrors: Object.keys(errors).length > 0
  };
};

// Global error boundary with retry mechanism
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error; retry: () => void }> },
  { hasError: boolean; error: Error | null; retryCount: number }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0 };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    errorReporting.captureException(error, {
      extra: errorInfo,
      tags: { component: 'ErrorBoundary' }
    });
  }
  
  retry = () => {
    if (this.state.retryCount < 3) {
      this.setState({
        hasError: false,
        error: null,
        retryCount: this.state.retryCount + 1
      });
    }
  };
  
  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} retry={this.retry} />;
    }
    
    return this.props.children;
  }
}
```

### Performance Optimization Strategies
```typescript
// Code splitting with lazy loading
const AdminHome = lazy(() => 
  import('../pages/admin/Home').then(module => ({
    default: module.AdminHome
  }))
);

const PartnerHome = lazy(() => 
  import('../pages/partner/Home').then(module => ({
    default: module.PartnerHome
  }))
);

// Preload critical routes
const preloadRoute = (routeImport: () => Promise<any>) => {
  const componentImport = routeImport();
  return componentImport;
};

// Preload on user interaction
const handleLinkHover = (route: string) => {
  switch (route) {
    case '/admin':
      preloadRoute(() => import('../pages/admin/Home'));
      break;
    case '/partner':
      preloadRoute(() => import('../pages/partner/Home'));
      break;
  }
};

// Memoization strategies
const MemoizedUserList = React.memo(({ users, onUserSelect }: UserListProps) => {
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} onClick={onUserSelect} />
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function
  return (
    prevProps.users.length === nextProps.users.length &&
    prevProps.users.every((user, index) => 
      user.id === nextProps.users[index].id &&
      user.updatedAt === nextProps.users[index].updatedAt
    )
  );
});

// Virtual scrolling for large lists
const VirtualizedUserList = ({ users }: { users: User[] }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(50);
  const itemHeight = 60;
  const containerHeight = 600;
  
  const visibleUsers = useMemo(() => 
    users.slice(startIndex, endIndex),
    [users, startIndex, endIndex]
  );
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const newStartIndex = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    
    setStartIndex(newStartIndex);
    setEndIndex(newStartIndex + visibleCount + 5); // Buffer
  }, [itemHeight, containerHeight]);
  
  return (
    <div style={{ height: containerHeight, overflow: 'auto' }} onScroll={handleScroll}>
      <div style={{ height: users.length * itemHeight, position: 'relative' }}>
        {visibleUsers.map((user, index) => (
          <div
            key={user.id}
            style={{
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              height: itemHeight,
              width: '100%'
            }}
          >
            <UserCard user={user} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 📋 Available Scripts & Commands

### Development Scripts
```bash
# Start development server with hot module replacement
npm run dev
# Equivalent to: vite --host 0.0.0.0 --port 3000

# Build application for production
npm run build
# Equivalent to: tsc -b && vite build

# Preview production build locally
npm run preview
# Equivalent to: vite preview --port 3000

# Run TypeScript compiler check
npm run type-check
# Equivalent to: tsc --noEmit

# Run ESLint with automatic fixing
npm run lint
# Equivalent to: eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0

# Fix ESLint issues automatically
npm run lint:fix
# Equivalent to: npm run lint -- --fix
```

### Advanced Build Scripts
```bash
# Build with bundle analyzer
npm run build:analyze
# Generates bundle size analysis report

# Build for different environments
npm run build:staging
npm run build:production

# Generate type definitions
npm run build:types

# Create production Docker image
npm run docker:build
# Equivalent to: docker build -t travelmate-fe-web:latest .

# Run Docker container
npm run docker:run
# Equivalent to: docker run -p 3000:3000 travelmate-fe-web:latest
```

### Testing Scripts (Future Implementation)
```bash
# Run unit tests
npm run test
# Equivalent to: vitest

# Run tests in watch mode
npm run test:watch
# Equivalent to: vitest --watch

# Generate test coverage report
npm run test:coverage
# Equivalent to: vitest --coverage

# Run end-to-end tests
npm run test:e2e
# Equivalent to: playwright test
```

### Utility Scripts
```bash
# Clean build artifacts
npm run clean
# Removes dist/, node_modules/.vite/, etc.

# Update dependencies
npm run deps:update
# Interactive dependency update

# Security audit
npm run audit
# Check for security vulnerabilities

# Generate project documentation
npm run docs:generate
# Creates API documentation from TypeScript interfaces
```

## 🔍 API Integration & Endpoints

### Backend Service Integration
The application integrates with a RESTful API backend providing comprehensive travel management services.

#### Base Configuration
```typescript
// API client setup with interceptors
const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true, // Enable cookie-based authentication
});
```

### Authentication Endpoints
```typescript
interface AuthAPI {
  // User authentication
  POST: '/auth/login' {
    body: { username: string; password: string; platform: 'web' }
    response: { account: Account; user?: User; tokens: TokenPair }
  }
  
  // Token refresh
  POST: '/auth/refresh-token' {
    body: { platform: 'web' }
    response: { accessToken: string; refreshToken: string }
  }
  
  // Logout
  POST: '/auth/logout' {
    response: { message: string }
  }
  
  // Password recovery flow
  POST: '/auth/forgot-password' {
    body: { email: string }
    response: { message: string; otpSent: boolean }
  }
  
  POST: '/auth/verify-otp' {
    body: { email: string; otp: string }
    response: { isValid: boolean; resetToken: string }
  }
  
  POST: '/auth/reset-password' {
    body: { resetToken: string; newPassword: string }
    response: { message: string; success: boolean }
  }
}
```

### User Management Endpoints (Admin)
```typescript
interface UserManagementAPI {
  // Get paginated users
  GET: '/admin/users' {
    query: {
      page?: number;
      limit?: number;
      role?: 'user' | 'partner' | 'admin';
      status?: 'active' | 'inactive' | 'suspended';
      search?: string;
      sortBy?: 'createdAt' | 'lastActive' | 'name';
      sortOrder?: 'asc' | 'desc';
    }
    response: {
      users: User[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        hasNext: boolean;
        hasPrev: boolean;
      }
    }
  }
  
  // Create new user
  POST: '/admin/users' {
    body: CreateUserRequest
    response: { user: User; account: Account }
  }
  
  // Update user
  PUT: '/admin/users/:id' {
    body: Partial<UpdateUserRequest>
    response: { user: User }
  }
  
  // Delete user (soft delete)
  DELETE: '/admin/users/:id' {
    response: { message: string; deletedAt: string }
  }
  
  // Bulk operations
  POST: '/admin/users/bulk' {
    body: {
      action: 'activate' | 'deactivate' | 'delete';
      userIds: string[];
    }
    response: { 
      success: number; 
      failed: number; 
      errors?: BulkError[] 
    }
  }
}
```

### Partner Management Endpoints
```typescript
interface PartnerAPI {
  // Partner profile management
  GET: '/partner/profile' {
    response: { user: User; statistics: PartnerStats }
  }
  
  PUT: '/partner/profile' {
    body: UpdatePartnerProfileRequest
    response: { user: User }
  }
  
  // Avatar and cover image upload
  POST: '/partner/upload/avatar' {
    body: FormData // multipart/form-data
    response: { 
      avatar: { url: string; publicId: string }
      user: User 
    }
  }
  
  POST: '/partner/upload/cover' {
    body: FormData
    response: { 
      coverImage: { url: string; publicId: string }
      user: User 
    }
  }
}
```

### Blog Management Endpoints
```typescript
interface BlogAPI {
  // Get partner's blogs
  GET: '/partner/blogs' {
    query: {
      page?: number;
      limit?: number;
      status?: 'draft' | 'published' | 'archived';
      category?: string;
      search?: string;
    }
    response: {
      blogs: BlogPost[];
      pagination: PaginationInfo;
    }
  }
  
  // Create new blog post
  POST: '/partner/blogs' {
    body: CreateBlogRequest
    response: { blog: BlogPost }
  }
  
  // Update blog post
  PUT: '/partner/blogs/:id' {
    body: UpdateBlogRequest
    response: { blog: BlogPost }
  }
  
  // Delete blog post
  DELETE: '/partner/blogs/:id' {
    response: { message: string }
  }
  
  // Upload blog images
  POST: '/partner/blogs/:id/images' {
    body: FormData
    response: { 
      images: { url: string; publicId: string }[] 
    }
  }
  
  // Publish/unpublish blog
  PATCH: '/partner/blogs/:id/status' {
    body: { status: 'published' | 'draft' | 'archived' }
    response: { blog: BlogPost }
  }
}
```

### Album Management Endpoints
```typescript
interface AlbumAPI {
  // Get partner's albums
  GET: '/partner/albums' {
    query: {
      page?: number;
      limit?: number;
      privacy?: 'public' | 'private';
    }
    response: {
      albums: Album[];
      pagination: PaginationInfo;
    }
  }
  
  // Create new album
  POST: '/partner/albums' {
    body: CreateAlbumRequest
    response: { album: Album }
  }
  
  // Upload photos to album
  POST: '/partner/albums/:id/photos' {
    body: FormData // Multiple files
    response: { 
      photos: Photo[];
      album: Album;
    }
  }
  
  // Reorder photos in album
  PUT: '/partner/albums/:id/reorder' {
    body: { photoIds: string[] }
    response: { album: Album }
  }
  
  // Delete album
  DELETE: '/partner/albums/:id' {
    response: { message: string }
  }
}
```

### Analytics & Reporting Endpoints
```typescript
interface AnalyticsAPI {
  // Dashboard metrics for admin
  GET: '/admin/analytics/dashboard' {
    query: {
      startDate?: string;
      endDate?: string;
      granularity?: 'daily' | 'weekly' | 'monthly';
    }
    response: {
      userMetrics: {
        totalUsers: number;
        newUsers: number;
        activeUsers: number;
        retentionRate: number;
      };
      partnerMetrics: {
        totalPartners: number;
        activePartners: number;
        averageRating: number;
      };
      contentMetrics: {
        totalBlogs: number;
        totalAlbums: number;
        totalPhotos: number;
      };
      systemMetrics: {
        uptime: number;
        responseTime: number;
        errorRate: number;
      };
    }
  }
  
  // Export data
  GET: '/admin/analytics/export' {
    query: {
      type: 'users' | 'partners' | 'content' | 'activity';
      format: 'csv' | 'pdf' | 'excel';
      startDate?: string;
      endDate?: string;
    }
    response: Blob // File download
  }
}
```

### Error Response Format
```typescript
interface APIError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    requestId: string;
  };
  // HTTP status codes:
  // 400 - Bad Request (validation errors)
  // 401 - Unauthorized (authentication required)
  // 403 - Forbidden (insufficient permissions)
  // 404 - Not Found (resource doesn't exist)
  // 409 - Conflict (resource already exists)
  // 422 - Unprocessable Entity (business logic errors)
  // 429 - Too Many Requests (rate limiting)
  // 500 - Internal Server Error
}
```

### API Response Caching Strategy
```typescript
// Cache configuration for different endpoints
const cacheConfig = {
  // Static data - cache for 1 hour
  '/admin/analytics/dashboard': { ttl: 3600000, staleWhileRevalidate: true },
  
  // User profiles - cache for 5 minutes
  '/partner/profile': { ttl: 300000, staleWhileRevalidate: true },
  
  // Blog listings - cache for 2 minutes
  '/partner/blogs': { ttl: 120000, staleWhileRevalidate: false },
  
  // No cache for real-time data
  '/auth/refresh-token': { ttl: 0 },
  '/partner/upload/*': { ttl: 0 }
};
```

## 🛡️ Security Implementation

### Authentication & Authorization Strategy

#### JWT Token Security
```typescript
interface TokenSecurity {
  // Token configuration
  accessToken: {
    expiry: '15 minutes';    // Short-lived for security
    storage: 'memory only';  // Never stored in localStorage
    algorithm: 'RS256';      // Asymmetric encryption
  };
  
  refreshToken: {
    expiry: '7 days';        // Longer-lived for user experience
    storage: 'httpOnly cookie'; // Secure cookie, not accessible via JS
    rotation: 'on each use';     // Rotate refresh tokens
  };
}

// Token validation middleware
const validateToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, PUBLIC_KEY, { algorithm: 'RS256' });
    
    // Check token expiry with grace period
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now - 30) { // 30 second grace period
      throw new Error('Token expired');
    }
    
    return decoded as TokenPayload;
  } catch (error) {
    console.error('Token validation failed:', error);
    return null;
  }
};
```

#### Role-Based Access Control (RBAC)
```typescript
// Permission system
interface Permission {
  resource: string;    // e.g., 'users', 'blogs', 'albums'
  action: string;      // e.g., 'read', 'write', 'delete', 'admin'
  scope?: string;      // e.g., 'own', 'all', 'department'
}

interface Role {
  name: string;
  permissions: Permission[];
  inherits?: string[]; // Role inheritance
}

const roles: Record<string, Role> = {
  admin: {
    name: 'Administrator',
    permissions: [
      { resource: '*', action: '*' }, // Full access
    ]
  },
  
  partner: {
    name: 'Travel Partner',
    permissions: [
      { resource: 'profile', action: 'read', scope: 'own' },
      { resource: 'profile', action: 'write', scope: 'own' },
      { resource: 'blogs', action: '*', scope: 'own' },
      { resource: 'albums', action: '*', scope: 'own' },
      { resource: 'analytics', action: 'read', scope: 'own' }
    ]
  },
  
  user: {
    name: 'End User',
    permissions: [
      { resource: 'profile', action: 'read', scope: 'own' },
      { resource: 'profile', action: 'write', scope: 'own' },
      { resource: 'blogs', action: 'read', scope: 'public' },
      { resource: 'albums', action: 'read', scope: 'public' }
    ]
  }
};

// Permission checking utility
const hasPermission = (
  userRole: string, 
  resource: string, 
  action: string, 
  scope: string = 'own'
): boolean => {
  const role = roles[userRole];
  if (!role) return false;
  
  return role.permissions.some(permission => {
    const resourceMatch = permission.resource === '*' || permission.resource === resource;
    const actionMatch = permission.action === '*' || permission.action === action;
    const scopeMatch = !permission.scope || permission.scope === scope || permission.scope === '*';
    
    return resourceMatch && actionMatch && scopeMatch;
  });
};
```

### Input Validation & Sanitization
```typescript
// Comprehensive validation schemas
const validationSchemas = {
  user: {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      maxLength: 255,
      sanitize: (value: string) => value.toLowerCase().trim()
    },
    
    password: {
      required: true,
      minLength: 8,
      maxLength: 128,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      message: 'Password must contain uppercase, lowercase, number and special character'
    },
    
    fullName: {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
      sanitize: (value: string) => value.trim().replace(/\s+/g, ' ')
    },
    
    phone: {
      pattern: /^\+?[\d\s-()]+$/,
      minLength: 10,
      maxLength: 15,
      sanitize: (value: string) => value.replace(/[^\d+]/g, '')
    }
  },
  
  blog: {
    title: {
      required: true,
      minLength: 5,
      maxLength: 200,
      sanitize: (value: string) => DOMPurify.sanitize(value.trim())
    },
    
    content: {
      required: true,
      minLength: 100,
      maxLength: 50000,
      sanitize: (value: string) => DOMPurify.sanitize(value, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img'],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target']
      })
    },
    
    tags: {
      maxItems: 10,
      itemMaxLength: 30,
      sanitize: (tags: string[]) => tags.map(tag => 
        tag.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '')
      ).filter(tag => tag.length > 0)
    }
  }
};

// XSS Protection
const sanitizeInput = (input: string, type: 'text' | 'html' | 'url' = 'text'): string => {
  switch (type) {
    case 'html':
      return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li'],
        ALLOWED_ATTR: []
      });
      
    case 'url':
      try {
        const url = new URL(input);
        return ['http:', 'https:'].includes(url.protocol) ? url.toString() : '';
      } catch {
        return '';
      }
      
    default:
      return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                  .replace(/javascript:/gi, '')
                  .replace(/on\w+\s*=/gi, '');
  }
};
```

### CORS & CSP Configuration
```typescript
// Content Security Policy
const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Only for development
    'https://apis.google.com',
    'https://www.gstatic.com'
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'",
    'https://fonts.googleapis.com',
    'https://cdn.jsdelivr.net'
  ],
  'img-src': [
    "'self'",
    'data:',
    'https://*.cloudinary.com',
    'https://images.unsplash.com'
  ],
  'connect-src': [
    "'self'",
    process.env.VITE_API_BASE_URL,
    'https://api.analytics.com'
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com'
  ],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"]
};

// CORS configuration for development
const corsConfig = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://travelmate.com', 'https://admin.travelmate.com']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count']
};
```

### File Upload Security
```typescript
// Secure file upload configuration
const uploadSecurity = {
  // File type validation
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  allowedDocumentTypes: ['application/pdf', 'text/plain'],
  
  // Size limits
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxImageSize: 5 * 1024 * 1024,  // 5MB for images
  
  // File validation
  validateFile: (file: File): ValidationResult => {
    const errors: string[] = [];
    
    // Check file size
    if (file.size > uploadSecurity.maxFileSize) {
      errors.push(`File size must be less than ${uploadSecurity.maxFileSize / 1024 / 1024}MB`);
    }
    
    // Check file type
    if (!uploadSecurity.allowedImageTypes.includes(file.type)) {
      errors.push('Invalid file type. Only JPEG, PNG, WebP and GIF are allowed.');
    }
    
    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    if (!extension || !allowedExtensions.includes(extension)) {
      errors.push('Invalid file extension.');
    }
    
    // Validate image dimensions (client-side)
    if (file.type.startsWith('image/')) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (img.width < 100 || img.height < 100) {
            errors.push('Image must be at least 100x100 pixels.');
          }
          if (img.width > 4096 || img.height > 4096) {
            errors.push('Image must be smaller than 4096x4096 pixels.');
          }
          resolve({ isValid: errors.length === 0, errors });
        };
        img.src = URL.createObjectURL(file);
      });
    }
    
    return { isValid: errors.length === 0, errors };
  },
  
  // Generate secure filename
  generateSecureFilename: (originalName: string): string => {
    const extension = originalName.split('.').pop();
    const timestamp = Date.now();
    const randomString = crypto.randomUUID().substring(0, 8);
    return `${timestamp}_${randomString}.${extension}`;
  }
};
```

### Data Protection & Privacy
```typescript
// Data anonymization for logs
const anonymizeUserData = (user: User): AnonymizedUser => ({
  id: user._id,
  role: user.role,
  registrationDate: user.createdAt,
  lastActive: user.lastActive,
  // Remove PII
  email: '***@***.***',
  fullName: '***',
  phone: '***',
  address: '***'
});

// GDPR compliance utilities
const gdprUtils = {
  // Data export for user requests
  exportUserData: async (userId: string): Promise<UserDataExport> => {
    const [user, blogs, albums, activities] = await Promise.all([
      userService.getUserById(userId),
      blogService.getBlogsByUser(userId),
      albumService.getAlbumsByUser(userId),
      activityService.getUserActivities(userId)
    ]);
    
    return {
      personalInfo: user,
      content: { blogs, albums },
      activities,
      exportDate: new Date().toISOString(),
      retentionPeriod: '7 years from last activity'
    };
  },
  
  // Data deletion for user requests
  deleteUserData: async (userId: string): Promise<DeletionReport> => {
    const deletionTasks = [
      () => userService.anonymizeUser(userId),
      () => blogService.deleteUserBlogs(userId),
      () => albumService.deleteUserAlbums(userId),
      () => activityService.purgeUserActivities(userId)
    ];
    
    const results = await Promise.allSettled(deletionTasks.map(task => task()));
    
    return {
      userId,
      deletionDate: new Date().toISOString(),
      success: results.every(result => result.status === 'fulfilled'),
      details: results
    };
  }
};
```

## 🎨 UI/UX Design System

### Design Philosophy & Principles

#### Core Design Values
- **Accessibility First**: WCAG 2.1 AA compliant interface design
- **Mobile-First Responsive**: Progressive enhancement from mobile to desktop
- **Performance-Optimized**: Lightweight components with minimal re-renders
- **Consistent Branding**: Cohesive visual identity across all touchpoints
- **User-Centric**: Interface designed around user workflows and mental models

### Visual Design System

#### Color Palette
```css
:root {
  /* Primary Colors */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6;   /* Main brand color */
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;

  /* Semantic Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;

  /* Neutral Colors */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;

  /* Background Colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --bg-overlay: rgba(0, 0, 0, 0.6);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1f2937;
    --bg-secondary: #111827;
    --bg-tertiary: #0f172a;
    --text-primary: #f9fafb;
    --text-secondary: #d1d5db;
  }
}
```

#### Typography System
```css
/* Font Family */
:root {
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-display: 'Poppins', var(--font-primary);
  --font-mono: 'JetBrains Mono', 'Monaco', 'Cascadia Code', monospace;
}

/* Type Scale */
.text-xs { font-size: 0.75rem; line-height: 1rem; }      /* 12px */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }  /* 14px */
.text-base { font-size: 1rem; line-height: 1.5rem; }     /* 16px */
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }  /* 18px */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }   /* 20px */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }      /* 24px */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; } /* 30px */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }   /* 36px */

/* Font Weights */
.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
```

#### Spacing & Layout System
```css
/* Spacing Scale (based on 0.25rem = 4px) */
:root {
  --space-0: 0;
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
  --space-20: 5rem;    /* 80px */
  --space-24: 6rem;    /* 96px */
}

/* Container Sizes */
.container-sm { max-width: 640px; }
.container-md { max-width: 768px; }
.container-lg { max-width: 1024px; }
.container-xl { max-width: 1280px; }
.container-2xl { max-width: 1536px; }
```

### Component Design Patterns

#### Button Component System
```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  leftIcon,
  rightIcon,
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };
  
  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        isDisabled && 'opacity-50 cursor-not-allowed',
        isLoading && 'cursor-wait'
      )}
      disabled={isDisabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner className="mr-2" size={size} />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
```

#### Form Component System
```tsx
// Input component with validation states
const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  isRequired,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const inputClasses = cn(
    'w-full px-4 py-2 text-base border rounded-lg transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
    error 
      ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-400'
      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400',
    leftIcon && 'pl-10',
    rightIcon && 'pr-10'
  );
  
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input className={inputClasses} {...props} />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
```

### Animation & Motion Design

#### Framer Motion Configurations
```tsx
// Page transition animations
export const pageTransitions = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeInOut' }
};

// Stagger animations for lists
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' }
};

// Modal animations
export const modalAnimations = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  content: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.2, ease: 'easeOut' }
  }
};

// Loading animations
export const loadingSpinner = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};
```

### Responsive Design Breakpoints
```css
/* Mobile First Breakpoints */
:root {
  --breakpoint-sm: 640px;   /* Small tablets */
  --breakpoint-md: 768px;   /* Large tablets */
  --breakpoint-lg: 1024px;  /* Small laptops */
  --breakpoint-xl: 1280px;  /* Large laptops */
  --breakpoint-2xl: 1536px; /* Large desktops */
}

/* Responsive utilities */
@media (min-width: 640px) { .sm\:block { display: block; } }
@media (min-width: 768px) { .md\:grid { display: grid; } }
@media (min-width: 1024px) { .lg\:flex { display: flex; } }

/* Container queries for component-level responsiveness */
@container (min-width: 400px) {
  .card-container {
    grid-template-columns: 1fr 2fr;
  }
}
```

### Accessibility Features
```tsx
// Accessible modal implementation
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Focus management
  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
          {...modalAnimations.overlay}
        />
        
        {/* Modal content */}
        <motion.div
          ref={modalRef}
          className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          {...modalAnimations.content}
        >
          <h2 id="modal-title" className="text-xl font-semibold mb-4">
            {title}
          </h2>
          
          {children}
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Screen reader announcements
const useAnnouncement = () => {
  const announce = useCallback((message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);
  
  return announce;
};
```

## 🚀 Production Deployment

### Vercel Deployment Configuration

#### Project Setup
The application is optimized for Vercel deployment with automatic CI/CD integration:

```json
// vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/admin",
      "destination": "/admin/home",
      "permanent": false
    },
    {
      "source": "/partner",
      "destination": "/partner/home",
      "permanent": false
    }
  ]
}
```

#### Environment Variables Configuration
```bash
# Production Environment Variables
VITE_API_BASE_URL=https://api.travelmate.com/
VITE_APP_ENV=production
VITE_SENTRY_DSN=your_sentry_dsn_here
VITE_ANALYTICS_ID=your_analytics_id_here
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
```

### Docker Production Deployment

#### Multi-Stage Production Dockerfile
```dockerfile
# Production optimized Dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM base AS builder
COPY . .
RUN npm run build

FROM nginx:alpine AS production
# Install security updates
RUN apk update && apk upgrade && apk add --no-cache curl

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html

# Security: Remove default nginx user and create custom one
RUN addgroup -g 1001 -S nginx-custom && \
    adduser -S nginx-custom -u 1001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000
USER nginx-custom
CMD ["nginx", "-g", "daemon off;"]
```

#### Production Nginx Configuration
```nginx
# nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;
    
    # Performance optimizations
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    server {
        listen 3000;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;
        
        # Security
        server_tokens off;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Handle SPA routing
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
        
        # API proxy (if needed)
        location /api/ {
            proxy_pass http://backend:5000/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

### Kubernetes Deployment

#### Kubernetes Manifests
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: travelmate-frontend
  labels:
    app: travelmate-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: travelmate-frontend
  template:
    metadata:
      labels:
        app: travelmate-frontend
    spec:
      containers:
      - name: frontend
        image: travelmate/frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: travelmate-frontend-service
spec:
  selector:
    app: travelmate-frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: travelmate-frontend-ingress
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - travelmate.com
    secretName: travelmate-tls
  rules:
  - host: travelmate.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: travelmate-frontend-service
            port:
              number: 80
```

### CI/CD Pipeline

#### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [ main, staging ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run type check
      run: npm run type-check
    
    - name: Run tests
      run: npm run test
    
    - name: Build application
      run: npm run build
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v4
      with:
        name: build-files
        path: dist/

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/staging'
    steps:
    - name: Deploy to Staging
      run: |
        # Deploy to staging environment
        echo "Deploying to staging..."

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v4
    
    - name: Download build artifacts
      uses: actions/download-artifact@v4
      with:
        name: build-files
        path: dist/
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
    
    - name: Build and push Docker image
      env:
        DOCKER_REGISTRY: ${{ secrets.DOCKER_REGISTRY }}
        IMAGE_TAG: ${{ github.sha }}
      run: |
        docker build -t $DOCKER_REGISTRY/travelmate-frontend:$IMAGE_TAG .
        docker push $DOCKER_REGISTRY/travelmate-frontend:$IMAGE_TAG
```

### Performance Optimization

#### Build Optimization
```typescript
// vite.config.ts - Production optimizations
export default defineConfig({
  plugins: [react()],
  
  build: {
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['react-bootstrap', 'bootstrap'],
          utils: ['axios', 'framer-motion'],
          charts: ['recharts']
        }
      }
    },
    
    // Asset optimization
    assetsInlineLimit: 4096, // 4kb
    cssCodeSplit: true,
    sourcemap: false, // Disable in production for security
    
    // Compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  
  // Preview server configuration
  preview: {
    port: 3000,
    strictPort: true,
    host: '0.0.0.0'
  }
});
```

### Monitoring & Analytics

#### Error Tracking Setup
```typescript
// Error monitoring with Sentry
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.VITE_APP_ENV,
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: [
        'localhost',
        /^https:\/\/api\.travelmate\.com\/api/
      ]
    })
  ],
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0
});

// Performance monitoring
const performanceMonitor = {
  trackPageLoad: (pageName: string) => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const loadTime = navigation.loadEventEnd - navigation.fetchStart;
    
    analytics.track('page_load', {
      page: pageName,
      loadTime,
      timestamp: new Date().toISOString()
    });
  },
  
  trackUserInteraction: (action: string, element: string) => {
    analytics.track('user_interaction', {
      action,
      element,
      timestamp: new Date().toISOString()
    });
  }
};
```

### Production Checklist

#### Pre-Deployment Checklist
- [ ] **Environment Variables**: All production environment variables configured
- [ ] **API Endpoints**: Backend URLs updated for production
- [ ] **Security Headers**: CSP, CORS, and security headers configured
- [ ] **SSL/TLS**: HTTPS certificates installed and configured
- [ ] **CDN**: Static assets configured with CDN
- [ ] **Caching**: Browser and server-side caching optimized
- [ ] **Error Handling**: Error boundaries and logging configured
- [ ] **Performance**: Bundle size optimized, code splitting implemented
- [ ] **Accessibility**: WCAG compliance verified
- [ ] **SEO**: Meta tags, sitemap, and robots.txt configured
- [ ] **Analytics**: User analytics and error tracking configured
- [ ] **Backup**: Deployment rollback strategy prepared

#### Post-Deployment Verification
```bash
# Health check script
#!/bin/bash
echo "Performing post-deployment health checks..."

# Check application availability
curl -f https://travelmate.com/health || exit 1

# Check critical user flows
curl -f https://travelmate.com/login || exit 1
curl -f https://travelmate.com/admin/home || exit 1
curl -f https://travelmate.com/partner/home || exit 1

# Check static assets loading
curl -f https://travelmate.com/assets/index.js || exit 1
curl -f https://travelmate.com/assets/index.css || exit 1

# Performance check
LOAD_TIME=$(curl -o /dev/null -s -w '%{time_total}' https://travelmate.com)
if (( $(echo "$LOAD_TIME > 3.0" | bc -l) )); then
  echo "Warning: Page load time is ${LOAD_TIME}s (>3s)"
  exit 1
fi

echo "All health checks passed!"
```

## 🤝 Contributing & Development Guidelines

### Development Workflow

#### Git Branch Strategy
```bash
# Branch naming conventions
main           # Production-ready code
staging        # Staging environment
develop        # Integration branch
feature/xyz    # New features
bugfix/xyz     # Bug fixes
hotfix/xyz     # Emergency production fixes
release/x.y.z  # Release preparation
```

#### Commit Message Standards
Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
# Commit message format
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]

# Examples
feat(auth): add OAuth2 integration with Google
fix(ui): resolve mobile navigation overlay issue
docs(readme): update installation instructions
refactor(api): extract user service into separate module
test(auth): add unit tests for login flow
chore(deps): update React to version 19.0.0
```

#### Pull Request Process
1. **Create Feature Branch**
   ```bash
   git checkout -b feature/user-authentication
   git push -u origin feature/user-authentication
   ```

2. **Development Standards**
   - Write TypeScript with strict type checking
   - Follow ESLint configuration rules
   - Add unit tests for new features
   - Update documentation for API changes
   - Ensure responsive design compliance

3. **Pre-PR Checklist**
   ```bash
   # Run all checks before creating PR
   npm run lint           # ESLint validation
   npm run type-check     # TypeScript compilation
   npm run test           # Unit tests
   npm run build          # Production build test
   ```

4. **PR Template**
   ```markdown
   ## Description
   Brief description of changes and motivation

   ## Type of Change
   - [ ] Bug fix (non-breaking change which fixes an issue)
   - [ ] New feature (non-breaking change which adds functionality)
   - [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
   - [ ] Documentation update

   ## Testing
   - [ ] Unit tests pass
   - [ ] Integration tests pass
   - [ ] Manual testing completed

   ## Screenshots (if applicable)
   [Add screenshots for UI changes]

   ## Checklist
   - [ ] My code follows the project's style guidelines
   - [ ] I have performed a self-review of my own code
   - [ ] I have commented my code, particularly in hard-to-understand areas
   - [ ] I have made corresponding changes to the documentation
   - [ ] My changes generate no new warnings
   ```

### Code Quality Standards

#### TypeScript Configuration
```typescript
// Strict TypeScript configuration
interface CodeStandards {
  // Use strict type checking
  noImplicitAny: true;
  strictNullChecks: true;
  strictFunctionTypes: true;
  
  // Interface naming convention
  interfacePrefix: 'I' | 'none'; // Prefer none
  
  // Component conventions
  componentType: 'FunctionComponent'; // Use FC<Props>
  exportType: 'default' | 'named';   // Prefer named exports
  
  // File naming
  components: 'PascalCase';    // UserProfile.tsx
  utilities: 'camelCase';      // formatDate.ts
  constants: 'UPPER_SNAKE';    // API_ENDPOINTS.ts
  types: 'PascalCase';         // User.ts
}

// Example of well-typed component
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  isLoading?: boolean;
  className?: string;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  isLoading = false,
  className
}) => {
  // Component implementation
};
```

#### ESLint Configuration
```javascript
// .eslintrc.cjs
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', '@typescript-eslint', 'jsx-a11y'],
  rules: {
    // React specific rules
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    
    // TypeScript rules
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    
    // Code quality rules
    'prefer-const': 'error',
    'no-var': 'error',
    'no-console': 'warn',
    'no-debugger': 'error',
    
    // Accessibility rules
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/aria-role': 'error',
    'jsx-a11y/no-autofocus': 'warn'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
```

### Testing Strategy

#### Unit Testing Setup
```typescript
// Testing utilities
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';

// Test wrapper for components that need context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

// Custom render function
const renderWithProviders = (ui: React.ReactElement, options = {}) => {
  return render(ui, { wrapper: TestWrapper, ...options });
};

// Example test file: UserCard.test.tsx
describe('UserCard Component', () => {
  const mockUser: User = {
    _id: '1',
    fullName: 'John Doe',
    email: 'john@example.com',
    role: 'partner'
  };

  it('renders user information correctly', () => {
    renderWithProviders(<UserCard user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const mockOnEdit = jest.fn();
    renderWithProviders(
      <UserCard user={mockUser} onEdit={mockOnEdit} />
    );
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    
    await waitFor(() => {
      expect(mockOnEdit).toHaveBeenCalledWith(mockUser);
    });
  });

  it('shows loading state when isLoading is true', () => {
    renderWithProviders(<UserCard user={mockUser} isLoading />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
```

#### Integration Testing
```typescript
// API integration tests
describe('Auth Service Integration', () => {
  beforeAll(async () => {
    // Setup test database
    await setupTestDB();
  });

  afterAll(async () => {
    // Cleanup test database
    await cleanupTestDB();
  });

  it('should login user successfully', async () => {
    const credentials = {
      username: 'testuser@example.com',
      password: 'TestPassword123!'
    };

    const response = await authService.login(credentials);

    expect(response.account).toBeDefined();
    expect(response.account.role).toBe('partner');
    expect(response.user).toBeDefined();
  });

  it('should handle invalid credentials', async () => {
    const invalidCredentials = {
      username: 'invalid@example.com',
      password: 'wrongpassword'
    };

    await expect(authService.login(invalidCredentials))
      .rejects
      .toThrow('Invalid credentials');
  });
});
```

### Documentation Standards

#### Component Documentation
```typescript
/**
 * UserCard Component
 * 
 * Displays user information in a card format with optional edit/delete actions.
 * 
 * @example
 * ```tsx
 * <UserCard
 *   user={user}
 *   onEdit={(user) => handleEdit(user)}
 *   onDelete={(id) => handleDelete(id)}
 * />
 * ```
 */
interface UserCardProps {
  /** User object containing all user information */
  user: User;
  
  /** Callback function called when edit button is clicked */
  onEdit?: (user: User) => void;
  
  /** Callback function called when delete button is clicked */
  onDelete?: (userId: string) => void;
  
  /** Shows loading spinner when true */
  isLoading?: boolean;
  
  /** Additional CSS classes */
  className?: string;
}

export const UserCard: React.FC<UserCardProps> = (props) => {
  // Implementation
};
```

#### API Documentation
```typescript
/**
 * Authentication Service
 * 
 * Handles all authentication-related API calls including login, logout,
 * token refresh, and password recovery.
 */
class AuthService {
  /**
   * Authenticates user with email and password
   * 
   * @param credentials - User login credentials
   * @param credentials.username - User email address
   * @param credentials.password - User password
   * @returns Promise resolving to authentication response
   * 
   * @throws {AuthError} When credentials are invalid
   * @throws {NetworkError} When request fails
   * 
   * @example
   * ```typescript
   * try {
   *   const response = await authService.login({
   *     username: 'user@example.com',
   *     password: 'password123'
   *   });
   *   console.log('Logged in as:', response.account.username);
   * } catch (error) {
   *   console.error('Login failed:', error.message);
   * }
   * ```
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Implementation
  }
}
```

### Performance Guidelines

#### Component Optimization
```typescript
// Performance optimization techniques

// 1. Memoization for expensive calculations
const ExpensiveComponent: React.FC<Props> = ({ data, filters }) => {
  const filteredData = useMemo(() => {
    return data.filter(item => 
      filters.every(filter => filter.test(item))
    );
  }, [data, filters]);

  return <DataGrid data={filteredData} />;
};

// 2. Callback memoization
const ParentComponent: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  const handleItemDelete = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  return (
    <div>
      {items.map(item => (
        <ItemCard
          key={item.id}
          item={item}
          onDelete={handleItemDelete}
        />
      ))}
    </div>
  );
};

// 3. Component memoization
const ItemCard = React.memo<ItemCardProps>(({ item, onDelete }) => {
  return (
    <div>
      <h3>{item.title}</h3>
      <button onClick={() => onDelete(item.id)}>Delete</button>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.updatedAt === nextProps.item.updatedAt
  );
});
```

### Security Guidelines

#### Secure Coding Practices
```typescript
// Input validation and sanitization
const validateAndSanitizeInput = (input: string, type: 'email' | 'text' | 'html'): string => {
  // Remove dangerous characters
  let sanitized = input.trim();
  
  switch (type) {
    case 'email':
      sanitized = sanitized.toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized)) {
        throw new Error('Invalid email format');
      }
      break;
      
    case 'html':
      sanitized = DOMPurify.sanitize(sanitized, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em'],
        ALLOWED_ATTR: []
      });
      break;
      
    default:
      sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  
  return sanitized;
};

// Secure API calls
const secureApiCall = async (endpoint: string, data?: any) => {
  const token = getAuthToken();
  
  const response = await fetch(endpoint, {
    method: data ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Requested-With': 'XMLHttpRequest' // CSRF protection
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'same-origin' // Include cookies for same-origin requests only
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  
  return response.json();
};
```

## 📞 Contact & Support

### Development Team
- **Lead Developer**: [Nhatthach2703](https://github.com/Nhatthach2703)
- **Project Repository**: [https://github.com/Nhatthach2703/Travelmate-FE-Web](https://github.com/Nhatthach2703/Travelmate-FE-Web)
- **Documentation**: Available in `/docs` directory and inline code comments

### Business Contact
- **Facebook Page**: [Travelmate Official](https://www.facebook.com/profile.php?id=61577574491711)
- **Business Email**: contact@travelmate.com (if available)
- **Support Portal**: Available through admin dashboard

### Technical Support

#### Issue Reporting
For bug reports and feature requests, please use the GitHub Issues system:

1. **Bug Reports**
   ```markdown
   **Bug Description**
   A clear and concise description of what the bug is.

   **To Reproduce**
   Steps to reproduce the behavior:
   1. Go to '...'
   2. Click on '....'
   3. Scroll down to '....'
   4. See error

   **Expected Behavior**
   A clear and concise description of what you expected to happen.

   **Screenshots**
   If applicable, add screenshots to help explain your problem.

   **Environment:**
   - OS: [e.g. Windows 11, macOS 12.0]
   - Browser [e.g. Chrome 95, Safari 15]
   - Device: [e.g. Desktop, iPhone 12]
   - Version [e.g. 1.0.0]

   **Additional Context**
   Add any other context about the problem here.
   ```

2. **Feature Requests**
   ```markdown
   **Feature Description**
   A clear and concise description of what you want to happen.

   **Use Case**
   Describe the use case or problem this feature would solve.

   **Proposed Solution**
   A clear and concise description of what you want to happen.

   **Alternatives Considered**
   A clear and concise description of any alternative solutions or features you've considered.

   **Additional Context**
   Add any other context or screenshots about the feature request here.
   ```

#### Development Questions
For technical questions and development support:

- **Stack Overflow**: Tag questions with `travelmate` and `react`
- **GitHub Discussions**: Use the project's GitHub Discussions for community support
- **Email**: technical-support@travelmate.com (if available)

### Community Guidelines

#### Code of Conduct
We are committed to providing a welcoming and inspiring community for all participants. 

**Our Standards:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable Behavior:**
- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

#### Contributing Guidelines
1. **Be Respectful**: Treat all contributors with respect and professionalism
2. **Clear Communication**: Use clear, concise language in issues and pull requests
3. **Documentation**: Always update documentation when making changes
4. **Testing**: Include tests for new features and bug fixes
5. **Code Quality**: Follow the established coding standards and style guides

### Getting Help

#### Documentation Resources
- **API Documentation**: `/docs/api.md`
- **Component Guide**: `/docs/components.md`
- **Deployment Guide**: `/docs/deployment.md`
- **Troubleshooting**: `/docs/troubleshooting.md`

#### Common Issues & Solutions

**Build Issues:**
```bash
# Clear cache and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

**Type Errors:**
```bash
# Run type checking
npm run type-check

# Update TypeScript types
npm update @types/react @types/react-dom
```

**Performance Issues:**
```bash
# Analyze bundle size
npm run build:analyze

# Check for memory leaks
npm run dev -- --profile
```

#### Frequently Asked Questions

**Q: How do I add a new page to the application?**
A: Create a new component in `/src/pages`, add the route in `/src/routers/routes.tsx`, and ensure proper authentication guards are in place.

**Q: How do I customize the UI theme?**
A: Modify the CSS variables in `/src/index.css` and update the Bootstrap theme variables in `/src/App.css`.

**Q: How do I add new API endpoints?**
A: Add the service function in the appropriate service file in `/src/services`, update the TypeScript types in `/src/types`, and create corresponding React hooks if needed.

**Q: How do I handle file uploads?**
A: Use the existing file upload utilities in `/src/utils` and follow the security guidelines for file validation and sanitization.

**Q: How do I add internationalization support for new languages?**
A: Add translation files in `/src/locales`, update the language configuration in `/src/configs/i18n.ts`, and use the `useTranslation` hook in components.

### License & Legal

#### Open Source License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Copyright (c) 2025 Nhatthach2703 & Travelmate Team**

#### Third-Party Licenses
The project uses various open-source libraries. See `package.json` for a complete list of dependencies and their respective licenses.

#### Privacy & Data Protection
- **Data Handling**: All user data is handled in accordance with GDPR regulations
- **Cookies**: The application uses cookies for authentication and user preferences
- **Analytics**: Anonymous usage analytics may be collected to improve the application
- **Security**: All security vulnerabilities should be reported privately to security@travelmate.com

### Acknowledgments

#### Special Thanks
- **React Team**: For providing an excellent framework for building user interfaces
- **TypeScript Team**: For bringing type safety to JavaScript development
- **Vite Team**: For creating a fast and efficient build tool
- **Bootstrap Team**: For the comprehensive UI component library
- **Open Source Community**: For the countless libraries and tools that make this project possible

#### Contributors
- [Nhatthach2703](https://github.com/Nhatthach2703) - Lead Developer & Project Maintainer

#### Inspiration
This project was inspired by the need for a comprehensive travel management platform that brings together travelers, local guides, and service providers in a unified ecosystem.

---

## 🔄 Project Roadmap & Changelog

### Current Version: 0.1.0 (Development)

#### ✅ Completed Features
- **Authentication System**: Multi-role login with JWT tokens
- **Admin Dashboard**: User management and analytics
- **Partner Portal**: Profile and content management
- **Responsive Design**: Mobile-first responsive interface
- **Internationalization**: Multi-language support (EN/VI)
- **Docker Support**: Containerized deployment
- **Security**: Input validation and XSS protection

#### 🔄 In Progress
- **Real-time Features**: WebSocket integration for live updates
- **Advanced Search**: Enhanced search and filtering capabilities
- **Mobile App Integration**: Deep linking with mobile applications
- **Payment System**: Integrated payment processing
- **Social Features**: Enhanced social networking capabilities

#### 📋 Upcoming Features (Roadmap)

**Version 0.2.0 - Q2 2025**
- [ ] Real-time chat system between users and partners
- [ ] Advanced analytics dashboard with custom reports
- [ ] Email notification system
- [ ] Mobile app deep linking
- [ ] Enhanced file management system

**Version 0.3.0 - Q3 2025**
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Travel booking system
- [ ] Review and rating system
- [ ] Social media integration
- [ ] Progressive Web App (PWA) features

**Version 1.0.0 - Q4 2025**
- [ ] Full feature completeness
- [ ] Performance optimization
- [ ] Comprehensive testing coverage
- [ ] Production-ready deployment
- [ ] Complete documentation

#### 🐛 Known Issues
- [ ] File upload progress indicator needs improvement
- [ ] Mobile navigation occasionally overlaps content
- [ ] Image gallery loading optimization needed
- [ ] Form validation messages need better positioning

#### 🔧 Technical Debt
- [ ] Migrate from React Context to Zustand for state management
- [ ] Implement service worker for offline functionality
- [ ] Add comprehensive error boundary coverage
- [ ] Optimize bundle splitting for better performance
- [ ] Improve accessibility compliance to WCAG 2.1 AAA

---

*This README serves as the comprehensive documentation for the Travelmate Frontend Web Application. For the most up-to-date information, please refer to the [official repository](https://github.com/Nhatthach2703/Travelmate-FE-Web) and project documentation.*

**Last Updated**: August 30, 2025  
**Version**: 0.1.0  
**Maintainer**: [Nhatthach2703](https://github.com/Nhatthach2703)
