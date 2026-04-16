/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { createInquiry } from "@/lib/db/inquiries";
import { inquirySchema } from "@/lib/validations";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = inquirySchema.parse(body);

    const inquiry = await createInquiry({
      ...data,
      source: body.source ?? "contact-form",
      propertyTitle: body.propertyTitle,
    });

    // Send notification email
    if (process.env.RESEND_API_KEY && process.env.EMAIL_INQUIRY_TO) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM ?? "noreply@iberexestate.com",
        to: process.env.EMAIL_INQUIRY_TO,
        subject: `New Inquiry from ${data.fullName}`,
        html: `
          <h2>New Inquiry Received</h2>
          <p><strong>Name:</strong> ${data.fullName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
          ${body.propertyTitle ? `<p><strong>Property:</strong> ${body.propertyTitle}</p>` : ""}
          <p><strong>Message:</strong></p>
          <blockquote>${data.message}</blockquote>
        `,
      }).catch(console.error);
    }

    return NextResponse.json({ success: true, id: inquiry.id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  // Admin only — handled in admin API routes
  return NextResponse.json({ error: "Use /api/admin/inquiries" }, { status: 403 });
}