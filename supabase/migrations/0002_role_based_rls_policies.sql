-- =============================================================================
-- Shambu Blood Bank - Migration 0002: Comprehensive Role-Based RLS Policies
-- =============================================================================

-- 1. Create SECURITY DEFINER Helper Function to check if current auth user is an Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE auth_id = auth.uid()
    AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- 2. Create Helper Function to get current public.users(id) for auth.uid()
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS uuid AS $$
  SELECT id FROM public.users
  WHERE auth_id = auth.uid()
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- =============================================================================
-- TABLE-BY-TABLE ROLE-BASED ACCESS CONTROL (RLS) POLICIES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- USERS TABLE
-- -----------------------------------------------------------------------------
CREATE POLICY "Admins have full access to all users"
  ON public.users FOR ALL
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- DONOR PROFILES TABLE
-- -----------------------------------------------------------------------------
CREATE POLICY "Admins have full access to donor profiles"
  ON public.donor_profiles FOR ALL
  USING (public.is_admin());

CREATE POLICY "Donors can insert own donor profile"
  ON public.donor_profiles FOR INSERT
  WITH CHECK (user_id = public.get_current_user_id());

-- -----------------------------------------------------------------------------
-- HOSPITALS TABLE
-- -----------------------------------------------------------------------------
CREATE POLICY "Admins can manage hospitals"
  ON public.hospitals FOR ALL
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- BLOOD INVENTORY TABLE
-- -----------------------------------------------------------------------------
CREATE POLICY "Admins can manage blood inventory"
  ON public.blood_inventory FOR ALL
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- BLOOD REQUESTS TABLE
-- -----------------------------------------------------------------------------
CREATE POLICY "Admins can manage all blood requests"
  ON public.blood_requests FOR ALL
  USING (public.is_admin());

CREATE POLICY "Donors can create blood requests"
  ON public.blood_requests FOR INSERT
  WITH CHECK (requester_id = public.get_current_user_id());

CREATE POLICY "Donors can view own created blood requests"
  ON public.blood_requests FOR SELECT
  USING (requester_id = public.get_current_user_id());

-- -----------------------------------------------------------------------------
-- CAMPAIGNS & REGISTRATIONS
-- -----------------------------------------------------------------------------
CREATE POLICY "Admins can manage campaigns"
  ON public.campaigns FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admins can manage campaign registrations"
  ON public.campaign_registrations FOR ALL
  USING (public.is_admin());

CREATE POLICY "Donors can view own campaign registrations"
  ON public.campaign_registrations FOR SELECT
  USING (
    donor_id IN (
      SELECT id FROM public.donor_profiles WHERE user_id = public.get_current_user_id()
    )
  );

CREATE POLICY "Donors can register for active campaigns"
  ON public.campaign_registrations FOR INSERT
  WITH CHECK (
    donor_id IN (
      SELECT id FROM public.donor_profiles WHERE user_id = public.get_current_user_id()
    )
  );

-- -----------------------------------------------------------------------------
-- APPOINTMENTS TABLE
-- -----------------------------------------------------------------------------
CREATE POLICY "Admins can manage appointments"
  ON public.appointments FOR ALL
  USING (public.is_admin());

CREATE POLICY "Donors can view own appointments"
  ON public.appointments FOR SELECT
  USING (
    donor_id IN (
      SELECT id FROM public.donor_profiles WHERE user_id = public.get_current_user_id()
    )
  );

CREATE POLICY "Donors can schedule appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (
    donor_id IN (
      SELECT id FROM public.donor_profiles WHERE user_id = public.get_current_user_id()
    )
  );

-- -----------------------------------------------------------------------------
-- BLOOD DONATIONS TABLE
-- -----------------------------------------------------------------------------
CREATE POLICY "Admins can manage blood donations"
  ON public.blood_donations FOR ALL
  USING (public.is_admin());

CREATE POLICY "Donors can view own donation history"
  ON public.blood_donations FOR SELECT
  USING (
    donor_id IN (
      SELECT id FROM public.donor_profiles WHERE user_id = public.get_current_user_id()
    )
  );

-- -----------------------------------------------------------------------------
-- BLOG POSTS TABLE
-- -----------------------------------------------------------------------------
CREATE POLICY "Admins can manage blog posts"
  ON public.blog_posts FOR ALL
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- NOTIFICATIONS TABLE
-- -----------------------------------------------------------------------------
CREATE POLICY "Admins can manage notifications"
  ON public.notifications FOR ALL
  USING (public.is_admin());

CREATE POLICY "Users can mark own notifications as read"
  ON public.notifications FOR UPDATE
  USING (user_id = public.get_current_user_id());
