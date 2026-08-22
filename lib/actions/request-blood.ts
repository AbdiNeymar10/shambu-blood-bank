"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { BloodGroup, ComponentType, RequestPriority, RequestStatus } from "@/types/database.types";

export type BloodRequestInput = {
  patientName: string;
  patientAge?: string;
  bloodGroup: string;
  units: string;
  requirementDate: string;
  hospitalName: string;
  hospitalAddress: string;
  doctorName: string;
  doctorContact: string;
  requesterName: string;
  relationship: string;
  contactNumber: string;
  additionalNotes?: string;
};

export type SubmitBloodRequestResult = {
  success: boolean;
  requestNumber?: string;
  status?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
};

const VALID_BLOOD_GROUPS: BloodGroup[] = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
];

/**
 * Validates and submits a standard blood request to Supabase.
 */
export async function submitBloodRequest(
  input: BloodRequestInput
): Promise<SubmitBloodRequestResult> {
  try {
    const fieldErrors: Record<string, string> = {};

    // 1. Server-side validation
    const patientName = (input.patientName || "").trim();
    const patientAgeParsed = input.patientAge && !isNaN(parseInt(input.patientAge, 10))
      ? parseInt(input.patientAge, 10)
      : null;
    const bloodGroup = (input.bloodGroup || "").trim() as BloodGroup;
    const unitsParsed = parseInt(input.units || "0", 10);
    const requirementDateRaw = (input.requirementDate || "").trim();
    const hospitalName = (input.hospitalName || "").trim();
    const hospitalAddress = (input.hospitalAddress || "").trim();
    const doctorName = (input.doctorName || "").trim();
    const doctorContact = (input.doctorContact || "").trim();
    const requesterName = (input.requesterName || "").trim();
    const relationship = (input.relationship || "").trim();
    const contactNumber = (input.contactNumber || "").trim();
    const additionalNotes = (input.additionalNotes || "").trim();

    if (!patientName) fieldErrors.patientName = "Patient name is required";
    if (patientAgeParsed === null || patientAgeParsed < 0) {
      fieldErrors.patientAge = "Patient age is required";
    }
    if (!bloodGroup || !VALID_BLOOD_GROUPS.includes(bloodGroup)) {
      fieldErrors.bloodGroup = "Valid blood group is required";
    }
    if (isNaN(unitsParsed) || unitsParsed <= 0) {
      fieldErrors.units = "Units must be a positive number";
    }
    if (!requirementDateRaw) {
      fieldErrors.requirementDate = "Requirement date is required";
    } else {
      const dateObj = new Date(requirementDateRaw);
      if (isNaN(dateObj.getTime())) {
        fieldErrors.requirementDate = "Invalid date format";
      }
    }

    if (!hospitalName) fieldErrors.hospitalName = "Hospital name is required";
    if (!hospitalAddress) fieldErrors.hospitalAddress = "Hospital address is required";
    if (!doctorName) fieldErrors.doctorName = "Doctor in charge is required";
    if (!doctorContact) fieldErrors.doctorContact = "Doctor contact is required";
    if (!requesterName) fieldErrors.requesterName = "Your name is required";
    if (!relationship) fieldErrors.relationship = "Relationship to patient is required";
    if (!contactNumber) fieldErrors.contactNumber = "Your contact number is required";

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        error: "We couldn't submit your request right now. Please check your information and try again.",
        fieldErrors,
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    // Check if user is logged in
    const { data: { user: authUser } } = await supabase.auth.getUser();
    let requesterUserId: string | null = null;
    if (authUser) {
      const { data: userRow } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", authUser.id)
        .maybeSingle();
      requesterUserId = userRow?.id || null;
    }

    // 2. Find or match hospital
    let hospitalId: string | null = null;
    if (hospitalName) {
      const { data: matchedHospitals } = await supabase
        .from("hospitals")
        .select("id")
        .ilike("name", `%${hospitalName}%`)
        .limit(1);

      if (matchedHospitals && matchedHospitals.length > 0) {
        hospitalId = matchedHospitals[0].id;
      }
    }

    // Fallback if no matching hospital by name found
    if (!hospitalId) {
      const { data: defaultHospitals } = await supabase
        .from("hospitals")
        .select("id")
        .limit(1);

      if (defaultHospitals && defaultHospitals.length > 0) {
        hospitalId = defaultHospitals[0].id;
      }
    }

    // Auto-create hospital record if database has no hospital records yet
    if (!hospitalId) {
      const hospitalCode = `HOSP-${Math.floor(1000 + Math.random() * 9000)}`;
      const { data: createdHosp } = await supabase
        .from("hospitals")
        .insert({
          name: hospitalName || "General Hospital",
          code: hospitalCode,
          phone: doctorContact || "+251911000000",
          address: hospitalAddress || "Shambu",
          city: "Shambu",
          is_verified: true,
        })
        .select("id")
        .single();

      hospitalId = createdHosp?.id || null;
    }

    if (!hospitalId) {
      return {
        success: false,
        error: "We couldn't submit your request right now. Please check your information and try again.",
      };
    }

    // 3. Generate unique reference number e.g. REQ-2026-8492
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const year = new Date().getFullYear();
    const requestNumber = `REQ-${year}-${randomSuffix}`;

    // 4. Construct medical_reason summary
    const medicalReasonText = [
      `Hospital: ${hospitalName} (${hospitalAddress})`,
      `Doctor: ${doctorName} (Ph: ${doctorContact})`,
      `Requester: ${requesterName} (${relationship}, Ph: ${contactNumber})`,
      additionalNotes ? `Notes: ${additionalNotes}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    // 5. Force public status & priority
    const status: RequestStatus = "pending";
    const priority: RequestPriority = "normal";
    const componentType: ComponentType = "whole_blood";

    const requiredByIso = new Date(requirementDateRaw).toISOString();

    const { error: insertError } = await supabase
      .from("blood_requests")
      .insert({
        request_number: requestNumber,
        requester_id: requesterUserId,
        hospital_id: hospitalId,
        patient_name: patientName,
        patient_age: patientAgeParsed,
        blood_group: bloodGroup,
        component_type: componentType,
        units_needed: unitsParsed,
        units_fulfilled: 0,
        priority: priority,
        status: status,
        required_by_date: requiredByIso,
        medical_reason: medicalReasonText,
        hospital_room: hospitalAddress,
        contact_phone: contactNumber || doctorContact,
      });

    if (insertError) {
      console.error("Supabase insert blood request error:", insertError);
      return {
        success: false,
        error: "We couldn't submit your request right now. Please check your information and try again.",
      };
    }

    return {
      success: true,
      requestNumber,
      status: "Pending",
    };
  } catch (err) {
    console.error("Unexpected error in submitBloodRequest:", err);
    return {
      success: false,
      error: "We couldn't submit your request right now. Please check your information and try again.",
    };
  }
}
