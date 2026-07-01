import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
    type: 'major_activity' | 'course_reminder' | 'marketing';
    subject: string;
    html: string;
    target_user_id?: string; // If null, send to all opted-in users (use with caution)
}

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
        const { type, subject, html, target_user_id } = await req.json() as EmailRequest;

        let query = supabase.from("profiles_la2024").select("id, settings, auth_user:id(email)");

        if (target_user_id) {
            query = query.eq("id", target_user_id);
        }

        const { data: profiles, error } = await query;

        if (error) throw error;

        const emailsToSend: any[] = [];

        for (const profile of profiles || []) {
            const settings = profile.settings || {};
            const notifications = settings.notifications || {};
            const email = profile.auth_user?.email;

            // Check generic email notification setting
            if (!notifications.email || !email) continue;

            // Check specific category setting
            let shouldSend = false;
            if (type === 'major_activity' && notifications.communityUpdates) shouldSend = true;
            if (type === 'course_reminder' && notifications.courseReminders) shouldSend = true;
            if (type === 'marketing' && notifications.marketingEmails) shouldSend = true;

            if (shouldSend) {
                emailsToSend.push({
                    from: "Lilian Coaching <onboarding@resend.dev>", // Replace with verified domain
                    to: [email],
                    subject: subject,
                    html: html,
                });
            }
        }

        // Send emails (using Resend Batch or Loop)
        // For simplicity in this demo, sending individually in a loop (Batch is better for prod)
        const results = [];
        for (const mail of emailsToSend) {
            const res = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${RESEND_API_KEY}`,
                },
                body: JSON.stringify(mail),
            });
            results.push(await res.json());
        }

        return new Response(JSON.stringify({ success: true, sent_count: results.length }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        });
    }
});
