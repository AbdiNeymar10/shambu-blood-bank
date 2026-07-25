-- ============================================================================
-- SHAMBU BLOOD BANK - INITIAL DATABASE MIGRATION
-- ============================================================================
-- Fully normalized PostgreSQL database schema for blood bank operations,
-- donor management, inventory tracking, emergency requests, campaigns,
-- appointments, educational blog posts, and user notifications.
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. ENUM TYPES
-- ----------------------------------------------------------------------------

CREATE TYPE user_role AS ENUM (
  'admin',
  'donor',
  'hospital_staff',
  'recipient'
);

CREATE TYPE blood_group AS ENUM (
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-'
);

CREATE TYPE component_type AS ENUM (
  'whole_blood',
  'packed_red_cells',
  'platelets',
  'plasma',
  'cryoprecipitate'
);

CREATE TYPE request_priority AS ENUM (
  'low',
  'normal',
  'high',
  'urgent',
  'emergency'
);

CREATE TYPE request_status AS ENUM (
  'pending',
  'approved',
  'fulfilled',
  'partially_fulfilled',
  'cancelled',
  'rejected'
);

CREATE TYPE donation_status AS ENUM (
  'scheduled',
  'completed',
  'cancelled',
  'deferred',
  'rejected'
);

CREATE TYPE campaign_status AS ENUM (
  'upcoming',
  'active',
  'completed',
  'cancelled'
);

CREATE TYPE appointment_status AS ENUM (
  'scheduled',
  'confirmed',
  'completed',
  'cancelled',
  'no_show'
);

CREATE TYPE notification_type AS ENUM (
  'emergency_alert',
  'donation_reminder',
  'request_update',
  'appointment_confirmation',
  'campaign_invite',
  'system'
);

-- ----------------------------------------------------------------------------
-- 2. TRIGGER FUNCTION FOR UPDATED_AT
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 3. TABLES DEFINITION
-- ----------------------------------------------------------------------------

-- TABLE 1: users (Extends Supabase Auth users)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'donor',
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE 2: donor_profiles (1:1 with users for donor details)
CREATE TABLE donor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  blood_group blood_group NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT,
  weight_kg NUMERIC(5,2) CHECK (weight_kg IS NULL OR weight_kg >= 45.0),
  address TEXT,
  city TEXT NOT NULL DEFAULT 'Shambu',
  subcity_zone TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  is_available BOOLEAN NOT NULL DEFAULT true,
  last_donation_date DATE,
  next_eligible_date DATE,
  medical_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT check_next_eligible CHECK (
    next_eligible_date IS NULL OR 
    last_donation_date IS NULL OR 
    next_eligible_date >= last_donation_date
  )
);

-- TABLE 3: hospitals (Medical centers & blood banks)
CREATE TABLE hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  hospital_type TEXT NOT NULL DEFAULT 'General Hospital',
  contact_person TEXT,
  email TEXT,
  phone TEXT NOT NULL,
  emergency_phone TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Shambu',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  is_verified BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE 4: blood_inventory (Live inventory per hospital and blood type)
CREATE TABLE blood_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  blood_group blood_group NOT NULL,
  component_type component_type NOT NULL DEFAULT 'whole_blood',
  units_available INTEGER NOT NULL DEFAULT 0 CHECK (units_available >= 0),
  units_reserved INTEGER NOT NULL DEFAULT 0 CHECK (units_reserved >= 0),
  expiry_date DATE,
  batch_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_hospital_component_batch UNIQUE (hospital_id, blood_group, component_type, batch_number)
);

-- TABLE 5: blood_requests (Patient & hospital blood requests)
CREATE TABLE blood_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number TEXT NOT NULL UNIQUE,
  requester_id UUID REFERENCES users(id) ON DELETE SET NULL,
  hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  patient_age INTEGER CHECK (patient_age IS NULL OR patient_age >= 0),
  blood_group blood_group NOT NULL,
  component_type component_type NOT NULL DEFAULT 'whole_blood',
  units_needed INTEGER NOT NULL CHECK (units_needed > 0),
  units_fulfilled INTEGER NOT NULL DEFAULT 0 CHECK (units_fulfilled >= 0),
  priority request_priority NOT NULL DEFAULT 'normal',
  status request_status NOT NULL DEFAULT 'pending',
  required_by_date TIMESTAMPTZ NOT NULL,
  medical_reason TEXT,
  hospital_room TEXT,
  contact_phone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT check_units_fulfilled CHECK (units_fulfilled <= units_needed)
);

-- TABLE 6: campaigns (Community blood drives)
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  location TEXT NOT NULL,
  hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  target_units INTEGER NOT NULL DEFAULT 100 CHECK (target_units > 0),
  collected_units INTEGER NOT NULL DEFAULT 0 CHECK (collected_units >= 0),
  status campaign_status NOT NULL DEFAULT 'upcoming',
  image_url TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT check_campaign_dates CHECK (end_date > start_date)
);

