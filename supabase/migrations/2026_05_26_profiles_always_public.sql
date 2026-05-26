-- All profiles are public — remove the ability to go private
UPDATE profiles SET is_public = true WHERE is_public = false OR is_public IS NULL;
