-- Clean up testimonials table to ensure only the requested ones exist
TRUNCATE TABLE public.testimonials_la2024 RESTART IDENTITY;

-- Re-insert only the 4 specific Nigerian testimonials
INSERT INTO public.testimonials_la2024 (name, title, company, content, rating, image_url, is_featured, is_published, created_at)
VALUES 
(
  'Chioma Adebayo',
  'CEO',
  'TechVision Solutions',
  'Lillian transformed my leadership approach completely. Her clarity and insight helped me navigate complex challenges and achieve results I never thought possible. She truly is the Queen of Clarity!',
  5,
  '/images/testimonials/chioma.png',
  true,
  true,
  '2024-01-15T10:00:00Z'
),
(
  'Tunde Bakare',
  'Executive Director',
  'Global Impact Foundation',
  'Working with Lillian was a game-changer for our organization. Her strategic guidance and fearless approach to problem-solving helped us scale our impact by 300% in just one year.',
  5,
  '/images/testimonials/tunde.png',
  true,
  true,
  '2024-01-12T10:00:00Z'
),
(
  'Dr. Ngozi Eze',
  'Founder',
  'MedInnovate',
  'Lillian''s coaching gave me the confidence to launch my healthcare startup. Her authentic approach and powerful insights helped me become the leader I always knew I could be.',
  5,
  '/images/testimonials/ngozi.png',
  false,
  true,
  '2024-01-10T10:00:00Z'
),
(
  'Emeka Okafor',
  'VP of Operations',
  'Fortune 500 Company',
  'The transformation I experienced through Lillian''s coaching was profound. She helped me find my authentic leadership voice and achieve sustainable positive change in both my career and personal life.',
  5,
  '/images/testimonials/emeka.png',
  false,
  true,
  '2024-01-08T10:00:00Z'
);
