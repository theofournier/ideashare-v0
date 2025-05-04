-- Seed tags
INSERT INTO tags (name, color)
VALUES 
  ('Web', 'bg-blue-500'),
  ('Mobile', 'bg-green-500'),
  ('AI', 'bg-purple-500'),
  ('API', 'bg-yellow-500'),
  ('Game', 'bg-red-500'),
  ('Productivity', 'bg-pink-500'),
  ('Education', 'bg-indigo-500'),
  ('Social', 'bg-orange-500')
ON CONFLICT (name) DO UPDATE
SET color = EXCLUDED.color;

-- Sample ideas (these will only be inserted if you want sample data)
-- Uncomment the following section if you want to seed sample ideas

/*
-- First, create a sample user if it doesn't exist
DO $$
DECLARE
  sample_user_id UUID;
BEGIN
  -- Check if the sample user exists
  SELECT id INTO sample_user_id FROM auth.users WHERE email = 'sample@example.com' LIMIT 1;
  
  -- If the sample user doesn't exist, create one
  IF sample_user_id IS NULL THEN
    -- This is a placeholder. In practice, you would create users through Supabase Auth API
    -- This is just to ensure the foreign key constraint is satisfied
    sample_user_id := '00000000-0000-0000-0000-000000000000'::UUID;
  END IF;

  -- Insert sample ideas
  INSERT INTO ideas (
    title, 
    short_description, 
    full_description, 
    tech_stack, 
    difficulty, 
    image_url, 
    user_id
  )
  VALUES 
    (
      'AI-Powered Code Reviewer',
      'An AI tool that reviews code and suggests improvements.',
      '# AI-Powered Code Reviewer
      
      This tool would use machine learning to analyze code repositories and provide actionable feedback to developers. It would:
      
      - Identify potential bugs and security vulnerabilities
      - Suggest performance optimizations
      - Check for adherence to coding standards
      - Recommend modern alternatives to deprecated methods
      
      The system could integrate with GitHub, GitLab, and other version control platforms to provide feedback during pull requests.',
      ARRAY['Python', 'TensorFlow', 'GitHub API', 'Docker'],
      'Advanced',
      '/placeholder.svg?height=200&width=300',
      sample_user_id
    ),
    (
      'Habit Tracker with Social Accountability',
      'Track habits and share progress with friends for accountability.',
      '# Habit Tracker with Social Accountability
      
      A mobile app that helps users build positive habits by combining tracking with social accountability:
      
      - Set daily, weekly, or monthly habit goals
      - Track streaks and progress over time
      - Connect with friends to share goals and progress
      - Receive notifications and reminders
      - Earn achievements and compete on leaderboards
      
      The social aspect would provide motivation and accountability that many habit trackers lack.',
      ARRAY['React Native', 'Firebase', 'Redux', 'Node.js'],
      'Intermediate',
      '/placeholder.svg?height=200&width=300',
      sample_user_id
    ),
    (
      'Collaborative Markdown Editor',
      'Real-time collaborative markdown editor with preview.',
      '# Collaborative Markdown Editor
      
      A web-based markdown editor that allows multiple users to edit documents simultaneously:
      
      - Real-time collaboration with cursor positions
      - Live preview of rendered markdown
      - Version history and change tracking
      - Export to PDF, HTML, and other formats
      - Custom themes and syntax highlighting
      
      Think Google Docs but specifically optimized for markdown with developer-friendly features.',
      ARRAY['React', 'WebSockets', 'Express', 'MongoDB'],
      'Intermediate',
      '/placeholder.svg?height=200&width=300',
      sample_user_id
    );

  -- Link ideas to tags
  WITH idea_data AS (
    SELECT id FROM ideas WHERE title = 'AI-Powered Code Reviewer' LIMIT 1
  ),
  tag_data AS (
    SELECT id FROM tags WHERE name IN ('AI', 'Web', 'API')
  )
  INSERT INTO idea_tags (idea_id, tag_id)
  SELECT idea_data.id, tag_data.id
  FROM idea_data, tag_data
  ON CONFLICT DO NOTHING;

  WITH idea_data AS (
    SELECT id FROM ideas WHERE title = 'Habit Tracker with Social Accountability' LIMIT 1
  ),
  tag_data AS (
    SELECT id FROM tags WHERE name IN ('Mobile', 'Productivity', 'Social')
  )
  INSERT INTO idea_tags (idea_id, tag_id)
  SELECT idea_data.id, tag_data.id
  FROM idea_data, tag_data
  ON CONFLICT DO NOTHING;

  WITH idea_data AS (
    SELECT id FROM ideas WHERE title = 'Collaborative Markdown Editor' LIMIT 1
  ),
  tag_data AS (
    SELECT id FROM tags WHERE name IN ('Web', 'API', 'Productivity')
  )
  INSERT INTO idea_tags (idea_id, tag_id)
  SELECT idea_data.id, tag_data.id
  FROM idea_data, tag_data
  ON CONFLICT DO NOTHING;
END $$;
*/
