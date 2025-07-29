# 🕌 Taha - Islamic Authentication Module

A comprehensive React authentication system with Arabic RTL support, Islamic theming, and modern UX patterns built with TypeScript, Tailwind CSS, and shadcn/ui components.

<div dir="rtl">

## نظرة عامة

مشروع طه هو نظام مصادقة شامل مصمم خصيصاً للتطبيقات الإسلامية، يدعم اللغة العربية بتخطيط من اليمين إلى اليسار (RTL) مع تصميم إسلامي أنيق ومتطور.

</div>

## ✨ Features

### 🔐 Authentication Flows

- **Sign In** - تسجيل الدخول
- **Sign Up** - إنشاء حساب جديد
- **Forgot Password** - استرداد كلمة المرور
- **Reset Password** - إعادة تعيين كلمة المرور
- **Email Verification** - تحقق البريد الإلكتروني
- **404 Not Found** - صفحة غير موجودة

### 🎨 Design & UX

- **RTL (Right-to-Left)** Arabic layout support
- **Islamic theming** with Quranic verses and cultural sensitivity
- **Modern responsive design** using Tailwind CSS
- **Accessibility-first** approach with ARIA labels
- **Professional animations** and transitions
- **Dark/Light mode** support

### 🛡️ Security & Validation

- **Comprehensive form validation** using Zod schemas
- **Password complexity requirements**
- **Email format validation**
- **Real-time form feedback**
- **Secure token-based flows**

### 🚀 Advanced UX Features

- **Auto-focus** and **auto-submit** for verification codes
- **Paste support** for 6-digit verification codes
- **Show/hide password** toggles
- **Resend cooldown** timers (60 seconds)
- **Loading states** with disabled form fields
- **Success/error notifications** using Sonner

## 🏗️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS 4.x, shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router DOM v7
- **Notifications**: Sonner
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm

## 📁 Project Structure

```
src/
├── modules/
│   └── auth/
│       ├── components/           # Form components
│       │   ├── sign-in-form.tsx
│       │   ├── sign-up-form.tsx
│       │   ├── forgot-password-form.tsx
│       │   ├── reset-password-form.tsx
│       │   ├── verify-email-form.tsx
│       │   └── index.ts
│       ├── pages/               # Page components
│       │   ├── sign-in/
│       │   ├── sign-up/
│       │   ├── forgot-password/
│       │   ├── reset-password/
│       │   ├── verify-email/
│       │   ├── not-found/
│       │   └── index.ts
│       ├── schemas/             # Zod validation schemas
│       │   ├── sign-in-schema.ts
│       │   ├── sign-up-schema.ts
│       │   ├── forgot-password-schema.ts
│       │   ├── reset-password-schema.ts
│       │   ├── verify-email-schema.ts
│       │   └── index.ts
│       ├── api/                 # API simulation layer
│       │   └── index.ts
│       ├── layout/              # Auth layout component
│       │   └── index.tsx
│       └── index.ts             # Module exports
├── components/ui/               # shadcn/ui components
├── lib/                        # Utility functions
├── constants/                  # App constants
└── assets/                     # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd taha
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
npm run preview
```

## 🎯 Usage Examples

### Basic Authentication Setup

```tsx
import { AuthLayout, SignIn, SignUp } from "@/modules/auth";

// In your router configuration
<Route path="/auth" element={<AuthLayout />}>
  <Route path="sign-in" element={<SignIn />} />
  <Route path="sign-up" element={<SignUp />} />
  <Route path="forgot-password" element={<ForgotPassword />} />
  <Route path="reset-password" element={<ResetPassword />} />
  <Route path="verify-email" element={<VerifyEmail />} />
  <Route path="*" element={<AuthNotFound />} />
</Route>;
```

### Form Validation Schemas

```tsx
import { signUpSchema } from "@/modules/auth/schemas";

// The schema includes comprehensive validation:
// - Name validation (Arabic & English)
// - Email format validation
// - Password complexity requirements
// - Terms acceptance validation
// - Confirmation field matching
```

### API Integration

```tsx
import { simulateSignUpApi } from "@/modules/auth/api";

// Example API usage (replace with real API calls)
const result = await simulateSignUpApi({
  firstName: "أحمد",
  lastName: "محمد",
  email: "ahmed@example.com",
  password: "SecurePass123!",
  acceptTerms: true,
});
```

## 🎨 Customization

### Theming

The project uses Tailwind CSS with custom Arabic fonts and RTL support. You can customize:

- **Colors**: Update your `tailwind.config.js`
- **Typography**: Modify font families for Arabic text
- **Spacing**: Adjust RTL-specific spacing
- **Islamic Quotes**: Update Quranic verses in form components

### Validation Messages

All validation messages are in Arabic and can be customized in the schema files:

```typescript
// Example: src/modules/auth/schemas/sign-up-schema.ts
email: z.string().email({
  message: "يرجى إدخال عنوان بريد إلكتروني صالح",
});
```

## 🌐 Internationalization

The project is built with Arabic-first approach but can be extended to support multiple languages:

- RTL layout support is built-in
- All text strings are extracted and ready for i18n
- Islamic cultural elements are preserved across languages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow the established patterns in the codebase
- Use TypeScript for type safety
- Follow Arabic RTL design principles
- Include Islamic theming elements
- Write accessible code with ARIA labels

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

<div dir="rtl">

- **القرآن الكريم** - لآياته المباركة المستخدمة في التطبيق
- **الأحاديث النبوية الشريفة** - للحديث المستخدم في واجهات المستخدم
- **المجتمع الإسلامي** - للإلهام والتوجيه في التصميم الإسلامي

</div>

- **shadcn/ui** - For the beautiful UI components
- **Tailwind CSS** - For the utility-first CSS framework
- **React Hook Form** - For efficient form handling
- **Zod** - For schema validation

## 📞 Support

For support and questions:

- 📧 Email: [your-email@example.com]
- 🐛 Issues: [GitHub Issues](link-to-issues)
- 💬 Discussions: [GitHub Discussions](link-to-discussions)

---

<div align="center" dir="rtl">

**بسم الله نبدأ وعلى الله نتوكل**

_"وَقُل رَّبِّ زِدْنِي عِلْمًا"_

</div>
