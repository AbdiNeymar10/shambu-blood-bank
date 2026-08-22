"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { getPublicSystemSettings, type PublicSystemSettings } from "@/lib/actions/settings";
import { Resend } from "resend";
import nodemailer from "nodemailer";

export type ContactFormInput = {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
};

/**
 * Fetches public contact and system settings from Supabase database.
 */
export async function getContactInfoData(): Promise<PublicSystemSettings> {
  return await getPublicSystemSettings();
}

/**
 * Server action: Dispatches real emails via Resend or Nodemailer/SMTP
 * and logs inquiry to the Supabase database.
 */
export async function submitContactMessage(
  input: ContactFormInput
): Promise<{ success: boolean; deliveredEmail?: boolean; emailError?: string; error?: string }> {
  try {
    const firstName = (input.firstName || "").trim();
    const lastName = (input.lastName || "").trim();
    const senderEmail = (input.email || "").trim().toLowerCase();
    const subject = (input.subject || "general").trim();
    const message = (input.message || "").trim();

    if (!firstName || !lastName) {
      return { success: false, error: "First and last name are required." };
    }
    if (!senderEmail || !senderEmail.includes("@")) {
      return { success: false, error: "A valid email address is required." };
    }
    if (!message || message.length < 10) {
      return { success: false, error: "Message must be at least 10 characters long." };
    }

    const publicSettings = await getPublicSystemSettings();
    const recipientEmail = publicSettings.primaryContactEmail || "abitolesa23@gmail.com";

    const formattedSubject = subject.charAt(0).toUpperCase() + subject.slice(1);
    const emailSubject = `[Contact Inquiry] ${formattedSubject} from ${firstName} ${lastName}`;

    const htmlBody = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #e11d48; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">Shambu Blood Bank</h1>
          <p style="color: #fecdd3; margin: 4px 0 0 0; font-size: 14px;">New Contact Form Message</p>
        </div>
        <div style="padding: 24px; color: #1e293b; line-height: 1.6;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 100px; color: #64748b;">From:</td>
              <td style="padding: 8px 0;">${firstName} ${lastName} (&lt;<a href="mailto:${senderEmail}" style="color: #e11d48;">${senderEmail}</a>&gt;)</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Subject:</td>
              <td style="padding: 8px 0; text-transform: capitalize;">${formattedSubject}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Recipient:</td>
              <td style="padding: 8px 0;">${recipientEmail}</td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <p style="font-weight: bold; color: #475569; margin-bottom: 8px;">Message:</p>
          <div style="background-color: #f8fafc; border-left: 4px solid #e11d48; padding: 16px; border-radius: 8px; font-size: 15px; white-space: pre-wrap; color: #334155;">
            ${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b;">
          Sent via Shambu Blood Bank Platform • Registered Recipient: ${recipientEmail}
        </div>
      </div>
    `;

    const plainText = `From: ${firstName} ${lastName} (${senderEmail})\nSubject: ${formattedSubject}\nRecipient: ${recipientEmail}\n\nMessage:\n${message}`;

    let deliveredEmail = false;
    let emailError: string | null = null;

    const resendApiKey = process.env.RESEND_API_KEY;

    // 1. Try Resend API if RESEND_API_KEY is present
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const fromEmail = process.env.RESEND_FROM_EMAIL || "Shambu Blood Bank <onboarding@resend.dev>";
        
        // Preferred recipient target
        const targetEmail = process.env.RESEND_TO_EMAIL || recipientEmail || "abitolesa23@gmail.com";

        const { data: resendData, error: resendErr } = await resend.emails.send({
          from: fromEmail,
          to: [targetEmail],
          replyTo: senderEmail,
          subject: emailSubject,
          html: htmlBody,
          text: plainText,
        });

        if (!resendErr && resendData?.id) {
          deliveredEmail = true;
          console.log("[submitContactMessage] Resend email delivered successfully, ID:", resendData.id);
        } else if (resendErr) {
          console.error("[submitContactMessage] Resend error:", resendErr);
          emailError = resendErr.message || JSON.stringify(resendErr);

          // If onboarding domain restriction caused failure, try sending directly to default admin email (abitolesa23@gmail.com)
          if (resendErr.message?.toLowerCase().includes("only send to your own email") || resendErr.message?.toLowerCase().includes("testing")) {
            console.log("[submitContactMessage] Retrying Resend to default account email: abitolesa23@gmail.com...");
            const { data: retryData, error: retryErr } = await resend.emails.send({
              from: fromEmail,
              to: ["abitolesa23@gmail.com"],
              replyTo: senderEmail,
              subject: emailSubject,
              html: htmlBody,
              text: plainText,
            });

            if (!retryErr && retryData?.id) {
              deliveredEmail = true;
              emailError = null;
              console.log("[submitContactMessage] Resend retry succeeded, ID:", retryData.id);
            } else if (retryErr) {
              console.error("[submitContactMessage] Resend retry failed:", retryErr);
              emailError = retryErr.message;
            }
          }
        }
      } catch (eErr: any) {
        console.error("[submitContactMessage] Resend exception:", eErr);
        emailError = eErr?.message || "Resend connection error";
      }
    }

    // 2. Try SMTP via Nodemailer if SMTP configuration is present
    if (!deliveredEmail && process.env.SMTP_HOST && process.env.SMTP_USER) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"${firstName} ${lastName} via Shambu Blood Bank" <${process.env.SMTP_USER}>`,
          to: recipientEmail,
          replyTo: senderEmail,
          subject: emailSubject,
          text: plainText,
          html: htmlBody,
        });

        deliveredEmail = true;
      } catch (smtpErr) {
        console.error("SMTP dispatch error:", smtpErr);
      }
    }

    // 3. Always log to Supabase Database (notifications table) for record keeping
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    const { data: adminUsers } = await supabase
      .from("users")
      .select("id")
      .eq("role", "admin");

    let adminIds: string[] = (adminUsers || []).map((u: any) => u.id).filter(Boolean);

    if (adminIds.length === 0) {
      const { data: fallbackUsers } = await supabase
        .from("users")
        .select("id")
        .limit(5);
      adminIds = (fallbackUsers || []).map((u: any) => u.id).filter(Boolean);
    }

    if (adminIds.length > 0) {
      const notificationRows = adminIds.map((adminId) => ({
        user_id: adminId,
        title: `Contact Inquiry: ${formattedSubject} from ${firstName} ${lastName}`,
        message: `From: ${firstName} ${lastName} (${senderEmail})\nRecipient Email: ${recipientEmail}\nSubject: ${formattedSubject}\nEmail Delivered: ${deliveredEmail ? "Yes" : "Logged in Database (Add RESEND_API_KEY or SMTP credentials to .env.local for email inbox delivery)"}\n\nMessage:\n${message}`,
        type: "system",
        link: `contact:${senderEmail}`,
        is_read: false,
        created_at: new Date().toISOString(),
      }));

      await supabase.from("notifications").insert(notificationRows);
    }

    return {
      success: true,
      deliveredEmail,
      emailError: emailError || undefined,
    };
  } catch (err) {
    console.error("Unexpected error in submitContactMessage:", err);
    return { success: false, error: "An unexpected error occurred while processing your message." };
  }
}
