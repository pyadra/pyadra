import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { sanitizeString } from '@/app/lib/validation';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Sanitize everything — these strings are interpolated into the
    // notification email's HTML, so raw input means HTML injection.
    const type = sanitizeString(body.type, 50);
    const project = sanitizeString(body.project, 100);
    const model = sanitizeString(body.model, 100);
    const name = sanitizeString(body.name, 100);
    const email = sanitizeString(body.email, 150);
    const message = sanitizeString(body.message, 2000);

    // Validation
    if (!name || !email || !project || !model) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    if (!resend) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Build email content based on type
    const emailContent = buildEmailContent({ type, project, model, name, email, message });

    // Send notification to the Pyadra inbox
    const { error } = await resend.emails.send({
      from: 'Pyadra Contact <contact@pyadra.io>',
      to: ['pyadra@pyadra.io'],
      subject: emailContent.subject,
      html: emailContent.html,
      replyTo: email,
    });

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function buildEmailContent({ type, project, model, name, email, message }: {
  type: string;
  project: string;
  model: string;
  name: string;
  email: string;
  message: string;
}) {
  if (type === 'express-interest') {
    return {
      subject: `Galaxy Interest: ${project} — ${model}`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Galaxy Express Interest</title>
    <style>
        body { margin: 0; padding: 0; background-color: #EDEFED; color: #1A1C1A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        .wrapper { width: 100%; max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #059669; padding-bottom: 20px; }
        .title { font-family: Georgia, serif; font-size: 28px; font-style: italic; color: #1A1C1A; margin: 0; font-weight: 300; }
        .eyebrow { font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; color: #059669; margin-bottom: 10px; font-weight: bold; }
        .card { background-color: #FFFFFF; border: 2px solid #D4DDD6; border-left: 8px solid #059669; border-radius: 16px; padding: 30px; margin-bottom: 20px; }
        .row { margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #EDEFED; }
        .row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .label { font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #6B8070; display: block; margin-bottom: 4px; }
        .value { font-size: 16px; color: #1A1C1A; font-weight: 500; }
        .value.highlight { color: #059669; font-weight: 600; }
        .message-box { background-color: #F9FAFB; border: 1px solid #D4DDD6; border-radius: 8px; padding: 16px; margin-top: 20px; font-size: 14px; line-height: 1.6; color: #3A4A3E; }
        .footer { text-align: center; font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #6B8070; padding-top: 30px; border-top: 1px solid #D4DDD6; margin-top: 40px; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <div class="eyebrow">• GALAXY EXPRESS INTEREST</div>
            <h1 class="title">New Acquisition Interest</h1>
        </div>

        <div class="card">
            <div class="row">
                <div class="label">Project</div>
                <div class="value highlight">${project}</div>
            </div>
            <div class="row">
                <div class="label">Acquisition Model</div>
                <div class="value highlight">${model}</div>
            </div>
            <div class="row">
                <div class="label">Name</div>
                <div class="value">${name}</div>
            </div>
            <div class="row">
                <div class="label">Email</div>
                <div class="value">${email}</div>
            </div>
            ${message ? `
            <div class="row">
                <div class="label">Message</div>
                <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
            </div>
            ` : ''}
        </div>

        <div class="footer">
            PYADRA · GALAXY EXHIBITION<br>
            Sent from pyadra.io/exhibitions/galaxy
        </div>
    </div>
</body>
</html>
      `,
    };
  }

  // Fallback for other contact types
  return {
    subject: `Pyadra Contact: ${type}`,
    html: `<p><strong>Type:</strong> ${type}</p><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message || 'N/A'}</p>`,
  };
}
