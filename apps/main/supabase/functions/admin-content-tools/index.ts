import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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

        let message = ''
        let result = {}

        switch (action) {
            case 'content-duplicator':
                await new Promise(resolve => setTimeout(resolve, 1500))
                message = 'Content duplicated successfully.'
                result = { id: crypto.randomUUID(), type: 'copy' }
                break

            case 'bulk-edit':
                await new Promise(resolve => setTimeout(resolve, 2000))
                message = 'Bulk edits applied to 12 items.'
                result = { updated: 12 }
                break

            case 'seo-optimize':
                await new Promise(resolve => setTimeout(resolve, 3000))
                message = 'SEO optimization complete. Score improved by 15%.'
                result = { score: 92, improvement: '+15%' }
                break

            case 'archive-content':
                await new Promise(resolve => setTimeout(resolve, 1000))
                message = 'Selected content has been archived.'
                result = { archived: true }
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
                status: 400,
            }
        )
    }
})
