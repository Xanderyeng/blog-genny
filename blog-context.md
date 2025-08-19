# Project Context: AI-Powered Blog Generator

This document provides a comprehensive overview of the project, its current status, and the full scope of planned features.

---

## 1. Project Overview

The core goal of this project is to build a sophisticated, AI-powered blogging platform. The development is phased to start with a simple, manually-triggered content generation system and evolve into a fully automated, monetizable platform with community features. The technology stack includes Next.js 15, Tailwind CSS, Shadcn/UI, Drizzle ORM, PostgreSQL, and the Gemini AI API.

---

## 2. Current Status: Phase 1 Complete

As of now, the foundational prototype of the application is complete and functional. Here is a summary of what has been implemented:

*   **Project Foundation:**
    *   A Next.js 15 project with the App Router is set up.
    *   Tailwind CSS and Shadcn/UI are installed and configured for styling and UI components.

*   **Content & Rendering:**
    *   The project is configured to use MDX for blog post content.
    *   Articles are stored as individual `.mdx` files within the `content/blog/` directory.

*   **Core Pages & Layouts:**
    *   A main layout with a `Header` and `Footer` has been created.
    *   The `/blog` page successfully reads all `.mdx` files from the content directory and displays a list of available articles.
    *   A dynamic route, `/blog/[slug]`, renders the content of individual MDX files based on their filename.

*   **AI Content Generation:**
    *   An admin-facing page exists at `/generate`.
    *   This page contains a simple form with a button that triggers the AI generation process.
    *   When the button is clicked, a server-side action or API route sends a prompt to the Gemini AI API.
    *   The generated markdown content from the AI is then saved as a new `.mdx` file in the `content/blog/` directory.

**In summary, the current system allows an admin to manually generate AI-written blog posts and have them automatically appear on the site.**

---

## 3. Full Project Scope & Future Phases

This section outlines the planned evolution of the platform from its current state to the final vision.

### Phase 2: Database & Persistence

*   **Goal:** Replace the file-based MDX system with a robust PostgreSQL database managed by Drizzle ORM.
*   **Key Features:**
    *   All articles will be stored in a database.
    *   Generated articles will be saved as `drafts`.
    *   An admin dashboard will be created to review, approve (publish), or reject drafts.
    *   Email notifications will be sent to the admin when a new draft is ready for review.

### Phase 3: User Accounts & Profiles

*   **Goal:** Introduce multi-user capabilities with authentication and personalization.
*   **Key Features:**
    *   Users can register and log in using OAuth (Google, Microsoft, GitHub) or standard email and password.
    *   Email verification will be required for new credential-based accounts.
    *   Users will have profiles and a settings page to manage their information.
    *   A personalization system will allow users to follow specific topics, tailoring their content feed.

### Phase 4: Monetization & Tiers

*   **Goal:** Introduce a subscription model to monetize the platform.
*   **Key Features:**
    *   Integration with Stripe to manage free and premium subscription tiers.
    *   Feature gating: Premium users will get exclusive benefits like unlimited profile edits, theme customization, and early access to new features.
    *   The UI will show locked features and prompts to encourage free users to upgrade.

### Phase 5: Advanced AI & Automations

*   **Goal:** Fully automate the content pipeline and enrich the user experience.
*   **Key Features:**
    *   Scheduled, automated content generation using cron jobs (e.g., daily or weekly prompts).
    *   AI-powered generation of SEO metadata (titles, descriptions) and article cover images.
    *   Community features, including a comments system and likes/reactions on posts.

---

## 4. Detailed User Onboarding Flow

Based on the project requirements, the following flow will be implemented for new and unauthenticated users:

1.  **Guest User Experience:** A visitor who is not logged in can view a maximum of **two** free articles.
2.  **Registration Prompt:** Upon attempting to view a third article, a **Shadcn/UI dialog modal** will appear, requiring them to create an account to continue.
3.  **Account Creation:** The user will have the following sign-up options:
    *   **OAuth:** Google, Microsoft, GitHub.
    *   **Credentials:** Email and Password.
4.  **Email Verification:** If a user signs up with an email and password, a confirmation link will be sent to their email address. They must click this link to verify their account before they can log in.
5.  **Plan Selection:** After successful registration and verification, the user will be directed to a page where they can choose their plan: the default **Free Tier** or the paid **Premium Tier**.
