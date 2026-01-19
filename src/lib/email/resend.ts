interface ResendConfig {
  apiKey: string
  fromEmail: string
  fromName: string
}

interface SendEmailResult {
  success: boolean
  id?: string
  error?: string
}

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

// Get Resend configuration from environment
function getResendConfig(): ResendConfig {
  return {
    apiKey: process.env.RESEND_API_KEY || '',
    fromEmail: process.env.RESEND_FROM_EMAIL || 'noreply@schoolofmembers.com',
    fromName: process.env.RESEND_FROM_NAME || 'School of Members',
  }
}

// Check if Resend is configured
export function isResendConfigured(): boolean {
  const config = getResendConfig()
  return !!config.apiKey
}

/**
 * Send email via Resend API
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<SendEmailResult> {
  const config = getResendConfig()

  if (!config.apiKey) {
    console.warn('Resend is not configured. Email not sent.')
    return {
      success: false,
      error: 'Email service is not configured',
    }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        from: `${config.fromName} <${config.fromEmail}>`,
        to: [to],
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''),
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Resend email error:', data)
      return {
        success: false,
        error: data.message || 'Failed to send email',
      }
    }

    return {
      success: true,
      id: data.id,
    }
  } catch (error) {
    console.error('Email send error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Email templates
 */
export const EMAIL_TEMPLATES = {
  welcome: (fullName: string, pin: string): EmailTemplate => ({
    subject: 'Welcome to School of Members - Your Login PIN',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(to right, #003366, #b5985b, #C8102E); height: 4px; border-radius: 2px;"></div>

          <div style="padding: 30px 20px; text-align: center;">
            <h1 style="color: #003366; margin-bottom: 10px;">Welcome to School of Members!</h1>
            <p style="color: #64748b; font-size: 16px;">Dear ${fullName},</p>
          </div>

          <div style="background: #f8fafc; border-radius: 12px; padding: 30px; text-align: center; margin: 20px 0;">
            <p style="color: #64748b; margin-bottom: 15px;">Your login PIN is:</p>
            <div style="background: #003366; color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px 40px; border-radius: 8px; display: inline-block;">
              ${pin}
            </div>
            <p style="color: #C8102E; font-size: 14px; margin-top: 15px;">
              Keep this PIN safe. You'll need it to login.
            </p>
          </div>

          <div style="padding: 20px; text-align: center;">
            <p style="color: #64748b;">You can now login to start your learning journey.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://school-of-members.vercel.app'}/student/login"
               style="display: inline-block; background: #003366; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 15px;">
              Login Now
            </a>
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #94a3b8; font-size: 14px;">
              God bless you on your faith journey!<br>
              <strong style="color: #003366;">School of Members</strong>
            </p>
          </div>
        </body>
      </html>
    `,
    text: `Welcome to School of Members!

Dear ${fullName},

Your login PIN is: ${pin}

Keep this PIN safe. You'll need it to login.

Login at: ${process.env.NEXT_PUBLIC_APP_URL || 'https://school-of-members.vercel.app'}/student/login

God bless you on your faith journey!
School of Members`,
  }),

  pinReminder: (fullName: string, pin: string): EmailTemplate => ({
    subject: 'Your School of Members Login PIN',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(to right, #003366, #b5985b, #C8102E); height: 4px; border-radius: 2px;"></div>

          <div style="padding: 30px 20px; text-align: center;">
            <h1 style="color: #003366;">PIN Reminder</h1>
            <p style="color: #64748b;">Hi ${fullName}, here's your login PIN:</p>
          </div>

          <div style="background: #f8fafc; border-radius: 12px; padding: 30px; text-align: center;">
            <div style="background: #003366; color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px 40px; border-radius: 8px; display: inline-block;">
              ${pin}
            </div>
          </div>

          <div style="padding: 20px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://school-of-members.vercel.app'}/student/login"
               style="display: inline-block; background: #003366; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Login Now
            </a>
          </div>
        </body>
      </html>
    `,
    text: `Hi ${fullName},

Your login PIN is: ${pin}

Login at: ${process.env.NEXT_PUBLIC_APP_URL || 'https://school-of-members.vercel.app'}/student/login

School of Members`,
  }),
}

/**
 * Send welcome email with PIN
 */
export async function sendWelcomeEmail(
  to: string,
  fullName: string,
  pin: string
): Promise<SendEmailResult> {
  const template = EMAIL_TEMPLATES.welcome(fullName, pin)
  return sendEmail(to, template.subject, template.html, template.text)
}

/**
 * Send PIN reminder email
 */
export async function sendPinReminderEmail(
  to: string,
  fullName: string,
  pin: string
): Promise<SendEmailResult> {
  const template = EMAIL_TEMPLATES.pinReminder(fullName, pin)
  return sendEmail(to, template.subject, template.html, template.text)
}
