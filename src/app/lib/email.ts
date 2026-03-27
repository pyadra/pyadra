import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface EmailPayload {
  to: string;
  supporterName: string;
  amountAud: number;
  credentialCode: string;
  seasonLabel: string;
  dateStr: string;
}

export async function sendCredentialEmail(payload: EmailPayload) {
  if (!resend) {
    console.warn("RESEND_API_KEY is not defined. Email will not be sent.");
    return false;
  }

  // Fallback name if anonymous
  const displayName = payload.supporterName || "Anonymous";
  const { to, amountAud, credentialCode, seasonLabel, dateStr } = payload;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Orbit 77 — Season Credential</title>
    <style>
        body { margin: 0; padding: 0; background-color: #020503; color: #F4EFEA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #020503; }
        ::-moz-selection { background: rgba(57, 255, 20, 0.2); }
        ::selection { background: rgba(57, 255, 20, 0.2); }
        .header { text-align: center; margin-bottom: 40px; }
        .indicator { width: 6px; height: 6px; background-color: #39FF14; border-radius: 50%; display: inline-block; margin-right: 8px; vertical-align: middle; }
        .eyebrow { font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3em; color: #39FF14; text-align: center; font-weight: bold; margin-bottom: 20px; }
        .title { font-family: Georgia, serif; font-size: 32px; font-style: italic; color: #F4EFEA; margin: 0 0 30px; text-align: center; font-weight: normal; }
        .paragraph { font-size: 14px; line-height: 1.6; color: rgba(174, 255, 161, 0.8); font-weight: 300; text-align: center; margin-bottom: 40px; }
        
        .card { border: 1px solid rgba(57, 255, 20, 0.3); border-radius: 12px; background-color: #050A07; padding: 30px; margin-bottom: 40px; }
        
        .row { display: table; width: 100%; margin-bottom: 16px; border-bottom: 1px solid rgba(57, 255, 20, 0.1); padding-bottom: 12px; }
        .row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .label { display: table-cell; font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(174, 255, 161, 0.5); width: 40%; vertical-align: middle; }
        .value { display: table-cell; font-family: monospace; font-size: 12px; color: #F4EFEA; width: 60%; vertical-align: middle; text-align: right; }
        .value.highlight { color: #39FF14; font-weight: bold; }
        
        .btn-wrapper { text-align: center; margin-bottom: 50px; }
        .btn { display: inline-block; padding: 16px 32px; background-color: #39FF14; color: #060B08; text-decoration: none; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: bold; border-radius: 6px; }
        
        .footer { text-align: center; font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(174, 255, 161, 0.3); padding-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.05); }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="eyebrow"><span class="indicator"></span> O R B I T &nbsp; 7 7</div>
        <h1 class="title">Transmission Record</h1>
        
        <p class="paragraph">
            The signal has been received. This credential verifies your support for Orbit 77. It is permanently recorded in the archive. 
        </p>
        
        <div class="card">
            <div class="row">
                <div class="label">Display Name</div>
                <div class="value">${displayName}</div>
            </div>
            <div class="row">
                <div class="label">Credential Code</div>
                <div class="value highlight">${credentialCode}</div>
            </div>
            <div class="row">
                <div class="label">Season Reference</div>
                <div class="value">${seasonLabel}</div>
            </div>
            <div class="row">
                <div class="label">Support Amount</div>
                <div class="value">$${amountAud} AUD</div>
            </div>
            <div class="row">
                <div class="label">Date of Issue</div>
                <div class="value">${dateStr}</div>
            </div>
        </div>
        
        <div class="btn-wrapper">
            <a href="https://pyadra.io/transmission-confirmed?session_id=verified&code=${credentialCode}" class="btn">View Digital Credential</a>
        </div>
        
        <div class="footer">
            Orbit 77 — A Pyadra Ecosystem Project<br><br>
            © 2026 Pyadra
        </div>
    </div>
</body>
</html>
  `;

  try {
    const { error } = await resend.emails.send({
      from: 'Orbit 77 <transmit@pyadra.io>', // ensure you have verified your domain on resend
      to: [to],
      subject: `Orbit 77 — Credential ${credentialCode}`,
      html: html,
    });

    if (error) {
      console.error('Resend Error:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}
