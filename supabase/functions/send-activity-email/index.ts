import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

// ================================================================
// Send email via Resend HTTP API
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

interface EmailRequest {
    type: 'major_activity' | 'course_reminder' | 'marketing' | 'direct'
    subject: string
    html: string
    target_user_id?: string
    to?: string
}

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders })
    }

    try {
        const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
        const { type, subject, html, target_user_id, to } = await req.json() as EmailRequest

        // Direct single-recipient email (e.g. contact form reply)
        if (type === 'direct' && to) {
            const emailResult = await sendEmail(to, subject, html)
            return new Response(JSON.stringify({ success: true, sent_count: 1, id: emailResult.id }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            })
        }

        // Broadcast to opted-in users
        let query = supabase.from("profiles_la2024").select("email, first_name, settings")
        if (target_user_id) {
            query = query.eq("id", target_user_id)
        }

        const { data: profiles, error } = await query
        if (error) throw error

        let sent = 0
        let failed = 0

        for (const profile of profiles || []) {
            const notifications = profile.settings?.notifications || {}
            if (!notifications.email || !profile.email) continue

            let shouldSend = false
            if (type === 'major_activity' && notifications.communityUpdates) shouldSend = true
            if (type === 'course_reminder' && notifications.courseReminders) shouldSend = true
            if (type === 'marketing' && notifications.marketingEmails) shouldSend = true

            if (!shouldSend) continue

            try {
                await sendEmail(profile.email, subject, html)
                sent++
            } catch {
                failed++
            }
        }

        return new Response(JSON.stringify({ success: true, sent_count: sent, failed_count: failed }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        })

    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        })
    }
})
