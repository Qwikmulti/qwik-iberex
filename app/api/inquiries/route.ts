/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { createInquiry } from "@/lib/db/inquiries";
import { inquirySchema, tourRequestSchema } from "@/lib/validations";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const source = body.source ?? "contact-form";
    
    let validatedData: any;
    let finalMessage: string;

    if (source === "tour-request") {
      validatedData = tourRequestSchema.parse(body);
      finalMessage = body.specialRequirements || "Requesting a private tour.";
    } else {
      validatedData = inquirySchema.parse(body);
      finalMessage = validatedData.message;
    }

    const inquiry = await createInquiry({
      fullName: validatedData.fullName,
      email: validatedData.email,
      phone: (validatedData as any).phone,
      message: finalMessage,
      propertyId: validatedData.propertyId,
      propertyTitle: (validatedData as any).propertyTitle || body.propertyTitle,
      source,
    });

    // Send notification email
    if (process.env.RESEND_API_KEY && process.env.EMAIL_INQUIRY_TO) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM ?? "noreply@iberexestate.com",
        to: process.env.EMAIL_INQUIRY_TO,
        subject: `[${source.toUpperCase()}] New Inquiry from ${validatedData.fullName}`,
        html: `
          <h2>New Inquiry Received</h2>
          <p><strong>Source:</strong> ${source}</p>
          <p><strong>Name:</strong> ${validatedData.fullName}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          ${(validatedData as any).phone ? `<p><strong>Phone:</strong> ${(validatedData as any).phone}</p>` : ""}
          ${(validatedData as any).propertyTitle || body.propertyTitle ? `<p><strong>Property:</strong> ${(validatedData as any).propertyTitle || body.propertyTitle}</p>` : ""}
          <p><strong>Message:</strong></p>
          <blockquote>${finalMessage}</blockquote>
        `,
      }).catch(console.error);
    }

    return NextResponse.json({ success: true, id: inquiry.id });
  } catch (error: any) {
    console.error("Inquiry error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  // Admin only — handled in admin API routes
  return NextResponse.json({ error: "Use /api/admin/inquiries" }, { status: 403 });
}