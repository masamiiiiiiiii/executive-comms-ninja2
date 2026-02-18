import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AccessNotificationRequest {
  name: string;
  email: string;
  type: 'request' | 'approval' | 'rejection';
  accessUrl?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, type, accessUrl }: AccessNotificationRequest = await req.json();

    let emailResponse;

    switch (type) {
      case 'request':
        // Send notification to admin
        emailResponse = await resend.emails.send({
          from: "Executive Comms Ninja <onboarding@resend.dev>",
          to: ["mkito@ap.equinix.com"],
          subject: "新しいアクセス申請",
          html: `
            <h2>新しいアクセス申請が届きました</h2>
            <p><strong>申請者名:</strong> ${name}</p>
            <p><strong>メールアドレス:</strong> ${email}</p>
            <p><strong>申請日時:</strong> ${new Date().toLocaleString('ja-JP')}</p>
            
            <p>管理画面でアクセス申請を確認・承認してください。</p>
            
            <hr>
            <p><small>Executive Comms Ninja - アクセス管理システム</small></p>
          `,
        });
        break;

      case 'approval':
        // Send approval notification to user
        emailResponse = await resend.emails.send({
          from: "Executive Comms Ninja <onboarding@resend.dev>",
          to: [email],
          subject: "アクセス申請が承認されました",
          html: `
            <h2>アクセス申請が承認されました</h2>
            <p>${name}様</p>
            
            <p>Executive Comms Ninjaへのアクセス申請が承認されました。</p>
            
            <p><strong>アクセス期間:</strong> 1ヶ月間</p>
            <p><strong>アクセスURL:</strong> <a href="${accessUrl}" target="_blank">こちらからアクセス</a></p>
            
            <p>アクセス期間が終了する前に、必要に応じて延長申請をお願いいたします。</p>
            
            <hr>
            <p><small>Executive Comms Ninja - アクセス管理システム</small></p>
          `,
        });
        break;

      case 'rejection':
        // Send rejection notification to user
        emailResponse = await resend.emails.send({
          from: "Executive Comms Ninja <onboarding@resend.dev>",
          to: [email],
          subject: "アクセス申請について",
          html: `
            <h2>アクセス申請について</h2>
            <p>${name}様</p>
            
            <p>Executive Comms Ninjaへのアクセス申請を検討いたしましたが、現在はアクセスを許可することができません。</p>
            
            <p>ご質問がございましたら、mkito@ap.equinix.comまでお問い合わせください。</p>
            
            <hr>
            <p><small>Executive Comms Ninja - アクセス管理システム</small></p>
          `,
        });
        break;

      default:
        throw new Error("Invalid notification type");
    }

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-access-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);