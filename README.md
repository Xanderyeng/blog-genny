# Blog Genny - AI-Powered Blog Generator

An AI-powered blog generation platform built with Next.js, featuring clean design and intuitive blog management.

## Features

- 🤖 **AI Blog Generation**: Generate detailed, SEO-friendly blog posts using Google's Gemini AI
- 📝 **MDX Support**: Full MDX support for rich content creation
- 🔍 **Search Functionality**: Search through blog posts by title, content, and tags
- 🎨 **Modern UI**: Clean, responsive design with dark/light theme support
- 📱 **Mobile Friendly**: Fully responsive across all devices

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd blog-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then add your Gemini API key to `.env.local`:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

### Generate a Blog Post

1. Click the "Generate Post" button in the navigation
2. Enter a topic for your blog post (e.g., "The Future of Artificial Intelligence")
3. Optionally add specific instructions (e.g., "Focus on practical examples")
4. Click "Generate Blog Post" and wait for the AI to create your content
5. You'll be automatically redirected to your new blog post

### Search Blog Posts

1. Click the "Search" button in the navigation
2. Enter keywords to search through titles, descriptions, tags, and content
3. Browse the filtered results

## Project Structure

```
blog-generator/
├── app/
│   ├── actions/
│   │   └── generateBlog.ts     # Server action for AI blog generation
│   ├── api/
│   │   └── posts/
│   │       └── route.ts        # API endpoint for fetching posts
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx        # Dynamic blog post pages
│   ├── generate/
│   │   └── page.tsx           # Blog generation form
│   ├── search/
│   │   └── page.tsx           # Search functionality
│   └── page.tsx               # Homepage
├── components/
│   ├── ui/                    # Reusable UI components
│   ├── blog-card.tsx          # Blog post card component
│   ├── header.tsx             # Navigation header
│   └── footer.tsx             # Site footer
├── content/
│   └── blog/                  # Generated MDX blog posts
└── lib/
    ├── mdx.ts                 # MDX processing utilities
    └── utils.ts               # General utilities
```

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **AI**: Google Gemini AI for content generation
- **Content**: MDX for blog post format
- **TypeScript**: Full type safety
- **Icons**: Lucide React

## Getting a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your `.env.local` file

## Deployment

The easiest way to deploy your blog generator is to use the [Vercel Platform](https://vercel.com):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `GEMINI_API_KEY` environment variable in Vercel settings
4. Deploy!

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Google Gemini AI](https://ai.google.dev/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
