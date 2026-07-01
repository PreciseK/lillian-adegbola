alter table public.profiles_la2024 
add column if not exists settings jsonb default '{
  "notifications": {
    "email": true,
    "push": true,
    "weeklyDigest": true
  },
  "privacy": {
    "profileVisibility": "public"
  },
  "appearance": {
    "darkMode": false
  }
}'::jsonb;
