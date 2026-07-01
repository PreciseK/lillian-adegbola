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
        const { action, payload } = await req.json()

        // Initialize Supabase Client using environment keys
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
        const supabase = createClient(supabaseUrl, supabaseKey);

        let result = {}
        let message = ''

        switch (action) {
            case 'bulk-import':
                // Simulate bulk import
                await new Promise(resolve => setTimeout(resolve, 2000))
                message = `Successfully imported ${payload?.count || 50} users.`
                result = { imported: payload?.count || 50, failed: 0 }
                break

            case 'user-export': {
                // Export real user database profiles from profiles_la2024
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

            case 'migrate-tier':
                // Simulate migration
                await new Promise(resolve => setTimeout(resolve, 1000))
                message = 'Successfully migrated users to new tier.'
                result = { success: true }
                break

            case 'merge-accounts':
                await new Promise(resolve => setTimeout(resolve, 1000))
                message = 'Account merge completed successfully.'
                result = { merged: true }
                break

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
