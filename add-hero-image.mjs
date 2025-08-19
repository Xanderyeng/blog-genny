import { findHeroImage } from './lib/images.tsx';
import fs from 'fs';
import path from 'path';

async function addHeroImageToArticle(filePath) {
  try {
    // Read the current file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract the title from the frontmatter
    const titleMatch = content.match(/title:\s*"([^"]+)"/);
    if (!titleMatch) {
      console.error('Could not extract title from article');
      return;
    }
    
    const title = titleMatch[1];
    console.log(`Finding hero image for: "${title}"`);
    
    // Find a hero image
    const heroImageData = await findHeroImage(title);
    
    if (!heroImageData) {
      console.log('No hero image found');
      return;
    }
    
    console.log(`Found hero image: ${heroImageData.imageUrl}`);
    
    // Check if the article already has hero image fields
    if (content.includes('heroImage:') || content.includes('coverImage:')) {
      console.log('Article already has a hero image');
      return;
    }
    
    // Add hero image fields to the frontmatter
    const frontmatterEnd = content.indexOf('---', 3);
    if (frontmatterEnd === -1) {
      console.error('Could not find end of frontmatter');
      return;
    }
    
    const beforeFrontmatterEnd = content.substring(0, frontmatterEnd);
    const afterFrontmatterEnd = content.substring(frontmatterEnd);
    
    const heroImageFields = `heroImage: "${heroImageData.imageUrl}"
heroImageAttribution: "${heroImageData.attribution}"
`;
    
    const updatedContent = beforeFrontmatterEnd + heroImageFields + afterFrontmatterEnd;
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    
    console.log('Successfully added hero image to article!');
    console.log(`Hero Image URL: ${heroImageData.imageUrl}`);
    console.log(`Attribution: ${heroImageData.attribution}`);
    
  } catch (error) {
    console.error('Error adding hero image:', error);
  }
}

// Run the script for the most recent article
const articlePath = path.join(process.cwd(), 'content/blog/topic-free-tools-to-track-coding-time-in-vscode-ad-1755612183473.mdx');
addHeroImageToArticle(articlePath);
