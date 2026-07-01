import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ================================================================
// Shared SMTP sender – reads credentials from Supabase Secrets:
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM_NAME
// ================================================================
async function sendEmail(to: string, subject: string, html: string) {
    const smtpHost = Deno.env.get('SMTP_HOST')
    const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '465')
    const smtpUser = Deno.env.get('SMTP_USER')
    const smtpPass = Deno.env.get('SMTP_PASS')
    const fromName = Deno.env.get('SMTP_FROM_NAME') || 'Lillian Adegbola'

    if (!smtpHost || !smtpUser || !smtpPass) {
        throw new Error('SMTP credentials not configured in Supabase Secrets (SMTP_HOST, SMTP_USER, SMTP_PASS).')
    }

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
        from: `${fromName} <${smtpUser}>`,
        to: to,
        subject: subject,
        content: "auto",
        html: html,
    })

    await client.close()
}

interface EmailRequest {
    type: 'major_activity' | 'course_reminder' | 'marketing' | 'direct';
    subject: string;
    html: string;
    target_user_id?: string;
    to?: string; // For direct single-recipient sends
}

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
        const { type, subject, html, target_user_id, to } = await req.json() as EmailRequest;

        // Direct single-recipient email (e.g. contact form reply)
        if (type === 'direct' && to) {
            await sendEmail(to, subject, html)
            return new Response(JSON.stringify({ success: true, sent_count: 1 }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            });
        }

        // Broadcast to opted-in users
        let query = supabase.from("profiles_la2024").select("email, first_name, settings");

        if (target_user_id) {
            query = query.eq("id", target_user_id);
        }

        const { data: profiles, error } = await query;
        if (error) throw error;

        let sent = 0;
        let failed = 0;

        for (const profile of profiles || []) {
            const notifications = profile.settings?.notifications || {};

            // Respect per-user notification preferences
            if (!notifications.email || !profile.email) continue;

            let shouldSend = false;
            if (type === 'major_activity' && notifications.communityUpdates) shouldSend = true;
            if (type === 'course_reminder' && notifications.courseReminders) shouldSend = true;
            if (type === 'marketing' && notifications.marketingEmails) shouldSend = true;

            if (!shouldSend) continue;

            try {
                await sendEmail(profile.email, subject, html)
                sent++;
            } catch {
                failed++;
            }
        }

        return new Response(JSON.stringify({ success: true, sent_count: sent, failed_count: failed }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    }
});
