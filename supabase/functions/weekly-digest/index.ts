import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

        // 1. Fetch data for the digest (e.g., new courses, trending posts)
        // This is simple mock logic to demonstrate the structure
        const { data: newCourses } = await supabase
            .from('courses_la2024')
            .select('title')
            .order('created_at', { ascending: false })
            .limit(2);

        const { data: trendingPosts } = await supabase
            .from('community_posts_la2024')
            .select('title')
            .order('likes_count', { ascending: false })
            .limit(3);

        const digestHtml = `
      <h1>Your Weekly Roundup</h1>
      <h2>New Courses</h2>
      <ul>${newCourses?.map(c => `<li>${c.title}</li>`).join('') || '<li>No new courses this week.</li>'}</ul>
      <h2>Trending Discussions</h2>
      <ul>${trendingPosts?.map(p => `<li>${p.title}</li>`).join('') || '<li>Quiet week in the community.</li>'}</ul>
    `;

        // 2. Fetch users enabled for Weekly Digest
        const { data: profiles, error } = await supabase
            .from("profiles_la2024")
            .select("id, settings, auth_user:id(email)");

        if (error) throw error;

        const emailsToSend: any[] = [];

        for (const profile of profiles || []) {
            const settings = profile.settings || {};
            const notifications = settings.notifications || {};
            const email = profile.auth_user?.email;

            // Check generic email setting AND weekly digest setting
            if (notifications.email && notifications.weeklyDigest && email) {
                emailsToSend.push({
                    from: "Lilian Coaching <onboarding@resend.dev>",
                    to: [email],
                    subject: "Your Weekly Growth Digest",
                    html: digestHtml,
                });
            }
        }

        // 3. Send Emails
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
