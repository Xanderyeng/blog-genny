-- Insert default admin user
INSERT INTO "users" (
  "id", 
  "name", 
  "email", 
  "role", 
  "tier", 
  "createdAt", 
  "updatedAt"
) VALUES (
  'admin-001',
  'Blog Admin',
  'admin@blog-genny.com',
  'admin',
  'premium',
  now(),
  now()
) ON CONFLICT ("email") DO NOTHING;

-- Insert default topics
INSERT INTO "topics" ("id", "name", "slug") VALUES
  ('topic-tech', 'Technology', 'technology'),
  ('topic-ai', 'Artificial Intelligence', 'artificial-intelligence'),
  ('topic-web', 'Web Development', 'web-development'),
  ('topic-design', 'Design', 'design'),
  ('topic-business', 'Business', 'business'),
  ('topic-lifestyle', 'Lifestyle', 'lifestyle')
ON CONFLICT ("slug") DO NOTHING;
