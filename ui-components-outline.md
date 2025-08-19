# UI Component Outline

This document provides a detailed breakdown of all the UI components required throughout the project's five phases. For each component, its purpose, key properties, and the recommended Shadcn/UI primitives are listed.

---

## Phase 1: Foundation & Core UI

These are the essential components needed for the initial prototype.

#### 1. `Header`
*   **Description:** The main site navigation bar. It will contain the logo, navigation links, a theme toggle, and a placeholder for the future user authentication button.
*   **Shadcn/UI Primitives:** `Button` for links and actions.
*   **Props/State:** `navItems` (an array of navigation links).

#### 2. `Footer`
*   **Description:** The site-wide footer. Contains copyright information, links to social media, and other secondary links.
*   **Shadcn/UI Primitives:** `Button` (variant: "link") for links.

#### 3. `ThemeToggle`
*   **Description:** A button or dropdown that allows users to switch between light and dark modes.
*   **Shadcn/UI Primitives:** `Button`, `DropdownMenu`.
*   **State:** Manages the current theme (`light`, `dark`, `system`).

#### 4. `ArticleCard`
*   **Description:** A card used on the main blog page to display a preview of an article, including its title, a brief summary, and potentially tags or a publication date.
*   **Shadcn/UI Primitives:** `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `Badge`.
*   **Props/State:** `article` (an object containing article metadata like title, slug, summary).

#### 5. `ArticleLayout`
*   **Description:** A layout component that wraps the rendered MDX content on a single article page. It ensures consistent typography, spacing, and styling for all blog posts.
*   **Shadcn/UI Primitives:** N/A (Primarily uses Tailwind CSS typography styles).

#### 6. `GenerateArticleForm`
*   **Description:** The form on the `/generate` page for an admin to create a new article. It includes a text area for the prompt and a submit button.
*   **Shadcn/UI Primitives:** `Textarea`, `Button`, `Label`.
*   **Props/State:** `isLoading` (to show a loading state on the button during AI generation).

#### 7. `Toaster` (Sonner)
*   **Description:** A global component to display toast notifications for actions like successful article generation or errors.
*   **Shadcn/UI Primitives:** `Sonner`.

---

## Phase 2: Admin & Database UI

Components for the admin dashboard and content review flow.

#### 1. `AdminDashboardLayout`
*   **Description:** A dedicated layout for all admin-facing pages, potentially including a sidebar for navigation between different admin sections.
*   **Shadcn/UI Primitives:** `Resizable` (for a sidebar), `Button`.

#### 2. `DraftArticleTable`
*   **Description:** A data table that lists all articles with a `draft` status. Columns would include Title, Author, Creation Date, and Action buttons.
*   **Shadcn/UI Primitives:** `Table`, `TableHeader`, `TableRow`, `TableHead`, `TableBody`, `TableCell`, `Button`, `Badge`.
*   **Props/State:** `drafts` (an array of draft article objects).

#### 3. `StatusBadge`
*   **Description:** A small, colored badge to visually indicate the status of an article (`Draft`, `Published`, `Archived`).
*   **Shadcn/UI Primitives:** `Badge` (with color variants).
*   **Props/State:** `status` (the article status string).

---

## Phase 3: User Authentication & Profiles

Components for user registration, login, and profile management.

#### 1. `UserAuthForm`
*   **Description:** A versatile form used for both login and registration. It can include tabs to switch between sign-in and sign-up, fields for email/password, and buttons for OAuth providers.
*   **Shadcn/UI Primitives:** `Card`, `Tabs`, `Input`, `Button`, `Label`.
*   **Props/State:** `isLoading`, `formType` (`login` or `register`).

#### 2. `LoginDialog`
*   **Description:** The modal that appears to guest users after they have viewed their allotted number of free articles. It will house the `UserAuthForm`.
*   **Shadcn/UI Primitives:** `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`.
*   **Props/State:** `isOpen` (controls the visibility of the modal).

#### 3. `UserNavDropdown`
*   **Description:** Replaces the login button in the `Header` once a user is authenticated. It displays the user's avatar and provides dropdown links to their profile, settings, and a logout button.
*   **Shadcn/UI Primitives:** `DropdownMenu`, `Avatar`.
*   **Props/State:** `user` (the authenticated user object).

#### 4. `ProfileSettingsForm`
*   **Description:** A form within the user's settings page that allows them to update their profile information, such as their name and avatar.
*   **Shadcn/UI Primitives:** `Input`, `Button`, `Label`, `Avatar`.

#### 5. `TopicSelector`
*   **Description:** A component in the user settings to allow users to select their topics of interest. This could be a grid of selectable badges or a multi-select dropdown.
*   **Shadcn/UI Primitives:** `ToggleGroup`, `Checkbox`, `Multi-select`.
*   **Props/State:** `topics` (list of all available topics), `selectedTopics`.

---

## Phase 4: Monetization

Components related to subscriptions and feature gating.

#### 1. `PricingPage`
*   **Description:** A page displaying the different subscription tiers (e.g., Free vs. Premium) in a comparative layout.
*   **Shadcn/UI Primitives:** `Card`, `Button`.

#### 2. `SubscriptionTierCard`
*   **Description:** A card used on the `PricingPage` to detail the features of a specific subscription tier. It includes a list of features and a prominent call-to-action button.
*   **Shadcn/UI Primitives:** `Card`, `CardHeader`, `CardContent`, `CardFooter`, `Button`.
*   **Props/State:** `tier` (an object with tier details like price, features).

#### 3. `FeatureLockIcon`
*   **Description:** A small icon or badge placed next to premium features in the UI to indicate that they are unavailable to free users.
*   **Shadcn/UI Primitives:** `Badge` or a custom component with a lock icon.

#### 4. `ManageSubscriptionButton`
*   **Description:** A button in the user's settings page that redirects them to the Stripe customer portal to manage their subscription.
*   **Shadcn/UI Primitives:** `Button`.

---

## Phase 5: Community & Advanced AI

Components for user interaction and engagement.

#### 1. `CommentSection`
*   **Description:** The container below an article that holds the comment submission form and the list of all comments.
*   **Props/State:** `articleId`.

#### 2. `CommentForm`
*   **Description:** A form for authenticated users to write and submit a new comment.
*   **Shadcn/UI Primitives:** `Textarea`, `Button`, `Avatar` (to show the current user's avatar).
*   **Props/State:** `isLoading`.

#### 3. `CommentCard`
*   **Description:** A component to display a single comment, including the author's avatar, name, the comment text, and the timestamp. It should be designed to be nestable for threaded replies.
*   **Shadcn/UI Primitives:** `Avatar`.
*   **Props/State:** `comment` (the comment object).

#### 4. `LikeButton`
*   **Description:** An interactive button that allows users to like or unlike an article. It should visually change state (e.g., fill with color) when liked and display the total like count.
*   **Shadcn/UI Primitives:** `Button`.
*   **Props/State:** `articleId`, `initialLikeCount`, `isLiked`.
