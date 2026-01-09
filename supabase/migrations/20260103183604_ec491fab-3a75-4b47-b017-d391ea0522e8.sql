-- Create profiles table for AAC users (children, parents, therapists)
CREATE TABLE public.aac_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  pin_code TEXT, -- 4-digit PIN for parent/therapist mode
  is_therapist BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create custom symbols table
CREATE TABLE public.aac_custom_symbols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.aac_profiles(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '📷',
  category TEXT NOT NULL DEFAULT 'home',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create favorite sentences table
CREATE TABLE public.aac_favorite_sentences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.aac_profiles(id) ON DELETE CASCADE NOT NULL,
  symbols JSONB NOT NULL, -- Array of symbol objects
  label TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create learning progress table
CREATE TABLE public.aac_learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.aac_profiles(id) ON DELETE CASCADE NOT NULL,
  symbol_id TEXT NOT NULL, -- References symbol id from aacSymbols
  correct_count INTEGER NOT NULL DEFAULT 0,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  last_played_at TIMESTAMP WITH TIME ZONE,
  mastery_level INTEGER DEFAULT 0, -- 0-5 mastery level
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(profile_id, symbol_id)
);

-- Create profile sharing table (for therapist-parent sharing)
CREATE TABLE public.aac_profile_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.aac_profiles(id) ON DELETE CASCADE NOT NULL,
  shared_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  share_code TEXT NOT NULL UNIQUE, -- 6-character sharing code
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.aac_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aac_custom_symbols ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aac_favorite_sentences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aac_learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aac_profile_shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies for aac_profiles
CREATE POLICY "Users can view their own profiles"
ON public.aac_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profiles"
ON public.aac_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profiles"
ON public.aac_profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profiles"
ON public.aac_profiles FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for aac_custom_symbols
CREATE POLICY "Users can view symbols of their profiles"
ON public.aac_custom_symbols FOR SELECT
USING (
  profile_id IN (SELECT id FROM public.aac_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can create symbols for their profiles"
ON public.aac_custom_symbols FOR INSERT
WITH CHECK (
  profile_id IN (SELECT id FROM public.aac_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update symbols of their profiles"
ON public.aac_custom_symbols FOR UPDATE
USING (
  profile_id IN (SELECT id FROM public.aac_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can delete symbols of their profiles"
ON public.aac_custom_symbols FOR DELETE
USING (
  profile_id IN (SELECT id FROM public.aac_profiles WHERE user_id = auth.uid())
);

-- RLS Policies for aac_favorite_sentences
CREATE POLICY "Users can view sentences of their profiles"
ON public.aac_favorite_sentences FOR SELECT
USING (
  profile_id IN (SELECT id FROM public.aac_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can create sentences for their profiles"
ON public.aac_favorite_sentences FOR INSERT
WITH CHECK (
  profile_id IN (SELECT id FROM public.aac_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can delete sentences of their profiles"
ON public.aac_favorite_sentences FOR DELETE
USING (
  profile_id IN (SELECT id FROM public.aac_profiles WHERE user_id = auth.uid())
);

-- RLS Policies for aac_learning_progress
CREATE POLICY "Users can view progress of their profiles"
ON public.aac_learning_progress FOR SELECT
USING (
  profile_id IN (SELECT id FROM public.aac_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can manage progress for their profiles"
ON public.aac_learning_progress FOR ALL
USING (
  profile_id IN (SELECT id FROM public.aac_profiles WHERE user_id = auth.uid())
);

-- RLS Policies for aac_profile_shares
CREATE POLICY "Users can view shares they created"
ON public.aac_profile_shares FOR SELECT
USING (shared_by = auth.uid());

CREATE POLICY "Users can create shares for their profiles"
ON public.aac_profile_shares FOR INSERT
WITH CHECK (
  shared_by = auth.uid() AND
  profile_id IN (SELECT id FROM public.aac_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can delete their shares"
ON public.aac_profile_shares FOR DELETE
USING (shared_by = auth.uid());

-- Anyone can view shares by code (for importing)
CREATE POLICY "Anyone can view shares by code"
ON public.aac_profile_shares FOR SELECT
USING (expires_at > now());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_aac_profiles_updated_at
BEFORE UPDATE ON public.aac_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_aac_learning_progress_updated_at
BEFORE UPDATE ON public.aac_learning_progress
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Generate share code function
CREATE OR REPLACE FUNCTION public.generate_share_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql SET search_path = public;