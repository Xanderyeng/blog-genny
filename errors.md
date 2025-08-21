./app/actions/generateBlog.ts
38:11  Warning: 'currentDate' is assigned a value but never used.  @typescript-eslint/no-unused-vars

./app/admin/analytics/page.tsx
14:5  Warning: 'MessageSquare' is defined but never used.  @typescript-eslint/no-unused-vars
20:5  Warning: 'Loader2' is defined but never used.  @typescript-eslint/no-unused-vars

./app/admin/page.tsx
128:17  Error: Do not use an `<a>` element to navigate to `/admin/users/`. Use `<Link />` from `next/link` instead. See: https://nextjs.org/docs/messages/no-html-link-for-pages  @next/next/no-html-link-for-pages

./app/api/admin/users/stats/route.ts
6:10  Warning: 'sql' is defined but never used.  @typescript-eslint/no-unused-vars
8:27  Warning: 'request' is defined but never used.  @typescript-eslint/no-unused-vars

./app/api/admin/users/[id]/route.ts
40:13  Warning: 'password' is assigned a value but never used.  @typescript-eslint/no-unused-vars
120:13  Warning: 'password' is assigned a value but never used.  @typescript-eslint/no-unused-vars

./app/api/articles/route.ts
2:23  Warning: 'getArticleStats' is defined but never used.  @typescript-eslint/no-unused-vars

./app/api/articles/[id]/fix-content/route.ts
11:9  Error: 'fixed' is never reassigned. Use 'const' instead.  prefer-const
43:9  Error: 'processedContent' is never reassigned. Use 'const' instead.  prefer-const

./app/api/articles/[id]/route.ts
2:75  Warning: 'getArticleById' is defined but never used.  @typescript-eslint/no-unused-vars

./app/api/user/avatar/route.ts
39:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./app/api/user/notifications/route.ts
3:10  Warning: 'db' is defined but never used.  @typescript-eslint/no-unused-vars
4:10  Warning: 'users' is defined but never used.  @typescript-eslint/no-unused-vars
5:10  Warning: 'eq' is defined but never used.  @typescript-eslint/no-unused-vars
17:7  Warning: 'emailNotifications' is assigned a value but never used.  @typescript-eslint/no-unused-vars
18:7  Warning: 'pushNotifications' is assigned a value but never used.  @typescript-eslint/no-unused-vars
19:7  Warning: 'topicSubscriptions' is assigned a value but never used.  @typescript-eslint/no-unused-vars
20:7  Warning: 'soundEnabled' is assigned a value but never used.  @typescript-eslint/no-unused-vars

./app/api/user/profile/route.ts
18:7  Warning: 'bio' is assigned a value but never used.  @typescript-eslint/no-unused-vars
19:7  Warning: 'location' is assigned a value but never used.  @typescript-eslint/no-unused-vars
20:7  Warning: 'website' is assigned a value but never used.  @typescript-eslint/no-unused-vars
21:7  Warning: 'twitter' is assigned a value but never used.  @typescript-eslint/no-unused-vars
22:7  Warning: 'linkedin' is assigned a value but never used.  @typescript-eslint/no-unused-vars
23:7  Warning: 'github' is assigned a value but never used.  @typescript-eslint/no-unused-vars
24:7  Warning: 'instagram' is assigned a value but never used.  @typescript-eslint/no-unused-vars

./app/blog/[slug]/page.tsx
57:33  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

./app/search/page.tsx
98:122  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
98:135  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities

./components/admin/settings-content.tsx
11:10  Warning: 'Badge' is defined but never used.  @typescript-eslint/no-unused-vars
17:3  Warning: 'Mail' is defined but never used.  @typescript-eslint/no-unused-vars

./components/admin/users-stats.tsx
5:10  Warning: 'Badge' is defined but never used.  @typescript-eslint/no-unused-vars

./components/admin/users-table.tsx
39:3  Warning: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars

./components/article-content-enhanced.tsx
28:24  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
33:24  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
38:24  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
43:24  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
48:23  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
53:25  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
58:37  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
73:24  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
78:24  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
83:24  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
88:32  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
93:29  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
103:25  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
104:9  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
110:27  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
117:24  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
122:24  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./components/article-content.tsx
101:24  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
106:24  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
111:24  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
116:24  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
121:23  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
126:25  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
130:47  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
161:24  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
166:24  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
171:24  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
176:32  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
181:29  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
191:25  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
192:9  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
198:27  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
205:24  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
210:24  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./components/article-edit-form.tsx
82:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
104:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./components/article-generation-notification.tsx
41:6  Warning: React Hook useEffect has a missing dependency: 'handleAutoPublish'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps

./components/article-layout.tsx
45:11  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
92:58  Warning: 'props' is defined but never used.  @typescript-eslint/no-unused-vars
92:67  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./components/auth/signin-form.tsx
47:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./components/auth/signup-form.tsx
55:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./components/blog-card.tsx
30:11  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

./components/generate-article-form.tsx
25:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars

./components/premium-settings.tsx
15:15  Warning: 'SettingsIcon' is defined but never used.  @typescript-eslint/no-unused-vars

./components/settings/billing-settings.tsx
44:9  Warning: 'hasActiveSubscription' is assigned a value but never used.  @typescript-eslint/no-unused-vars
127:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
147:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./components/settings/notification-settings.tsx
18:3  Warning: 'Heart' is defined but never used.  @typescript-eslint/no-unused-vars
19:3  Warning: 'MessageSquare' is defined but never used.  @typescript-eslint/no-unused-vars
20:3  Warning: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
110:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./components/settings/profile-settings.tsx
16:3  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
81:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
113:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./components/settings/security-settings.tsx
53:9  Warning: 'isPremium' is assigned a value but never used.  @typescript-eslint/no-unused-vars
108:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
123:17  Warning: 'qrCode' is assigned a value but never used.  @typescript-eslint/no-unused-vars
123:25  Warning: 'secret' is assigned a value but never used.  @typescript-eslint/no-unused-vars
130:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
149:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
165:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./components/upgrade-plans.tsx
11:3  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
12:3  Warning: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
13:3  Warning: 'Headphones' is defined but never used.  @typescript-eslint/no-unused-vars
15:3  Warning: 'Shield' is defined but never used.  @typescript-eslint/no-unused-vars

./components/user-articles.tsx
90:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
110:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
222:64  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./components/user-nav.tsx
17:3  Warning: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars

./components/user-settings.tsx
68:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./lib/articles.ts
258:23  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./lib/auth.ts
6:17  Warning: 'accounts' is defined but never used.  @typescript-eslint/no-unused-vars
6:27  Warning: 'sessions' is defined but never used.  @typescript-eslint/no-unused-vars
6:37  Warning: 'verificationTokens' is defined but never used.  @typescript-eslint/no-unused-vars
12:34  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
19:36  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
82:39  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
82:49  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any