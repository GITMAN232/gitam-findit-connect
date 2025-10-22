import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  user_id: string;
  type: 'submission_approved' | 'submission_rejected' | 'claim_approved' | 'claim_rejected';
  item_name: string;
  additional_info?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { user_id, type, item_name, additional_info }: NotificationRequest = await req.json();

    // Create notification messages
    let title = '';
    let message = '';

    switch (type) {
      case 'submission_approved':
        title = 'Item Approved! 🎉';
        message = `Your ${item_name} listing has been approved and is now live!`;
        break;
      case 'submission_rejected':
        title = 'Submission Update';
        message = `Your ${item_name} submission was not approved. ${additional_info || ''}`;
        break;
      case 'claim_approved':
        title = 'Claim Approved! ✅';
        message = `Your claim for "${item_name}" has been approved! ${additional_info || ''}`;
        break;
      case 'claim_rejected':
        title = 'Claim Update';
        message = `Your claim for "${item_name}" was not approved. ${additional_info || ''}`;
        break;
    }

    // Insert notification into database
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id,
        title,
        message,
        type,
      });

    if (notificationError) {
      throw notificationError;
    }

    console.log('Notification created successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error sending notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
