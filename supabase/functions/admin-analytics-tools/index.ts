import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { action } = await req.json()

        // Initialize Supabase Client using environment keys
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
        const supabase = createClient(supabaseUrl, supabaseKey);

        let message = ''
        let result = {}

        switch (action) {
            case 'report-generator': {
                // Fetch actual counts from tables
                const { count: contactsCount } = await supabase.from('contact_messages_la2024').select('*', { count: 'exact', head: true });
                const { count: subscribersCount } = await supabase.from('newsletter_subscribers_la2024').select('*', { count: 'exact', head: true });
                const { count: bookingsCount } = await supabase.from('bookings_la2024').select('*', { count: 'exact', head: true });
                const { count: usersCount } = await supabase.from('profiles_la2024').select('*', { count: 'exact', head: true });

                // Construct real CSV report
                const csvLines = [
                    'Metric,Value',
                    `Total Platform Users,${usersCount || 0}`,
                    `Total Consultation Bookings,${bookingsCount || 0}`,
                    `Total Contact Messages,${contactsCount || 0}`,
                    `Total Newsletter Subscribers,${subscribersCount || 0}`,
                    `Generated At,${new Date().toISOString()}`
                ];
                
                const csvContent = csvLines.join('\n');
                const base64Csv = btoa(csvContent);
                const downloadUrl = `data:text/csv;base64,${base64Csv}`;

                message = 'Real-time analytics report generated successfully.'
                result = { report_id: `rpt_${Date.now()}`, url: downloadUrl }
                break
            }

            case 'data-exporter': {
                // Export real user database profiles
                const { data: users } = await supabase
                    .from('profiles_la2024')
                    .select('first_name, last_name, email, membership_tier, created_at');

                const csvLines = ['First Name,Last Name,Email,Tier,Joined Date'];
                users?.forEach(u => {
                    csvLines.push(`"${u.first_name || ''}","${u.last_name || ''}","${u.email || ''}","${u.membership_tier || ''}","${u.created_at || ''}"`);
                });

                const csvContent = csvLines.join('\n');
                const base64Csv = btoa(csvContent);
                const downloadUrl = `data:text/csv;base64,${base64Csv}`;

                message = `Successfully exported ${users?.length || 0} user records.`
                result = { rows: users?.length || 0, format: 'csv', url: downloadUrl }
                break
            }

            case 'trend-analyzer': {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                const { count: newUsers } = await supabase
                    .from('profiles_la2024')
                    .select('*', { count: 'exact', head: true })
                    .gt('created_at', thirtyDaysAgo.toISOString());

                const { count: totalUsers } = await supabase
                    .from('profiles_la2024')
                    .select('*', { count: 'exact', head: true });

                const growth = totalUsers && totalUsers > 0 ? Math.round(((newUsers || 0) / totalUsers) * 100) : 0;

                message = `Trend analysis complete: ${growth}% user growth over the last 30 days.`
                result = { growth, period: 'last_30_days', new_signups: newUsers || 0 }
                break
            }

            case 'performance-tracker': {
                const { count: totalUsers } = await supabase.from('profiles_la2024').select('*', { count: 'exact', head: true });
                const { count: totalBookings } = await supabase.from('bookings_la2024').select('*', { count: 'exact', head: true });

                message = 'Performance metrics successfully calculated.'
                result = { active_users: totalUsers || 0, total_bookings: totalBookings || 0, database_status: 'healthy' }
                break
            }

            default:
                throw new Error(`Unknown action: ${action}`)
        }

        return new Response(
            JSON.stringify({ success: true, message, data: result }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200, // Return 200 so the client can inspect the JSON payload
            }
        )
    }
})
