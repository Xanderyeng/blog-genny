# Hero Image Strategy: Unsplash API

This document provides a detailed plan for implementing an automated system to source high-quality hero images for articles using the Unsplash API.

---

## 1. Overview

To provide visually appealing articles, each post should have a relevant hero image. Instead of manual uploads or complex AI generation, this strategy leverages the **Unsplash API**. It allows us to programmatically search a vast library of professional, royalty-free photos and automatically assign the most relevant one to a newly created article.

**Key Benefits:**
*   **Cost-Effective:** The Unsplash API is completely free for this use case.
*   **High Quality:** Access to a curated library of high-resolution, professional photographs.
*   **Automation:** The process is fully automated, requiring no manual intervention after setup.
*   **Simplicity:** The implementation is straightforward and reliable.

---

## 2. Implementation Flow

The logic will be handled by a server-side function that is triggered after a new article is successfully generated and its initial draft is saved to the database.

Here is the step-by-step process:

1.  **Trigger:** The process begins immediately after a new article record is created in the `articles` table.

2.  **Keyword Extraction:** The function takes the `title` of the new article (e.g., "The Rise of Quantum Computing") and extracts the most relevant keywords. A simple method is to use the first 3-4 words.

3.  **Construct API Request:** It constructs a `GET` request to the Unsplash API's search endpoint (`/search/photos`). The request must include:
    *   `query`: The extracted keywords (e.g., `Quantum Computing`).
    *   `orientation`: Set to `landscape` to get images suitable for hero banners.
    *   `per_page`: Set to `1` to be efficient and only retrieve the top result.

4.  **Authorize and Send Request:** The request is sent with an `Authorization` header containing your Unsplash API Access Key.

5.  **Process the Response:** The API returns a JSON object. The code will parse this response to find the first search result located in the `results` array.

6.  **Extract Image URL:** From the first result object (`results[0]`), we will extract the image URL. The `urls.regular` property is recommended as it provides a great balance of image quality and file size (~1080px wide).

7.  **Extract Attribution Data:** To comply with Unsplash's terms, we must also extract the photographer's name (`user.name`) and a link to their profile (`user.links.html`). This data should be stored alongside the `coverImageUrl` or retrieved whenever the image is displayed.

8.  **Update the Database:** The function executes a database query to `UPDATE` the newly created article record, setting the `coverImageUrl` (and attribution data) for that post.

---

## 3. API Usage and Guidelines

Proper use of the Unsplash API is required.

*   **Getting Access:**
    1.  Go to the [Unsplash Developer Portal](https://unsplash.com/developers).
    2.  Create an account and register a new application.
    3.  You will be provided with an **Access Key** and a **Secret Key**. The Access Key is what you'll use for the `Authorization` header.

*   **Attribution (Required):**
    Unsplash API guidelines require you to credit the photographer. When you display a hero image, you must include a credit line similar to this:

    > Photo by [Photographer's Name](link-to-photographer-profile) on [Unsplash](https://unsplash.com)

    This can be a small caption under the hero image.

---

## 4. Example Implementation (Conceptual)

Here is a conceptual TypeScript function demonstrating the flow. This would live in a file like `lib/images.ts`.

```typescript
// lib/images.ts

/**
 * Finds a hero image from Unsplash based on an article title.
 * @param articleTitle The title of the article.
 * @returns An object with the image URL and attribution details, or null if not found.
 */
export async function findHeroImage(articleTitle: string): Promise<{ imageUrl: string; attribution: string; } | null> {
  // 1. Extract keywords from the title
  const keywords = articleTitle.split(' ').slice(0, 4).join(' ');
  const query = encodeURIComponent(keywords);

  // 2. Construct the API URL
  const API_URL = `https://api.unsplash.com/search/photos?query=${query}&orientation=landscape&per_page=1`;

  try {
    // 3. Fetch data from the Unsplash API
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (!response.ok) {
      console.error('Unsplash API Error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();

    // 4. Process the result
    if (data.results && data.results.length > 0) {
      const topImage = data.results[0];
      const imageUrl = topImage.urls.regular;
      const photographerName = topImage.user.name;
      const photographerUrl = topImage.user.links.html;

      const attribution = `Photo by <a href="${photographerUrl}" target="_blank">${photographerName}</a> on <a href="https://unsplash.com" target="_blank">Unsplash</a>`;

      return { imageUrl, attribution };
    }

    return null; // No image found for the query

  } catch (error) {
    console.error('Failed to fetch from Unsplash API:', error);
    return null;
  }
}

// --- How you would use it ---
/*
  // After creating an article...
  const imageDetails = await findHeroImage(newArticle.title);

  if (imageDetails) {
    // Update the article in the database with the image URL and attribution
    await db.update(articles).set({
      coverImageUrl: imageDetails.imageUrl,
      coverImageAttribution: imageDetails.attribution
    }).where(eq(articles.id, newArticle.id));
  }
*/
```

This strategy provides a robust and free solution for enhancing your articles with high-quality hero images.