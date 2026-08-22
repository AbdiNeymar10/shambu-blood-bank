export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "admin" | "donor" | "hospital_staff" | "recipient";

export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export type ComponentType =
  | "whole_blood"
  | "packed_red_cells"
  | "platelets"
  | "plasma"
  | "cryoprecipitate";

export type RequestPriority =
  | "low"
  | "normal"
  | "high"
  | "urgent"
  | "emergency";

export type RequestStatus =
  | "pending"
  | "approved"
  | "fulfilled"
  | "partially_fulfilled"
  | "cancelled"
  | "rejected";

export type DonationStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "deferred"
  | "rejected";

export type CampaignStatus = "upcoming" | "active" | "completed" | "cancelled";

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export type NotificationType =
  | "emergency_alert"
  | "donation_reminder"
  | "request_update"
  | "appointment_confirmation"
  | "campaign_invite"
  | "system";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          auth_id: string | null;
          email: string;
          full_name: string;
          phone: string | null;
          role: UserRole;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_id?: string | null;
          email: string;
          full_name: string;
          phone?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_id?: string | null;
          email?: string;
          full_name?: string;
          phone?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      donor_profiles: {
        Row: {
          id: string;
          user_id: string;
          blood_group: BloodGroup;
          date_of_birth: string;
          gender: string | null;
          weight_kg: number | null;
          address: string | null;
          city: string;
          subcity_zone: string | null;
          latitude: number | null;
          longitude: number | null;
          is_available: boolean;
          last_donation_date: string | null;
          next_eligible_date: string | null;
          medical_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          blood_group: BloodGroup;
          date_of_birth: string;
          gender?: string | null;
          weight_kg?: number | null;
          address?: string | null;
          city?: string;
          subcity_zone?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          is_available?: boolean;
          last_donation_date?: string | null;
          next_eligible_date?: string | null;
          medical_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          blood_group?: BloodGroup;
          date_of_birth?: string;
          gender?: string | null;
          weight_kg?: number | null;
          address?: string | null;
          city?: string;
          subcity_zone?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          is_available?: boolean;
          last_donation_date?: string | null;
          next_eligible_date?: string | null;
          medical_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "donor_profiles_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      hospitals: {
        Row: {
          id: string;
          name: string;
          code: string;
          hospital_type: string;
          contact_person: string | null;
          email: string | null;
          phone: string;
          emergency_phone: string | null;
          address: string;
          city: string;
          latitude: number | null;
          longitude: number | null;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          hospital_type?: string;
          contact_person?: string | null;
          email?: string | null;
          phone: string;
          emergency_phone?: string | null;
          address: string;
          city?: string;
          latitude?: number | null;
          longitude?: number | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          hospital_type?: string;
          contact_person?: string | null;
          email?: string | null;
          phone?: string;
          emergency_phone?: string | null;
          address?: string;
          city?: string;
          latitude?: number | null;
          longitude?: number | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      blood_inventory: {
        Row: {
          id: string;
          hospital_id: string;
          blood_group: BloodGroup;
          component_type: ComponentType;
          units_available: number;
          units_reserved: number;
          expiry_date: string | null;
          batch_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          hospital_id: string;
          blood_group: BloodGroup;
          component_type?: ComponentType;
          units_available?: number;
          units_reserved?: number;
          expiry_date?: string | null;
          batch_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          hospital_id?: string;
          blood_group?: BloodGroup;
          component_type?: ComponentType;
          units_available?: number;
          units_reserved?: number;
          expiry_date?: string | null;
          batch_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blood_inventory_hospital_id_fkey";
            columns: ["hospital_id"];
            referencedRelation: "hospitals";
            referencedColumns: ["id"];
          }
        ];
      };

      blood_requests: {
        Row: {
          id: string;
          request_number: string;
          requester_id: string | null;
          hospital_id: string;
          patient_name: string;
          patient_age: number | null;
          blood_group: BloodGroup;
          component_type: ComponentType;
          units_needed: number;
          units_fulfilled: number;
          priority: RequestPriority;
          status: RequestStatus;
          required_by_date: string;
          medical_reason: string | null;
          hospital_room: string | null;
          contact_phone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          request_number: string;
          requester_id?: string | null;
          hospital_id: string;
          patient_name: string;
          patient_age?: number | null;
          blood_group: BloodGroup;
          component_type?: ComponentType;
          units_needed: number;
          units_fulfilled?: number;
          priority?: RequestPriority;
          status?: RequestStatus;
          required_by_date: string;
          medical_reason?: string | null;
          hospital_room?: string | null;
          contact_phone: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          request_number?: string;
          requester_id?: string | null;
          hospital_id?: string;
          patient_name?: string;
          patient_age?: number | null;
          blood_group?: BloodGroup;
          component_type?: ComponentType;
          units_needed?: number;
          units_fulfilled?: number;
          priority?: RequestPriority;
          status?: RequestStatus;
          required_by_date?: string;
          medical_reason?: string | null;
          hospital_room?: string | null;
          contact_phone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blood_requests_requester_id_fkey";
            columns: ["requester_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blood_requests_hospital_id_fkey";
            columns: ["hospital_id"];
            referencedRelation: "hospitals";
            referencedColumns: ["id"];
          }
        ];
      };

      campaigns: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          location: string;
          hospital_id: string | null;
          start_date: string;
          end_date: string;
          target_units: number;
          collected_units: number;
          status: CampaignStatus;
          image_url: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          location: string;
          hospital_id?: string | null;
          start_date: string;
          end_date: string;
          target_units?: number;
          collected_units?: number;
          status?: CampaignStatus;
          image_url?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          location?: string;
          hospital_id?: string | null;
          start_date?: string;
          end_date?: string;
          target_units?: number;
          collected_units?: number;
          status?: CampaignStatus;
          image_url?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "campaigns_hospital_id_fkey";
            columns: ["hospital_id"];
            referencedRelation: "hospitals";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "campaigns_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      campaign_registrations: {
        Row: {
          id: string;
          campaign_id: string;
          donor_id: string;
          preferred_time_slot: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          donor_id: string;
          preferred_time_slot?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          donor_id?: string;
          preferred_time_slot?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "campaign_registrations_campaign_id_fkey";
            columns: ["campaign_id"];
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "campaign_registrations_donor_id_fkey";
            columns: ["donor_id"];
            referencedRelation: "donor_profiles";
            referencedColumns: ["id"];
          }
        ];
      };

      appointments: {
        Row: {
          id: string;
          donor_id: string;
          hospital_id: string;
          appointment_date: string;
          status: AppointmentStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          donor_id: string;
          hospital_id: string;
          appointment_date: string;
          status?: AppointmentStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          donor_id?: string;
          hospital_id?: string;
          appointment_date?: string;
          status?: AppointmentStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appointments_donor_id_fkey";
            columns: ["donor_id"];
            referencedRelation: "donor_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_hospital_id_fkey";
            columns: ["hospital_id"];
            referencedRelation: "hospitals";
            referencedColumns: ["id"];
          }
        ];
      };

      blood_donations: {
        Row: {
          id: string;
          donor_id: string;
          hospital_id: string;
          campaign_id: string | null;
          appointment_id: string | null;
          blood_group: BloodGroup;
          units_donated: number;
          status: DonationStatus;
          donation_date: string;
          hemoglobin_level: number | null;
          blood_pressure: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          donor_id: string;
          hospital_id: string;
          campaign_id?: string | null;
          appointment_id?: string | null;
          blood_group: BloodGroup;
          units_donated?: number;
          status?: DonationStatus;
          donation_date?: string;
          hemoglobin_level?: number | null;
          blood_pressure?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          donor_id?: string;
          hospital_id?: string;
          campaign_id?: string | null;
          appointment_id?: string | null;
          blood_group?: BloodGroup;
          units_donated?: number;
          status?: DonationStatus;
          donation_date?: string;
          hemoglobin_level?: number | null;
          blood_pressure?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blood_donations_donor_id_fkey";
            columns: ["donor_id"];
            referencedRelation: "donor_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blood_donations_hospital_id_fkey";
            columns: ["hospital_id"];
            referencedRelation: "hospitals";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blood_donations_campaign_id_fkey";
            columns: ["campaign_id"];
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blood_donations_appointment_id_fkey";
            columns: ["appointment_id"];
            referencedRelation: "appointments";
            referencedColumns: ["id"];
          }
        ];
      };

      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          author_id: string | null;
          cover_image_url: string | null;
          category: string;
          tags: string[];
          is_published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content: string;
          author_id?: string | null;
          cover_image_url?: string | null;
          category?: string;
          tags?: string[];
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string;
          author_id?: string | null;
          cover_image_url?: string | null;
          category?: string;
          tags?: string[];
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey";
            columns: ["author_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: NotificationType;
          title: string;
          message: string;
          link: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type?: NotificationType;
          title: string;
          message: string;
          link?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: NotificationType;
          title?: string;
          message?: string;
          link?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      system_settings: {
        Row: {
          id: string;
          blood_bank_name: string;
          emergency_hotline: string;
          primary_contact_email: string;
          address: string;
          sms_provider: string;
          sender_id: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          blood_bank_name?: string;
          emergency_hotline?: string;
          primary_contact_email?: string;
          address?: string;
          sms_provider?: string;
          sender_id?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          blood_bank_name?: string;
          emergency_hotline?: string;
          primary_contact_email?: string;
          address?: string;
          sms_provider?: string;
          sender_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [key: string]: {
        Row: Record<string, unknown>;
      };
    };
    Functions: {
      [key: string]: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
    };
    Enums: {
      user_role: UserRole;
      blood_group: BloodGroup;
      component_type: ComponentType;
      request_priority: RequestPriority;
      request_status: RequestStatus;
      donation_status: DonationStatus;
      campaign_status: CampaignStatus;
      appointment_status: AppointmentStatus;
      notification_type: NotificationType;
    };
    CompositeTypes: {
      [key: string]: Record<string, unknown>;
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