-- TABLE 7: campaign_registrations (Donor campaign RSVPs)
CREATE TABLE campaign_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  donor_id UUID NOT NULL REFERENCES donor_profiles(id) ON DELETE CASCADE,
  preferred_time_slot TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'registered',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_campaign_donor UNIQUE (campaign_id, donor_id)
);

-- TABLE 8: appointments (Scheduled donor center visits)
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID NOT NULL REFERENCES donor_profiles(id) ON DELETE CASCADE,
  hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  appointment_date TIMESTAMPTZ NOT NULL,
  status appointment_status NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE 9: blood_donations (Completed blood donation records)
CREATE TABLE blood_donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID NOT NULL REFERENCES donor_profiles(id) ON DELETE CASCADE,
  hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  blood_group blood_group NOT NULL,
  units_donated NUMERIC(3,1) NOT NULL DEFAULT 1.0 CHECK (units_donated > 0),
  status donation_status NOT NULL DEFAULT 'completed',
  donation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  hemoglobin_level NUMERIC(4,2),
  blood_pressure TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE 10: blog_posts (Health education articles & news)
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  cover_image_url TEXT,
  category TEXT NOT NULL DEFAULT 'Education',
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE 11: notifications (User emergency & system alerts)
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL DEFAULT 'system',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. PERFORMANCE INDEXES
-- ----------------------------------------------------------------------------

-- Indexes on users & donor_profiles
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_donor_user_id ON donor_profiles(user_id);
CREATE INDEX idx_donor_blood_group ON donor_profiles(blood_group);
CREATE INDEX idx_donor_availability ON donor_profiles(is_available, next_eligible_date);
CREATE INDEX idx_donor_city ON donor_profiles(city);

-- Indexes on hospitals & inventory
CREATE INDEX idx_hospitals_code ON hospitals(code);
CREATE INDEX idx_hospitals_city ON hospitals(city);
CREATE INDEX idx_inventory_lookup ON blood_inventory(hospital_id, blood_group, component_type);
CREATE INDEX idx_inventory_expiry ON blood_inventory(expiry_date);

-- Indexes on blood requests
CREATE INDEX idx_requests_status ON blood_requests(status);
CREATE INDEX idx_requests_priority ON blood_requests(priority);
CREATE INDEX idx_requests_blood_group ON blood_requests(blood_group);
CREATE INDEX idx_requests_hospital ON blood_requests(hospital_id);
CREATE INDEX idx_requests_required_by ON blood_requests(required_by_date);

-- Indexes on donations, appointments & campaigns
CREATE INDEX idx_donations_donor ON blood_donations(donor_id);
CREATE INDEX idx_donations_hospital ON blood_donations(hospital_id);
CREATE INDEX idx_donations_date ON blood_donations(donation_date);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_slug ON campaigns(slug);
CREATE INDEX idx_campaign_reg_lookup ON campaign_registrations(campaign_id, donor_id);
CREATE INDEX idx_appointments_donor ON appointments(donor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);

-- Indexes on blog_posts & notifications
CREATE INDEX idx_blog_slug ON blog_posts(slug);
CREATE INDEX idx_blog_published ON blog_posts(is_published, published_at);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read, created_at DESC);

-- ----------------------------------------------------------------------------
-- 5. UPDATED_AT TRIGGERS
-- ----------------------------------------------------------------------------

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_donor_profiles_updated_at BEFORE UPDATE ON donor_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_hospitals_updated_at BEFORE UPDATE ON hospitals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_blood_inventory_updated_at BEFORE UPDATE ON blood_inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_blood_requests_updated_at BEFORE UPDATE ON blood_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_campaign_registrations_updated_at BEFORE UPDATE ON campaign_registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_blood_donations_updated_at BEFORE UPDATE ON blood_donations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 6. AUTOMATIC AUTH USER SYNC TRIGGER
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'donor'::user_role)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ----------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) ENABLEMENT & POLICIES
-- ----------------------------------------------------------------------------

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE donor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public read access for verified hospitals" ON hospitals FOR SELECT USING (is_verified = true);
CREATE POLICY "Public read access for blood inventory" ON blood_inventory FOR SELECT USING (true);
CREATE POLICY "Public read access for active campaigns" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Public read access for active blood requests" ON blood_requests FOR SELECT USING (true);
CREATE POLICY "Public read access for published blog posts" ON blog_posts FOR SELECT USING (is_published = true);

-- User Self Management Policies
CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (auth.uid() = auth_id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = auth_id);
CREATE POLICY "Donors can view own donor profile" ON donor_profiles FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));
CREATE POLICY "Donors can update own donor profile" ON donor_profiles FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));
