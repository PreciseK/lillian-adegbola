-- ============================================================
-- Fix RLS policies: replace permissive `using (true)` policies
-- with proper admin-role checks across all tables.
-- ============================================================

-- 1. Add role column to profiles if not already present
ALTER TABLE public.profiles_la2024
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user';

-- 2. Create SECURITY DEFINER helper to avoid RLS recursion
--    when policies call back into profiles_la2024.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles_la2024
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

-- ============================================================
-- 3. Patch all tables: drop every existing policy then
--    recreate with proper rules.
--    Uses a DO block so we don't need to know policy names.
-- ============================================================

DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN (
        'blog_posts_la2024',
        'testimonials_la2024',
        'resources_la2024',
        'bookings_la2024',
        'contact_messages_la2024',
        'newsletter_subscribers_la2024',
        'site_settings_la2024',
        'orders_la2024',
        'order_items_la2024',
        'courses_la2024',
        'products_la2024',
        'support_tickets_la2024',
        'support_ticket_responses_la2024',
        'profiles_la2024'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- ============================================================
-- blog_posts_la2024
-- Public: read published posts.  Admin: full access.
-- ============================================================
CREATE POLICY "Public read published posts"
  ON public.blog_posts_la2024 FOR SELECT
  USING (is_published = true OR public.is_admin());

CREATE POLICY "Admin manage posts"
  ON public.blog_posts_la2024 FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- testimonials_la2024
-- Public: read published.  Admin: full access.
-- ============================================================
CREATE POLICY "Public read published testimonials"
  ON public.testimonials_la2024 FOR SELECT
  USING (is_published = true OR public.is_admin());

CREATE POLICY "Admin manage testimonials"
  ON public.testimonials_la2024 FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- resources_la2024
-- Public SELECT.  Admin: writes.
-- ============================================================
CREATE POLICY "Public read resources"
  ON public.resources_la2024 FOR SELECT
  USING (true);

CREATE POLICY "Admin manage resources"
  ON public.resources_la2024 FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- bookings_la2024
-- Anyone can submit (INSERT).  Admin: read/update/delete.
-- ============================================================
CREATE POLICY "Anyone can submit booking"
  ON public.bookings_la2024 FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin manage bookings"
  ON public.bookings_la2024 FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- contact_messages_la2024
-- Anyone can send a message.  Admin: read/update/delete.
-- ============================================================
CREATE POLICY "Anyone can submit contact message"
  ON public.contact_messages_la2024 FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin manage contact messages"
  ON public.contact_messages_la2024 FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- newsletter_subscribers_la2024
-- Anyone can subscribe (INSERT).  Admin: manage.
-- ============================================================
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscribers_la2024 FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin manage newsletter subscribers"
  ON public.newsletter_subscribers_la2024 FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- site_settings_la2024
-- Admin only — never expose settings to anonymous clients.
-- ============================================================
CREATE POLICY "Admin manage site settings"
  ON public.site_settings_la2024 FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- courses_la2024
-- Public SELECT (catalog).  Admin: writes.
-- ============================================================
CREATE POLICY "Public read courses"
  ON public.courses_la2024 FOR SELECT
  USING (true);

CREATE POLICY "Admin manage courses"
  ON public.courses_la2024 FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- products_la2024
-- Public SELECT (catalog).  Admin: writes.
-- ============================================================
CREATE POLICY "Public read products"
  ON public.products_la2024 FOR SELECT
  USING (true);

CREATE POLICY "Admin manage products"
  ON public.products_la2024 FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- orders_la2024
-- Users see their own orders.  Admin: full access.
-- ============================================================
CREATE POLICY "Users view own orders"
  ON public.orders_la2024 FOR SELECT
  USING ((SELECT auth.uid()) = user_id OR public.is_admin());

CREATE POLICY "Users create own orders"
  ON public.orders_la2024 FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Admin manage orders"
  ON public.orders_la2024 FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- order_items_la2024
-- Users see items for their orders.  Admin: full access.
-- ============================================================
CREATE POLICY "Users view own order items"
  ON public.order_items_la2024 FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders_la2024
      WHERE id = order_items_la2024.order_id
        AND user_id = (SELECT auth.uid())
    )
    OR public.is_admin()
  );

CREATE POLICY "Users create order items for own orders"
  ON public.order_items_la2024 FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders_la2024
      WHERE id = order_items_la2024.order_id
        AND user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Admin manage order items"
  ON public.order_items_la2024 FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- support_tickets_la2024
-- Users manage their own tickets.  Admin: full access.
-- ============================================================
CREATE POLICY "Users view own tickets"
  ON public.support_tickets_la2024 FOR SELECT
  USING ((SELECT auth.uid()) = user_id OR public.is_admin());

CREATE POLICY "Users create own tickets"
  ON public.support_tickets_la2024 FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Admin manage tickets"
  ON public.support_tickets_la2024 FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- support_ticket_responses_la2024
-- Users interact with responses on their own tickets.
-- Admin: full access.
-- ============================================================
CREATE POLICY "Users view responses on own tickets"
  ON public.support_ticket_responses_la2024 FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.support_tickets_la2024
      WHERE id = support_ticket_responses_la2024.ticket_id
        AND user_id = (SELECT auth.uid())
    )
    OR public.is_admin()
  );

CREATE POLICY "Users reply to own tickets"
  ON public.support_ticket_responses_la2024 FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.support_tickets_la2024
      WHERE id = support_ticket_responses_la2024.ticket_id
        AND user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Admin manage ticket responses"
  ON public.support_ticket_responses_la2024 FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- profiles_la2024
-- Users read/update their own profile.  Admin: full access.
-- ============================================================
CREATE POLICY "Users view own profile"
  ON public.profiles_la2024 FOR SELECT
  USING ((SELECT auth.uid()) = id OR public.is_admin());

CREATE POLICY "Users update own profile"
  ON public.profiles_la2024 FOR UPDATE
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Admin manage profiles"
  ON public.profiles_la2024 FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
