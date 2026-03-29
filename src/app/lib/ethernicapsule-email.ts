import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const emailStyle = `
  body { margin: 0; padding: 0; background-color: #060504; font-family: 'Cormorant Garamond', 'Georgia', serif; -webkit-font-smoothing: antialiased; }
  .canvas { padding: 40px 10px; background-color: #060504; text-align: center; }
  .wrapper { width: 100%; max-width: 560px; margin: 0 auto; padding: 48px 40px; background-color: #0A0806; border: 1px solid rgba(196, 168, 130, 0.15); text-align: center; }
  .logo { font-family: monospace; font-size: 11px; letter-spacing: 0.4em; color: #C4A882; margin-bottom: 40px; }
  .title { font-size: 24px; font-style: italic; color: #E8D9BB; margin: 0 0 30px; font-weight: normal; }
  .text { font-family: 'Georgia', serif; font-size: 15px; line-height: 1.8; color: #AAAAAA; margin-bottom: 30px; }
  .link { color: #C4A882; text-decoration: none; }
  .key-box-wrapper { margin: 40px auto; max-width: 400px; text-align: center; }
  .key-label { font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; color: #7A6A55; margin-bottom: 15px; }
  .key-box { border: 1px solid rgba(196, 168, 130, 0.25); background-color: #0F0C09; padding: 20px; display: inline-block; min-width: 250px; text-align: center; }
  .key-value { font-family: monospace; font-size: 18px; color: #C4A882; letter-spacing: 0.1em; font-weight: normal; margin: 0; }
  .btn { display: inline-block; padding: 14px 28px; color: #0A0806; background-color: #C4A882; text-decoration: none; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; transition: background-color 0.3s; margin-top: 10px; }
  .footer { margin-top: 60px; font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(122, 106, 85, 0.5); }
`;

export async function sendCreatorEmail(opts: { to: string, senderKey: string, capsuleKey?: string, siteUrl: string }) {
  if (!resend) return false;
  
  const hasCapsuleKey = !!opts.capsuleKey;
  const capsuleKeyHtml = hasCapsuleKey ? `
    <div class="key-box-wrapper">
      <div class="key-label">Capsule Key</div>
      <div class="key-box">
        <p class="key-value">${opts.capsuleKey}</p>
      </div>
      <p style="font-family: 'Georgia', serif; font-size: 13px; color: #7A6A55; margin-top: 15px; font-style: italic;">Pass this key when the time comes.</p>
    </div>
  ` : '';

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head><style>${emailStyle}</style></head>
    <body>
      <div class="canvas">
        <div class="wrapper">
          <div class="logo">&middot; E T E R N I C A P S U L E &middot;</div>
          <h1 class="title">Your capsule has been sealed.</h1>
          <p class="text">Something has been preserved.<br>Your letter exists beyond this moment.</p>
          
          <div class="key-box-wrapper">
            <div class="key-label">Sender Key</div>
            <div class="key-box">
              <p class="key-value">${opts.senderKey}</p>
            </div>
          </div>
          
          <a href="${opts.siteUrl}/ethernicapsule/preview" class="btn">View your letter</a>
          
          ${capsuleKeyHtml}
          
          <div class="footer">EterniCapsule &middot; Pyadra</div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: 'EterniCapsule <ethernicapsule@pyadra.io>',
      to: [opts.to],
      subject: 'Your capsule has been sealed · EterniCapsule',
      html,
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function sendGuardianAwarenessEmail(opts: { to: string[], senderFirstName: string }) {
  if (!resend) return false;
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head><style>${emailStyle}</style></head>
    <body>
      <div class="canvas">
        <div class="wrapper">
          <div class="logo">&middot; E T E R N I C A P S U L E &middot;</div>
          <h1 class="title">You have been entrusted with something.</h1>
          <p class="text">${opts.senderFirstName} has sealed something and placed it in your care.</p>
          <p class="text">A separate message is on its way with everything you need.<br>When the time comes — you will know what to do.</p>
          <div class="footer">EterniCapsule &middot; Pyadra</div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: 'EterniCapsule <ethernicapsule@pyadra.io>',
      to: opts.to,
      subject: 'You have been entrusted with something · EterniCapsule',
      html,
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function sendGuardianKeyEmail(opts: { to: string[], capsuleKey: string, siteUrl: string }) {
  if (!resend) return false;
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head><style>${emailStyle}</style></head>
    <body>
      <div class="canvas">
        <div class="wrapper">
          <div class="logo">&middot; E T E R N I C A P S U L E &middot;</div>
          <h1 class="title">Your key</h1>
          
          <div class="key-box-wrapper">
            <div class="key-label">Capsule Key</div>
            <div class="key-box">
              <p class="key-value">${opts.capsuleKey}</p>
            </div>
          </div>
          
          <p class="text" style="font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #C4A882; margin-bottom: 30px;">
            <a href="${opts.siteUrl}/ethernicapsule/unlock" class="link">pyadra.io/ethernicapsule/unlock</a>
          </p>
          
          <p class="text">When the time is right, pass this key to the person it was written for — or use it yourself.</p>
          
          <div class="footer">EterniCapsule &middot; Pyadra</div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: 'EterniCapsule <ethernicapsule@pyadra.io>',
      to: opts.to,
      subject: 'Your key · EterniCapsule',
      html,
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
