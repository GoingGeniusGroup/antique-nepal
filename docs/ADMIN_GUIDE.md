# Admin Panel Developer Guide

## 📁 Project Structure

```
app/admin/                    # Admin routes
├── layout.tsx               # Admin layout with sidebar
├── loading.tsx              # Simple loading component
├── page.tsx                 # Dashboard with stats
├── users/page.tsx           # User management
├── orders/page.tsx          # Order management  
├── products/page.tsx        # Product management
└── settings/page.tsx        # Site settings

components/admin/             # Admin components
├── hero-table.tsx           # Reusable data table
├── page-header.tsx          # Page title + breadcrumbs
└── sidebar.tsx              # Navigation sidebar

lib/
├── admin-utils.ts           # Shared utility functions
└── utils.ts                 # General utilities

app/api/admin/               # Admin API routes
├── users/route.ts           # User CRUD operations
├── orders/route.ts          # Order management
├── products/route.ts        # Product management
└── site-settings/route.ts   # Site configuration
```

## 🛠️ Key Components

### HeroTable Component
**Location**: `components/admin/hero-table.tsx`

A fully-featured data table with:
- Search, sort, and pagination
- CRUD operation callbacks
- Loading and error states
- Responsive design

```tsx
<HeroTable<User>
  title="Users"
  fetchUrl="/api/admin/users"
  columns={userColumns}
  onAdd={handleAddUser}
  onEdit={handleEditUser}
  onDelete={handleDeleteUser}
/>
```

### PageHeader Component
**Location**: `components/admin/page-header.tsx`

Displays page title with automatic breadcrumb generation:

```tsx
<PageHeader title="Users" />
// Renders: Users with breadcrumb: admin / users
```

### AdminSidebar Component
**Location**: `components/admin/sidebar.tsx`

Collapsible sidebar with:
- Aceternity UI integration
- Keyboard shortcuts (Ctrl/Cmd+B)
- Active page highlighting
- User avatar at bottom

## 🔧 Utility Functions

### Status Colors
**Location**: `lib/admin-utils.ts`

Consistent color schemes across the admin:

```tsx
import { getStatusColor } from '@/lib/admin-utils';

// Usage
<span className={getStatusColor('order', 'pending')}>
  Pending
</span>
```

Available types:
- `order`: pending, processing, confirmed, shipped, delivered, cancelled
- `payment`: paid, pending, failed, refunded
- `role`: admin, customer
- `active`: true, false

### Formatting Functions

```tsx
import { formatCurrency, formatDate, formatDateTime } from '@/lib/admin-utils';

formatCurrency(2500)           // "NPR 2,500.00"
formatDate("2024-01-15")       // "Jan 15, 2024"
formatDateTime("2024-01-15")   // "Jan 15, 2024, 2:30 PM"
```

### Validation Functions

```tsx
import { isValidEmail, isValidPhone } from '@/lib/admin-utils';

isValidEmail("user@example.com")     // true
isValidPhone("+977-9841234567")      // true (Nepal format)
```

## 📊 API Integration

All admin APIs follow consistent patterns:

### Request Format
```
GET /api/admin/users?page=1&pageSize=10&sort=createdAt&order=desc&q=search
```

### Response Format
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "pageSize": 10
}
```

### Error Handling
```tsx
import { handleApiError } from '@/lib/admin-utils';

try {
  const response = await fetch('/api/admin/users');
  // ... handle success
} catch (error) {
  const message = handleApiError(error);
  // Display user-friendly error message
}
```

## 🎨 Styling Guidelines

### Color Scheme
- **Primary**: Blue (`bg-blue-600`, `text-blue-600`)
- **Success**: Green (`bg-green-600`, `text-green-600`)
- **Warning**: Yellow (`bg-yellow-600`, `text-yellow-600`)
- **Error**: Red (`bg-red-600`, `text-red-600`)
- **Neutral**: Gray (`bg-gray-600`, `text-gray-600`)

### Status Badges
Always use utility functions for consistent styling:

```tsx
// ✅ Good
<span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor('order', status)}`}>
  {status}
</span>

// ❌ Avoid hardcoding colors
<span className="bg-green-100 text-green-800">
  {status}
</span>
```

## 🔄 Adding New Admin Pages

1. **Create the page component**:
```tsx
// app/admin/new-feature/page.tsx
"use client";

import { PageHeader } from "@/components/admin/page-header";
import { HeroTable } from "@/components/admin/hero-table";

export default function NewFeaturePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="New Feature" />
      {/* Your content */}
    </div>
  );
}
```

2. **Add to sidebar navigation**:
```tsx
// components/admin/sidebar.tsx
const LINKS = [
  // ... existing links
  { href: "/admin/new-feature", label: "New Feature", icon: <Icon className="text-white h-5 w-5 flex-shrink-0" /> },
];
```

3. **Create API route** (if needed):
```tsx
// app/api/admin/new-feature/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Implementation
}
```

## 🧪 Testing Guidelines

### Component Testing
- Test CRUD operations with mock data
- Verify error states and loading states
- Test responsive behavior
- Check accessibility (ARIA labels, keyboard navigation)

### API Testing
- Test pagination, sorting, and filtering
- Verify error handling
- Test data validation
- Check authentication/authorization

## 🚀 Performance Tips

1. **Use debounced search** (already implemented in HeroTable)
2. **Implement proper loading states** for better UX
3. **Use React.memo** for expensive components
4. **Optimize API queries** with proper indexing

## 🔒 Security Considerations

1. **Always validate user permissions** before showing admin content
2. **Sanitize user inputs** in forms
3. **Use CSRF protection** for state-changing operations
4. **Implement rate limiting** on API endpoints

## 📝 Code Style

### TypeScript
- Use proper interfaces for all data types
- Avoid `any` type - use proper typing
- Document complex functions with JSDoc

### React
- Use functional components with hooks
- Implement proper error boundaries
- Use descriptive component and prop names

### Comments
- Document complex business logic
- Explain non-obvious code decisions
- Keep comments up-to-date with code changes

## 🐛 Common Issues & Solutions

### "Table not loading data"
1. Check API endpoint is correct
2. Verify data structure matches expected format
3. Check network tab for API errors
4. Ensure proper error handling

### "Styles not applying"
1. Check Tailwind class names are correct
2. Verify utility functions are imported
3. Check for CSS specificity issues
4. Ensure global styles are loaded

### "Search not working"
1. Verify debounced search is implemented
2. Check API supports search parameter
3. Test with different search terms
4. Check for encoding issues

## 🤝 Contributing

1. **Follow the established patterns** in existing code
2. **Add comprehensive comments** for complex logic
3. **Test your changes** thoroughly
4. **Update documentation** when adding new features
5. **Use the utility functions** instead of duplicating code

## 📞 Need Help?

- Check existing components for similar patterns
- Review the utility functions in `lib/admin-utils.ts`
- Look at API route implementations for data handling
- Test with the dummy data seeding script

---

**Happy coding! 🎉**
