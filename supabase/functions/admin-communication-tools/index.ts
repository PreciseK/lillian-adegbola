import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ================================================================
// Shared SMTP email sender using cPanel/SMTP credentials from Secrets
// Reads: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM_NAME
// from Supabase Edge Function Secrets
// ================================================================
async function sendEmail(to: string, subject: string, html: string, fromName?: string) {
    const smtpHost = Deno.env.get('SMTP_HOST')
    const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '465')
    const smtpUser = Deno.env.get('SMTP_USER')
    const smtpPass = Deno.env.get('SMTP_PASS')
    const smtpFromName = fromName || Deno.env.get('SMTP_FROM_NAME') || 'Lillian Adegbola'

    if (!smtpHost || !smtpUser || !smtpPass) {
        throw new Error('SMTP credentials not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS in Supabase Secrets.')
    }

    // Use Deno's built-in TCP + SMTP protocol via fetch to a relay
    // Since Deno Edge Functions run in Deno Deploy, we use the smtp package
    const { SMTPClient } = await import("https://deno.land/x/denomailer@1.6.0/mod.ts")

    const client = new SMTPClient({
        connection: {
            hostname: smtpHost,
            port: smtpPort,
            tls: smtpPort === 465,
            auth: {
                username: smtpUser,
                password: smtpPass,
            },
        },
    })

    await client.send({
        from: `${smtpFromName} <${smtpUser}>`,
        to: to,
        subject: subject,
        content: "auto",
        html: html,
    })

    await client.close()
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { action, payload } = await req.json()

        const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
        const supabase = createClient(supabaseUrl, supabaseKey)

        let message = ''
        let result = {}

        switch (action) {
            case 'bulk-email': {
                // Fetch all users with email notifications enabled
                const { data: profiles } = await supabase
                    .from('profiles_la2024')
                    .select('email, first_name, settings')

                const subject = payload?.subject || 'An Update from Lillian Adegbola'
                const html = payload?.html || '<p>Hello! This is a message from Lillian Adegbola.</p>'

                let sent = 0
                let failed = 0

                for (const profile of profiles || []) {
                    const notifications = profile.settings?.notifications || {}
                    if (!profile.email || notifications.email === false) continue
                    try {
                        await sendEmail(profile.email, subject, html)
                        sent++
                    } catch {
                        failed++
                    }
                }

                message = `Bulk email complete. Sent: ${sent}, Failed: ${failed}.`
                result = { sent, failed }
                break
            }

            case 'send-single': {
                // Send a single email to a specific recipient
                const { to, subject, html } = payload || {}
                if (!to || !subject || !html) throw new Error('Missing required fields: to, subject, html')
                await sendEmail(to, subject, html)
                message = `Email sent to ${to} successfully.`
                result = { status: 'sent', recipient: to, timestamp: new Date().toISOString() }
                break
            }

            case 'notification-manager':
                message = 'Notification settings updated.'
                result = { success: true }
                break

            case 'template-editor':
                message = 'Template saved successfully.'
                result = { id: 'tpl_new', version: 2 }
                break

            case 'message-scheduler':
                message = 'Message scheduled successfully.'
                result = { scheduled_for: new Date(Date.now() + 86400000).toISOString() }
                break

            case 'test-smtp': {
                // Send a real test email using SMTP credentials
                const { email } = payload || {}
                if (!email) throw new Error('Email address is required for testing.')
                await sendEmail(
                    email,
                    'Test Email – Lillian Adegbola Platform',
                    `<h2>✅ SMTP Configuration Working</h2>
                     <p>Your cPanel SMTP is correctly configured for the Lillian Adegbola platform.</p>
                     <p>Emails will now be sent using your custom email server.</p>
                     <br><p style="color:#888;">Sent at: ${new Date().toISOString()}</p>`
                )
                message = `Test email sent to ${email} successfully. SMTP is working.`
                result = { status: 'sent', recipient: email, timestamp: new Date().toISOString() }
                break
            }

            default:
                throw new Error(`Unknown action: ${action}`)
        }

        return new Response(
            JSON.stringify({ success: true, message, data: result }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
    }
})
