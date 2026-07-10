import supabase from './supabase';

const wrapper = (bodyHtml) => `
  <div style="font-family:'Montserrat',Arial,sans-serif;max-width:600px;margin:auto;padding:0;background:#F8F6F0;">
    <div style="background:#032B44;padding:28px 32px;border-radius:12px 12px 0 0;">
      <h1 style="color:#DAA520;font-family:Georgia,serif;font-size:22px;margin:0;">Lillian Adegbola</h1>
      <p style="color:#ffffff;opacity:0.8;margin:4px 0 0;font-size:13px;">The Queen of Clarity &amp; Purpose</p>
    </div>
    <div style="background:#ffffff;padding:32px;border-radius:0 0 12px 12px;">
      ${bodyHtml}
    </div>
    <p style="color:#999;font-size:11px;text-align:center;margin-top:16px;">
      This is an automated message regarding your consultation booking.
    </p>
  </div>
`;

const formatDate = (dateStr) => {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
};

const detailsTable = (booking) => `
  <table style="width:100%;border-collapse:collapse;margin:16px 0;">
    <tr><td style="padding:6px 0;color:#666;font-size:14px;width:110px;">Service</td><td style="padding:6px 0;color:#032B44;font-weight:600;font-size:14px;">${booking.service_name}</td></tr>
    <tr><td style="padding:6px 0;color:#666;font-size:14px;">Date</td><td style="padding:6px 0;color:#032B44;font-weight:600;font-size:14px;">${formatDate(booking.appointment_date)}</td></tr>
    <tr><td style="padding:6px 0;color:#666;font-size:14px;">Time</td><td style="padding:6px 0;color:#032B44;font-weight:600;font-size:14px;">${booking.appointment_time} ${booking.timezone || ''}</td></tr>
  </table>
`;

export const bookingReceivedEmail = (booking) => ({
  subject: `Booking Received - ${booking.service_name}`,
  html: wrapper(`
    <h2 style="color:#032B44;font-family:Georgia,serif;margin-top:0;">Thank you, ${booking.first_name}!</h2>
    <p style="color:#444;line-height:1.6;font-size:15px;">
      We've received your consultation request. Here's what you booked:
    </p>
    ${detailsTable(booking)}
    <p style="color:#444;line-height:1.6;font-size:15px;">
      Your booking is currently <strong style="color:#DAA520;">pending confirmation</strong>. You'll receive another email as soon as it's confirmed.
    </p>
  `)
});

/**
 * Sends a booking-related email via the send-activity-email edge function.
 * Best-effort: failures are logged but never thrown, so a flaky email
 * provider never blocks the booking flow itself.
 */
export const sendBookingEmail = async (booking, buildTemplate) => {
  if (!booking.email) return;

  try {
    const { subject, html } = buildTemplate(booking);
    const { data, error } = await supabase.functions.invoke('send-activity-email', {
      body: { type: 'direct', to: booking.email, subject, html }
    });

    if (error || data?.success === false) {
      console.error('Booking email failed:', error || data?.error);
    }
  } catch (err) {
    console.error('Booking email failed:', err);
  }
};

export const bookingConfirmedEmail = (booking) => ({
  subject: `Booking Confirmed - ${booking.service_name}`,
  html: wrapper(`
    <h2 style="color:#032B44;font-family:Georgia,serif;margin-top:0;">Your booking is confirmed, ${booking.first_name}!</h2>
    <p style="color:#444;line-height:1.6;font-size:15px;">
      Great news — your consultation has been confirmed. We look forward to speaking with you.
    </p>
    ${detailsTable(booking)}
    <p style="color:#444;line-height:1.6;font-size:15px;">
      If you need to reschedule or have any questions, please reply to this email.
    </p>
  `)
});
