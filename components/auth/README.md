# Authentication Components Documentation

This directory contains modular, reusable authentication components that follow DRY principles.

## Components

### Core Components

#### `AuthCard`
A wrapper component for authentication forms that provides consistent styling and error handling.

```tsx
<AuthCard 
  title="Sign In" 
  description="Enter your credentials"
  error={error}
>
  {/* Form content */}
</AuthCard>
```

#### `FormField`
A reusable form field wrapper that includes label and proper spacing.

```tsx
<FormField label="Email" htmlFor="email">
  <Input id="email" type="email" {...props} />
</FormField>
```

#### `PasswordInput`
A password input with built-in visibility toggle functionality.

```tsx
<PasswordInput
  id="password"
  value={password}
  onChange={setPassword}
  required
  disabled={loading}
  minLength={6}
/>
```

#### `PasswordInputWithValidation`
An enhanced password input with real-time validation and requirement checking.

```tsx
<PasswordInputWithValidation
  id="password"
  value={password}
  onChange={setPassword}
  showRequirements={true}
  requirements={customRequirements}
/>
```

#### `AuthDivider`
A visual divider for separating different authentication methods.

```tsx
<AuthDivider />
{/* Renders "Or continue with" divider */}
```

#### `OAuthProviders`
A collection of OAuth provider buttons with hover tooltips and clean design.

```tsx
<OAuthProviders disabled={loading} />
```

Features:
- Circular icon buttons with brand colors
- Hover tooltips showing provider names
- Configurable enabled/disabled providers
- Consistent styling and animations
- Accessibility support

### Form Components

#### `SignInForm`
Refactored to use the modular components above. Handles email/password authentication and Google OAuth.

#### `SignUpForm`
Refactored to use the modular components above. Handles user registration with validation.

## Benefits of Refactoring

1. **DRY Principle**: Eliminated duplicate code between forms
2. **Consistency**: Ensures uniform styling and behavior across auth forms
3. **Maintainability**: Changes to auth UI can be made in one place
4. **Reusability**: Components can be easily used in other parts of the app
5. **Testability**: Individual components can be tested in isolation
6. **Accessibility**: Consistent accessibility features across all forms

## Usage Example

```tsx
import { AuthCard, FormField, PasswordInput } from "@/components/auth"

function CustomAuthForm() {
  return (
    <AuthCard title="Custom Form" description="Example usage">
      <form>
        <FormField label="Username" htmlFor="username">
          <Input id="username" />
        </FormField>
        
        <FormField label="Password" htmlFor="password">
          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
          />
        </FormField>
      </form>
    </AuthCard>
  )
}
```

## File Structure

```
components/auth/
├── index.ts                          # Export all components
├── auth-card.tsx                     # Wrapper card component
├── form-field.tsx                    # Form field wrapper
├── password-input.tsx                # Basic password input with toggle
├── password-input-with-validation.tsx # Enhanced password input
├── auth-divider.tsx                  # "Or continue with" divider
├── oauth-providers.tsx               # OAuth provider buttons
├── signin-form.tsx                   # Refactored sign-in form
├── signup-form.tsx                   # Refactored sign-up form
└── README.md                         # This documentation
```
