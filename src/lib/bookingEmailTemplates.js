import supabase from './supabase';

const ADMIN_NOTIFICATION_EMAILS = ['clarityqueen23@gmail.com', 'coach@lillianadegbola.com'];

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

const meetingTypeLabel = (booking) => (booking.meeting_type === 'offline' ? 'In-Person' : 'Online');

const detailsTable = (booking) => `
  <table style="width:100%;border-collapse:collapse;margin:16px 0;">
    <tr><td style="padding:6px 0;color:#666;font-size:14px;width:110px;">Service</td><td style="padding:6px 0;color:#032B44;font-weight:600;font-size:14px;">${booking.service_name}</td></tr>
    <tr><td style="padding:6px 0;color:#666;font-size:14px;">Date</td><td style="padding:6px 0;color:#032B44;font-weight:600;font-size:14px;">${formatDate(booking.appointment_date)}</td></tr>
    <tr><td style="padding:6px 0;color:#666;font-size:14px;">Time</td><td style="padding:6px 0;color:#032B44;font-weight:600;font-size:14px;">${booking.appointment_time} ${booking.timezone || ''}</td></tr>
    <tr><td style="padding:6px 0;color:#666;font-size:14px;">Format</td><td style="padding:6px 0;color:#032B44;font-weight:600;font-size:14px;">${meetingTypeLabel(booking)}</td></tr>
  </table>
`;

const meetingLocationBlock = (booking) => {
  if (booking.meeting_type === 'offline') {
    if (!booking.meeting_address) return '';
    return `
      <div style="background:#F8F6F0;border-left:3px solid #DAA520;padding:14px 18px;margin:16px 0;border-radius:6px;">
        <p style="margin:0 0 4px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Meeting Address</p>
        <p style="margin:0;color:#032B44;font-weight:600;font-size:14px;">${booking.meeting_address}</p>
      </div>
    `;
  }

  if (booking.meeting_link) {
    return `
      <div style="text-align:center;margin:24px 0;">
        <a href="${booking.meeting_link}" style="background:#DAA520;color:#032B44;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block;">
          Join Video Call
        </a>
        <p style="margin:10px 0 0;color:#999;font-size:12px;word-break:break-all;">${booking.meeting_link}</p>
      </div>
    `;
  }

  return '';
};

export const bookingReceivedEmail = (booking) => ({
  subject: `Booking Received - ${booking.service_name}`,
  html: wrapper(`
    <h2 style="color:#032B44;font-family:Georgia,serif;margin-top:0;">Thank you, ${booking.first_name}!</h2>
    <p style="color:#444;line-height:1.6;font-size:15px;">
      We've received your consultation request. Here's what you booked:
    </p>
    ${detailsTable(booking)}
    ${meetingLocationBlock(booking)}
    <p style="color:#444;line-height:1.6;font-size:15px;">
      Your booking is currently <strong style="color:#DAA520;">pending confirmation</strong>. You'll receive another email as soon as it's confirmed${booking.meeting_type === 'online' ? ', with your video call link' : ''}.
    </p>
  `)
});

export const bookingConfirmedEmail = (booking) => ({
  subject: `Booking Confirmed - ${booking.service_name}`,
  html: wrapper(`
    <h2 style="color:#032B44;font-family:Georgia,serif;margin-top:0;">Your booking is confirmed, ${booking.first_name}!</h2>
    <p style="color:#444;line-height:1.6;font-size:15px;">
      Great news — your consultation has been confirmed. We look forward to speaking with you.
    </p>
    ${detailsTable(booking)}
    ${meetingLocationBlock(booking)}
    <p style="color:#444;line-height:1.6;font-size:15px;">
      If you need to reschedule or have any questions, please reply to this email.
    </p>
  `)
});

export const bookingDeclinedEmail = (booking) => ({
  subject: `Booking Update - ${booking.service_name}`,
  html: wrapper(`
    <h2 style="color:#032B44;font-family:Georgia,serif;margin-top:0;">Hi ${booking.first_name},</h2>
    <p style="color:#444;line-height:1.6;font-size:15px;">
      We're sorry, but we're unable to confirm your requested consultation:
    </p>
    ${detailsTable(booking)}
    ${booking.decline_reason ? `
      <div style="background:#FEF2F2;border-left:3px solid #EF4444;padding:14px 18px;margin:16px 0;border-radius:6px;">
        <p style="margin:0 0 4px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Reason</p>
        <p style="margin:0;color:#032B44;font-size:14px;">${booking.decline_reason}</p>
      </div>
    ` : ''}
    <p style="color:#444;line-height:1.6;font-size:15px;">
      We'd love to still work with you — please visit the site and book another time that works better.
    </p>
  `)
});

const sendEmailViaFunction = async (to, subject, html) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-activity-email', {
      body: { type: 'direct', to, subject, html }
    });

    if (error || data?.success === false) {
      console.error('Booking email failed:', error || data?.error);
    }
  } catch (err) {
    console.error('Booking email failed:', err);
  }
};

/**
 * Sends a booking-related email to the customer via the
 * send-activity-email edge function. Best-effort: failures are logged
 * but never thrown, so a flaky email provider never blocks the
 * booking flow itself.
 */
export const sendBookingEmail = async (booking, buildTemplate) => {
  if (!booking.email) return;
  const { subject, html } = buildTemplate(booking);
  await sendEmailViaFunction(booking.email, subject, html);
};

/**
 * Notifies the site owner/coach whenever a booking is confirmed.
 */
export const notifyAdminsOfConfirmedBooking = async (booking) => {
  const subject = `Booking Confirmed - ${booking.first_name} ${booking.last_name} (${booking.service_name})`;
  const html = wrapper(`
    <h2 style="color:#032B44;font-family:Georgia,serif;margin-top:0;">A booking was just confirmed</h2>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:6px 0;color:#666;font-size:14px;width:110px;">Client</td><td style="padding:6px 0;color:#032B44;font-weight:600;font-size:14px;">${booking.first_name} ${booking.last_name}</td></tr>
      <tr><td style="padding:6px 0;color:#666;font-size:14px;">Email</td><td style="padding:6px 0;color:#032B44;font-weight:600;font-size:14px;">${booking.email}</td></tr>
      <tr><td style="padding:6px 0;color:#666;font-size:14px;">Phone</td><td style="padding:6px 0;color:#032B44;font-weight:600;font-size:14px;">${booking.phone || 'Not provided'}</td></tr>
    </table>
    ${detailsTable(booking)}
    ${meetingLocationBlock(booking)}
  `);

  await Promise.all(ADMIN_NOTIFICATION_EMAILS.map((to) => sendEmailViaFunction(to, subject, html)));
};
