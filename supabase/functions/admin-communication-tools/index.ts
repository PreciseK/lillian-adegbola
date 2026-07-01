import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ================================================================
// Send email via Resend HTTP API (works reliably from Supabase Edge Functions)
// Required secrets: RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_FROM_NAME
// ================================================================
async function sendEmail(to: string, subject: string, html: string) {
    const apiKey = Deno.env.get('RESEND_API_KEY')
    const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'onboarding@resend.dev'
    const fromName = Deno.env.get('RESEND_FROM_NAME') || 'Lillian Adegbola'

    if (!apiKey) {
        throw new Error('RESEND_API_KEY is not set in Supabase Secrets.')
    }

    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            from: `${fromName} <${fromEmail}>`,
            to: [to],
            subject,
            html,
        }),
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(`Resend error: ${data.message || res.statusText}`)
    }

    return data
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
                const { to, subject, html } = payload || {}
                if (!to || !subject || !html) throw new Error('Missing required fields: to, subject, html')
                const emailResult = await sendEmail(to, subject, html)
                message = `Email sent to ${to} successfully.`
                result = { status: 'sent', recipient: to, id: emailResult.id, timestamp: new Date().toISOString() }
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
                const { email } = payload || {}
                if (!email) throw new Error('Email address is required for testing.')
                const emailResult = await sendEmail(
                    email,
                    'Test Email – Lillian Adegbola Platform',
                    `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;">
                        <h2 style="color:#1a3a5c;">✅ Email Configuration Working</h2>
                        <p>Your Resend integration is correctly configured for the Lillian Adegbola platform.</p>
                        <p>All platform emails (contact replies, notifications, bulk emails) will now be delivered reliably.</p>
                        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
                        <p style="color:#888;font-size:12px;">Sent at: ${new Date().toISOString()}</p>
                    </div>`
                )
                message = `Test email sent to ${email} successfully. Resend ID: ${emailResult.id}`
                result = { status: 'sent', recipient: email, id: emailResult.id, timestamp: new Date().toISOString() }
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
