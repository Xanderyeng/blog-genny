# Monetization Strategy: Advertisements

This document outlines the strategy for integrating advertisements as a revenue stream from free users while maintaining an ad-free experience for premium subscribers.

---

## 1. Core Concept

The system will conditionally display ads based on the user's subscription status, which is stored in the `users` table as the `tier` property (`'free'` or `'premium'`).

*   **Free Users:** Will see advertisements strategically placed throughout the application.
*   **Premium Users:** Will have an entirely ad-free experience. The components that would normally display ads will render nothing, ensuring a clean and seamless UI.

---

## 2. Technical Implementation

This approach centers around creating a reusable wrapper component that handles the display logic.

#### Step 1: Choose an Ad Network
First, you would sign up for an ad network like **Google AdSense**, which is the most common choice. They will provide you with a script to add to your site and code snippets for individual ad units.

#### Step 2: Create a Centralized `AdSlot` Component
To avoid duplicating logic, you would create a single, smart component responsible for rendering ads.

**File:** `components/ad-slot.tsx`

```tsx
'use client';

import { useSession } from 'next-auth/react';

// Define the props for the AdSlot, which would match the
// properties required by your ad network (e.g., Google AdSense).
interface AdSlotProps {
  slotId: string;
  format?: string; // e.g., 'auto', 'rectangle', 'vertical'
  style?: React.CSSProperties;
}

export function AdSlot({ slotId, format = 'auto', style }: AdSlotProps) {
  const { data: session } = useSession();

  // 1. Check user's tier. If they are premium, render nothing.
  if (session?.user?.tier === 'premium') {
    return null;
  }

  // 2. In a real implementation, you might also check if the ad script has loaded
  //    or if an ad blocker is active, but for now, we just check the tier.

  // 3. If the user is a guest (not logged in) or a free user, render the ad.
  //    This is a simplified example of a Google AdSense ad unit.
  return (
    <div className="ad-container" style={style}>
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-YOUR_CLIENT_ID"
           data-ad-slot={slotId}
           data-ad-format={format}
           data-full-width-responsive="true"></ins>
      {/* You would run the ad script via a useEffect hook here */}
    </div>
  );
}
```

#### Step 3: Place the `AdSlot` Component in the UI
With the `AdSlot` component created, you can now place it wherever you want ads to appear. The component itself handles the logic of whether to show an ad or not.

---

## 3. Ad Placement & User Experience

Strategic placement is key to maximizing revenue without frustrating users.

### For a Free User:

A free user's journey would include ads in the following places:

1.  **Blog Feed Page (`/blog`):**
    *   **How it looks:** An ad unit, styled to look similar to an `ArticleCard`, would be interspersed with the actual articles. For example, you could render an `<AdSlot>` after every 4th article in the list.
    *   **Experience:** This is a common pattern on content-heavy sites. It's noticeable but generally not considered overly intrusive.

2.  **Article Page (`/blog/[slug]`):**
    *   **How it looks:**
        *   **Top Banner Ad:** A horizontal banner `<AdSlot>` placed directly below the article title and before the main content begins.
        *   **In-Content Ad:** An `<AdSlot>` placed after the 3rd or 4th paragraph of the article content. This requires more complex logic to inject the component into the rendered MDX.
        *   **Sidebar Ad:** If your layout includes a sidebar, a vertical "skyscraper" `<AdSlot>` would be placed there.
    *   **Experience:** This is where ads are most prominent. The goal is to make them visible without breaking the flow of reading.

3.  **Persistent Prompts:**
    *   **How it looks:** Small banners or buttons with text like "Enjoying the content? Go ad-free with Premium!" would be placed near ad slots or in the site's header/footer.
    *   **Experience:** Constant, non-intrusive reminders of the benefits of upgrading.

### For a Premium User:

A premium user's journey is defined by the absence of these elements.

1.  **Blog Feed Page (`/blog`):**
    *   **How it looks:** A clean, uninterrupted grid or list of `ArticleCard`s. The `<AdSlot>` components would render `null`, so the space they would have occupied collapses entirely.
    *   **Experience:** Seamless and content-focused.

2.  **Article Page (`/blog/[slug]`):**
    *   **How it looks:** No ads. The content is presented without interruption from top to bottom.
    *   **Experience:** A premium, focused reading experience that justifies the subscription cost.

This dual-pronged approach aligns user benefits with business goals: free users provide ad revenue while being constantly encouraged to upgrade, and premium users get the superior experience they paid for.