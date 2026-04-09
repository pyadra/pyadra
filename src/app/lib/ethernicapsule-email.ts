import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const emailStyle = `
  body { margin: 0; padding: 0; background-color: #02040A; font-family: 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; }
  .canvas { padding: 40px 10px; background-color: #02040A; text-align: center; }
  .wrapper { width: 100%; max-width: 560px; margin: 0 auto; padding: 60px 40px; background-color: #05060A; border: 1px solid rgba(196, 168, 130, 0.2); text-align: center; border-radius: 4px; box-shadow: 0 20px 40px rgba(0,0,0,0.8); }
  .logo { font-family: monospace; font-size: 10px; letter-spacing: 0.5em; color: #7A6A55; margin-bottom: 50px; text-transform: uppercase; border-bottom: 1px solid rgba(196, 168, 130, 0.1); padding-bottom: 20px; }
  .title { font-size: 30px; font-style: italic; color: #E8D9BB; margin: 0 0 20px; font-weight: 300; font-family: 'Georgia', serif; }
  .text { font-family: 'Helvetica Neue', sans-serif; font-weight: 300; font-size: 14px; line-height: 2; color: rgba(232, 217, 187, 0.6); margin-bottom: 40px; }
  .link { color: #C4A882; text-decoration: none; border-bottom: 1px solid rgba(196, 168, 130, 0.3); }
  .key-box-wrapper { margin: 40px auto; max-width: 400px; text-align: center; background: #02040A; padding: 30px 20px; border: 1px solid rgba(196, 168, 130, 0.15); border-radius: 2px; }
  .key-label { font-family: monospace; font-size: 9px; text-transform: uppercase; letter-spacing: 0.4em; color: #7A6A55; margin-bottom: 20px; }
  .key-value { font-family: monospace; font-size: 16px; color: #C4A882; letter-spacing: 0.15em; font-weight: 400; margin: 0; padding: 15px; background: rgba(196, 168, 130, 0.05); border: 1px dashed rgba(196, 168, 130, 0.3); word-break: break-all; }
  .btn { display: inline-block; padding: 16px 32px; color: #02040A; background-color: #C4A882; text-decoration: none; font-family: monospace; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.3em; transition: all 0.5s; margin-top: 20px; border-radius: 2px; }
  .footer { margin-top: 70px; font-family: monospace; font-size: 9px; text-transform: uppercase; letter-spacing: 0.3em; color: rgba(122, 106, 85, 0.4); border-top: 1px solid rgba(196, 168, 130, 0.1); padding-top: 30px; }
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
          <h1 class="title">The Seal is Cast.</h1>
          <p class="text">Your words have been stripped from the present and locked into the dark. They are safe. This exact cryptographic ledger serves as your receipt.</p>
          
          <div class="key-box-wrapper">
            <div class="key-label">Sender Key</div>
            <div class="key-box">
              <p class="key-value">${opts.senderKey}</p>
            </div>
          </div>
          
          <a href="${opts.siteUrl}/exhibitions/galaxy/ethernicapsule/preview" class="btn">ACCESS THE VAULT</a>
          
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

export async function sendGuardianMasterEmail(opts: { to: string[], senderFirstName: string, capsuleKey: string, siteUrl: string }) {
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
          <p class="text">${opts.senderFirstName} has sealed a silent letter and placed it in your care.</p>
          
          <div class="key-box-wrapper" style="margin-top: 50px;">
            <div class="key-label">Capsule Key</div>
            <div class="key-box">
              <p class="key-value">${opts.capsuleKey}</p>
            </div>
          </div>
          
          <a href="${opts.siteUrl}/exhibitions/galaxy/ethernicapsule/unlock" class="btn" style="margin: 30px 0;">ACCESS CAPSULE</a>
          
          <p class="text" style="font-size: 14px; margin-top: 40px; color: #7A6A55;">When the time is right, pass this key to the person it was written for — or use it yourself.</p>
          
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
      subject: 'You have been entrusted with a key · EterniCapsule',
      html,
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function sendGuardianTimeVaultEmail(opts: { to: string[], senderFirstName: string, deliverAtDateStr: string, guardianToken: string, siteUrl: string }) {
  if (!resend) return false;

  const accessUrl = `${opts.siteUrl}/exhibitions/galaxy/ethernicapsule/guardian?token=${opts.guardianToken}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head><style>${emailStyle}</style></head>
    <body>
      <div class="canvas">
        <div class="wrapper">
          <div class="logo">&middot; E T E R N I C A P S U L E &middot;</div>
          <h1 class="title">You have been entrusted with something.</h1>
          <p class="text">${opts.senderFirstName} has sealed a silent letter and placed it in your care.</p>
          <p class="text">However, it cannot be opened yet.</p>
          <p class="text" style="color: #C4A882; font-style: italic;">The seal will remain cryptographically locked until ${opts.deliverAtDateStr}.</p>
          <p class="text">When that day arrives, return to this link to receive the key:</p>

          <a href="${accessUrl}" class="btn" style="margin: 30px 0;">ACCESS CAPSULE</a>

          <p class="text" style="font-size: 13px; color: #7A6A55; margin-top: 30px;">This link is personal and secure. Save this email.</p>

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
