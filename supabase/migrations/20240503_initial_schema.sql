-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  difficulty TEXT NOT NULL,
  image_url TEXT,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create idea_tags junction table
CREATE TABLE IF NOT EXISTS idea_tags (
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (idea_id, tag_id)
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  PRIMARY KEY (user_id, idea_id)
);

-- Create function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url, website)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'website'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to get votes count for an idea
CREATE OR REPLACE FUNCTION get_votes_count(idea_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM votes WHERE votes.idea_id = $1;
$$ LANGUAGE SQL STABLE;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Ideas policies
CREATE POLICY "Ideas are viewable by everyone" 
ON ideas FOR SELECT USING (true);

CREATE POLICY "Users can insert their own ideas" 
ON ideas FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ideas" 
ON ideas FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ideas" 
ON ideas FOR DELETE USING (auth.uid() = user_id);

-- Tags policies
CREATE POLICY "Tags are viewable by everyone" 
ON tags FOR SELECT USING (true);

-- Only allow admins to create/update/delete tags
CREATE POLICY "Only admins can insert tags" 
ON tags FOR INSERT WITH CHECK (auth.uid() IN (
  SELECT id FROM auth.users WHERE raw_user_meta_data->>'is_admin' = 'true'
));

CREATE POLICY "Only admins can update tags" 
ON tags FOR UPDATE USING (auth.uid() IN (
  SELECT id FROM auth.users WHERE raw_user_meta_data->>'is_admin' = 'true'
));

CREATE POLICY "Only admins can delete tags" 
ON tags FOR DELETE USING (auth.uid() IN (
  SELECT id FROM auth.users WHERE raw_user_meta_data->>'is_admin' = 'true'
));

-- Idea_tags policies
CREATE POLICY "Idea tags are viewable by everyone" 
ON idea_tags FOR SELECT USING (true);

CREATE POLICY "Users can manage tags for their own ideas" 
ON idea_tags USING (
  EXISTS (
    SELECT 1 FROM ideas 
    WHERE ideas.id = idea_tags.idea_id 
    AND ideas.user_id = auth.uid()
  )
);

-- Votes policies
CREATE POLICY "Votes are viewable by everyone" 
ON votes FOR SELECT USING (true);

CREATE POLICY "Users can insert their own votes" 
ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" 
ON votes FOR DELETE USING (auth.uid() = user_id);

-- Create view for ideas with votes count
CREATE OR REPLACE VIEW ideas_with_votes AS
SELECT 
  i.*,
  COALESCE(COUNT(v.idea_id), 0)::INTEGER AS votes_count
FROM 
  ideas i
LEFT JOIN 
  votes v ON i.id = v.idea_id
GROUP BY 
  i.id;
