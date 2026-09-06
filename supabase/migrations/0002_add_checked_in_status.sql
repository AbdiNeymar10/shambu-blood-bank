-- ============================================================================
-- SHAMBU BLOOD BANK - MIGRATION 0002: Add 'checked_in' to appointment_status enum
-- ============================================================================

ALTER TYPE appointment_status ADD VALUE IF NOT EXISTS 'checked_in' BEFORE 'completed';
