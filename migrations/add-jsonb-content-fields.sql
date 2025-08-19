-- Migration: Add JSONB fields to articles table for enhanced content management

-- Add JSONB columns for structured content and metadata
ALTER TABLE articles 
ADD COLUMN content_blocks JSONB,
ADD COLUMN content_metadata JSONB;

-- Create indexes for JSONB fields
CREATE INDEX idx_articles_content_blocks_gin ON articles USING GIN (content_blocks);
CREATE INDEX idx_articles_content_metadata_gin ON articles USING GIN (content_metadata);

-- Example of content_blocks structure:
-- {
--   "blocks": [
--     {
--       "type": "paragraph",
--       "content": "Text content here...",
--       "id": "block-1"
--     },
--     {
--       "type": "heading",
--       "level": 2,
--       "content": "Section Title",
--       "id": "block-2"
--     },
--     {
--       "type": "code",
--       "language": "javascript",
--       "content": "const example = 'code';",
--       "id": "block-3"
--     },
--     {
--       "type": "image",
--       "src": "https://example.com/image.jpg",
--       "alt": "Image description",
--       "caption": "Image caption",
--       "id": "block-4"
--     }
--   ]
-- }

-- Example of content_metadata structure:
-- {
--   "readingTime": 5,
--   "wordCount": 1200,
--   "estimatedReadingMinutes": 5,
--   "tocItems": [
--     {"level": 2, "title": "Introduction", "anchor": "introduction"},
--     {"level": 2, "title": "Getting Started", "anchor": "getting-started"}
--   ],
--   "stats": {
--     "paragraphs": 15,
--     "codeBlocks": 3,
--     "images": 2,
--     "links": 8
--   },
--   "seo": {
--     "primaryKeywords": ["javascript", "tutorial", "beginner"],
--     "secondaryKeywords": ["programming", "web development"]
--   }
-- }

-- Useful queries with JSONB:

-- Find articles with specific content types
-- SELECT * FROM articles WHERE content_blocks->'blocks' @> '[{"type": "code"}]';

-- Search within content blocks
-- SELECT * FROM articles WHERE content_blocks @@ '$.blocks[*].content ? (@ like_regex "javascript" flag "i")';

-- Get articles by reading time
-- SELECT * FROM articles WHERE (content_metadata->>'readingTime')::int BETWEEN 3 AND 10;

-- Find articles with specific TOC structure
-- SELECT * FROM articles WHERE content_metadata->'tocItems' @> '[{"level": 2}]';
