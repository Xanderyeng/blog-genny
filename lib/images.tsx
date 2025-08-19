/**
 * Finds a hero image from Unsplash based on an article title.
 * @param articleTitle The title of the article.
 * @returns An object with the image URL and attribution details, or null if not found.
 */
export async function findHeroImage(articleTitle: string): Promise<{ imageUrl: string; attribution: string } | null> {
  // 1. Extract keywords from the title
  const keywords = articleTitle.split(" ").slice(0, 4).join(" ")
  const query = encodeURIComponent(keywords)

  // 2. Construct the API URL
  const API_URL = `https://api.unsplash.com/search/photos?query=${query}&orientation=landscape&per_page=1`

  try {
    // 3. Fetch data from the Unsplash API
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    })

    if (!response.ok) {
      console.error("Unsplash API Error:", response.status, response.statusText)
      return null
    }

    const data = await response.json()

    // 4. Process the result
    if (data.results && data.results.length > 0) {
      const topImage = data.results[0]
      const imageUrl = topImage.urls.regular
      const photographerName = topImage.user.name
      const photographerUrl = topImage.user.links.html

      const attribution = `Photo by <a href="${photographerUrl}" target="_blank" rel="noopener noreferrer">${photographerName}</a> on <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">Unsplash</a>`

      return { imageUrl, attribution }
    }

    return null // No image found for the query
  } catch (error) {
    console.error("Failed to fetch from Unsplash API:", error)
    return null
  }
}
