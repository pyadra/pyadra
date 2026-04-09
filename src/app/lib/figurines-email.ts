import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;
const founderEmail = process.env.FIGURINES_NOTIFY_EMAIL || 'pyadra@pyadra.io';
const defaultFrom = 'Pyadra <transmission@pyadra.io>'; // Uses the verified domain

interface CustomerEmailProps {
  to: string;
  customerName: string;
}

export async function sendFigurineCustomerEmail({ to, customerName }: CustomerEmailProps) {
  if (!resend) {
    console.warn("Resend API key missing. Email intercept bypassed.");
    return false;
  }

  const html = `
    <div style="background-color: #02040A; color: #E8D9BB; padding: 60px 40px; font-family: sans-serif; text-align: center; max-width: 600px; margin: 0 auto; border: 1px solid rgba(196,168,130,0.2);">
      <h1 style="font-family: serif; font-style: italic; font-size: 32px; color: #E8D9BB; margin-bottom: 40px; font-weight: 300;">
        Your likness is being cast.
      </h1>
      
      <p style="color: rgba(232,217,187,0.7); font-size: 16px; line-height: 1.8; max-width: 400px; margin: 0 auto 30px;">
        ${customerName}, the geometry has been securely delivered to the Pyadra furnace.<br/><br/>
        The Neural Engine is currently mapping your form. A physical 3D cast will be printed, hand-cured, and painted.
      </p>

      <div style="border-top: 1px solid rgba(196,168,130,0.2); border-bottom: 1px solid rgba(196,168,130,0.2); padding: 20px 0; margin: 40px auto; max-width: 300px;">
        <p style="font-family: monospace; font-size: 11px; letter-spacing: 0.3em; color: #C4A882; margin: 0; text-transform: uppercase;">
          Expected Materialization<br/><span style="color: #E8D9BB; font-size: 14px; margin-top: 10px; display: block;">7 to 14 Cycles</span>
        </p>
      </div>

      <p style="color: rgba(232,217,187,0.4); font-size: 13px; line-height: 1.8; margin-top: 40px; max-width: 400px; margin-left: auto; margin-right: auto;">
        You will receive a final transmission once the artifact has entered the shipping network. Until then, the forge burns.
      </p>
      
      <div style="margin-top: 60px;">
        <span style="font-family: monospace; font-size: 10px; letter-spacing: 0.3em; color: rgba(196,168,130,0.3); text-transform: uppercase;">Pyadra Node 03</span>
      </div>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: defaultFrom,
      to,
      subject: "Pyadra — Protocol Engaged: Likeness Received",
      html,
    });

    if (error) {
      console.error("Resend delivery failed:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Resend API exception:", err);
    return false;
  }
}

interface FounderEmailProps {
  orderId: string;
  customerName: string;
  customerEmail: string;
  address: string;
  tier: string;
  photoUrls: string[];
}

export async function sendFigurineFounderEmail(data: FounderEmailProps) {
  if (!resend) return false;

  const filesHtml = data.photoUrls.map(url => `
    <a href="${url}" style="display: block; color: #C4A882; text-decoration: none; margin-bottom: 10px; font-family: monospace;">[ VIEW CAPTURE ]</a>
  `).join('');

  const html = `
    <div style="background-color: #02040A; color: #F5F0E6; padding: 40px; font-family: monospace; max-width: 600px; border-left: 4px solid #C4A882;">
      <h2 style="color: #C4A882; text-transform: uppercase; margin-bottom: 30px;">[ INTERNAL ] NEW ARTIFACT COMMISSION</h2>
      
      <p style="color: #E8D9BB; margin-bottom: 10px;"><strong>Order ID:</strong> ${data.orderId}</p>
      <p style="color: #E8D9BB; margin-bottom: 10px;"><strong>Tier:</strong> ${data.tier}</p>
      <p style="color: #E8D9BB; margin-bottom: 10px;"><strong>Subject:</strong> ${data.customerName}</p>
      <p style="color: #E8D9BB; margin-bottom: 30px;"><strong>Email:</strong> ${data.customerEmail}</p>
      
      <h3 style="color: #7A6A55; border-bottom: 1px solid #7A6A55; padding-bottom: 5px; margin-top: 30px;">DESTINATION</h3>
      <p style="white-space: pre-wrap; color: #E8D9BB;">${data.address}</p>

      <h3 style="color: #7A6A55; border-bottom: 1px solid #7A6A55; padding-bottom: 5px; margin-top: 40px;">GEOMETRY DATA</h3>
      ${filesHtml}
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: defaultFrom,
      to: founderEmail,
      subject: `[ACTION REQUIRED] New Figurine Order - ${data.customerName}`,
      html,
    });
    return !error;
  } catch (err) {
    console.error("Resend API exception:", err);
    return false;
  }
}
