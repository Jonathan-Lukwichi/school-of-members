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

// Brand palette (email-safe inline styles) — v2.1 emerald/ink
const BRAND = {
  emerald: '#14CE96',
  emeraldDark: '#0DB082',
  ink: '#0E1726',
  inkDeep: '#0C1017',
  mint: '#E4F7EF',
  muted: '#5B6470',
  border: '#E2E8F0',
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://schoolofmembers.jlwanalytics.com'

// Shared branded HTML shell so every email looks consistent
function emailLayout(inner: string): string {
  return `<!DOCTYPE html>
  <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0; padding:0; background:${BRAND.mint}; font-family:'Segoe UI',Arial,sans-serif; line-height:1.6; color:${BRAND.ink};">
      <div style="max-width:600px; margin:0 auto; padding:24px;">
        <div style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 18px 40px -28px rgba(14,23,38,.45);">
          <div style="height:6px; background:linear-gradient(90deg, ${BRAND.emerald}, ${BRAND.emeraldDark});"></div>
          <div style="padding:32px 28px;">
            ${inner}
          </div>
          <div style="border-top:1px solid ${BRAND.border}; padding:18px 28px; text-align:center;">
            <p style="color:${BRAND.muted}; font-size:13px; margin:0;">
              God bless you on your faith journey!<br>
              <strong style="color:${BRAND.ink};">School of Members</strong> &middot; Ramah Full Gospel Church Pretoria
            </p>
          </div>
        </div>
      </div>
    </body>
  </html>`
}

function pinBlock(pin: string): string {
  return `<div style="background:${BRAND.mint}; border-radius:12px; padding:28px; text-align:center; margin:22px 0;">
    <p style="color:${BRAND.muted}; margin:0 0 12px;">Your login PIN is:</p>
    <div style="background:${BRAND.ink}; color:${BRAND.emerald}; font-size:32px; font-weight:bold; letter-spacing:8px; padding:18px 36px; border-radius:10px; display:inline-block;">${pin}</div>
    <p style="color:${BRAND.muted}; font-size:13px; margin:14px 0 0;">Keep this PIN safe — you'll need your phone number and this PIN to log in.</p>
  </div>`
}

function ctaButton(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block; background:${BRAND.emerald}; color:${BRAND.ink}; padding:14px 30px; text-decoration:none; border-radius:10px; font-weight:bold;">${label}</a>`
}

/**
 * Email templates
 */
export const EMAIL_TEMPLATES = {
  // Sent on approval — PIN + welcoming message
  welcome: (fullName: string, pin: string): EmailTemplate => ({
    subject: 'Welcome to School of Members — Your Login PIN',
    html: emailLayout(`
      <div style="text-align:center;">
        <h1 style="color:${BRAND.ink}; margin:0 0 8px; font-size:24px;">Welcome to School of Members! 🎉</h1>
        <p style="color:${BRAND.muted}; font-size:16px; margin:0;">Dear ${fullName}, your registration has been <strong style="color:${BRAND.emeraldDark};">approved</strong>.</p>
      </div>
      ${pinBlock(pin)}
      <div style="text-align:center;">
        <p style="color:${BRAND.muted};">You can now log in and begin your 12-chapter membership journey.</p>
        <p style="margin-top:14px;">${ctaButton(`${APP_URL}/student/login`, 'Login Now')}</p>
      </div>
    `),
    text: `Welcome to School of Members!

Dear ${fullName}, your registration has been approved.

Your login PIN is: ${pin}

Keep this PIN safe. Log in with your phone number and this PIN.
Login at: ${APP_URL}/student/login

God bless you on your faith journey!
School of Members`,
  }),

  // Sent immediately on registration — confirmation, no PIN yet
  registrationReceived: (fullName: string): EmailTemplate => ({
    subject: 'We received your registration — School of Members',
    html: emailLayout(`
      <div style="text-align:center;">
        <h1 style="color:${BRAND.ink}; margin:0 0 8px; font-size:24px;">Thank you for registering!</h1>
        <p style="color:${BRAND.muted}; font-size:16px; margin:0;">Dear ${fullName},</p>
      </div>
      <div style="background:${BRAND.mint}; border-radius:12px; padding:24px; margin:22px 0; text-align:center;">
        <p style="color:${BRAND.ink}; margin:0;">Your registration has been received and is <strong style="color:${BRAND.emeraldDark};">pending approval</strong> by an administrator.</p>
        <p style="color:${BRAND.muted}; font-size:14px; margin:12px 0 0;">As soon as you're approved, we'll email you a 6-digit PIN (and send it via WhatsApp) so you can log in and start learning.</p>
      </div>
      <div style="text-align:center;">
        <p style="color:${BRAND.muted}; font-size:14px;">No action is needed right now — we'll be in touch shortly.</p>
      </div>
    `),
    text: `Thank you for registering, ${fullName}!

Your registration has been received and is pending approval by an administrator.
Once approved, we'll email you a 6-digit PIN (and send it via WhatsApp) so you can log in.

No action is needed right now.

School of Members`,
  }),

  // Sent to admins when a new student registers
  adminNewRegistration: (student: {
    full_name: string
    email?: string | null
    phone: string
    address?: string | null
    church_of_provenance?: string | null
    preferred_language?: string | null
  }): EmailTemplate => ({
    subject: `🔔 New student registration: ${student.full_name}`,
    html: emailLayout(`
      <div style="text-align:center;">
        <h1 style="color:${BRAND.ink}; margin:0 0 8px; font-size:22px;">New Student Registration</h1>
        <p style="color:${BRAND.muted}; margin:0;">A new student has registered and is awaiting your approval.</p>
      </div>
      <div style="background:${BRAND.mint}; border-radius:12px; padding:22px; margin:22px 0;">
        <table style="width:100%; font-size:14px; color:${BRAND.ink}; border-collapse:collapse;">
          <tr><td style="padding:6px 0; color:${BRAND.muted};">Name</td><td style="padding:6px 0; text-align:right; font-weight:bold;">${student.full_name}</td></tr>
          <tr><td style="padding:6px 0; color:${BRAND.muted};">Email</td><td style="padding:6px 0; text-align:right;">${student.email || '—'}</td></tr>
          <tr><td style="padding:6px 0; color:${BRAND.muted};">Phone</td><td style="padding:6px 0; text-align:right;">${student.phone}</td></tr>
          <tr><td style="padding:6px 0; color:${BRAND.muted};">Address</td><td style="padding:6px 0; text-align:right;">${student.address || '—'}</td></tr>
          <tr><td style="padding:6px 0; color:${BRAND.muted};">Previous church</td><td style="padding:6px 0; text-align:right;">${student.church_of_provenance || '—'}</td></tr>
          <tr><td style="padding:6px 0; color:${BRAND.muted};">Language</td><td style="padding:6px 0; text-align:right;">${student.preferred_language === 'fr' ? 'French' : 'English'}</td></tr>
        </table>
      </div>
      <div style="text-align:center;">
        <p style="margin:0;">${ctaButton(`${APP_URL}/admin/students`, 'Review & Approve')}</p>
      </div>
    `),
    text: `New student registration awaiting approval:

Name: ${student.full_name}
Email: ${student.email || '—'}
Phone: ${student.phone}
Address: ${student.address || '—'}
Previous church: ${student.church_of_provenance || '—'}
Language: ${student.preferred_language === 'fr' ? 'French' : 'English'}

Review & approve: ${APP_URL}/admin/students`,
  }),

  pinReminder: (fullName: string, pin: string): EmailTemplate => ({
    subject: 'Your School of Members Login PIN',
    html: emailLayout(`
      <div style="text-align:center;">
        <h1 style="color:${BRAND.ink}; margin:0 0 8px; font-size:22px;">PIN Reminder</h1>
        <p style="color:${BRAND.muted}; margin:0;">Hi ${fullName}, here's your login PIN:</p>
      </div>
      ${pinBlock(pin)}
      <div style="text-align:center;"><p style="margin:0;">${ctaButton(`${APP_URL}/student/login`, 'Login Now')}</p></div>
    `),
    text: `Hi ${fullName},

Your login PIN is: ${pin}

Login at: ${APP_URL}/student/login

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

/**
 * Send the "we received your registration" confirmation to a new student
 */
export async function sendRegistrationReceivedEmail(
  to: string,
  fullName: string
): Promise<SendEmailResult> {
  const template = EMAIL_TEMPLATES.registrationReceived(fullName)
  return sendEmail(to, template.subject, template.html, template.text)
}

/**
 * Alert all admins that a new student has registered.
 * Sends to every provided address; returns how many succeeded.
 */
export async function sendAdminNewRegistrationEmail(
  adminEmails: string[],
  student: {
    full_name: string
    email?: string | null
    phone: string
    address?: string | null
    church_of_provenance?: string | null
    preferred_language?: string | null
  }
): Promise<{ success: boolean; sent: number; total: number }> {
  const recipients = Array.from(
    new Set((adminEmails || []).map((e) => e?.trim()).filter(Boolean) as string[])
  )
  if (recipients.length === 0) return { success: false, sent: 0, total: 0 }

  const template = EMAIL_TEMPLATES.adminNewRegistration(student)
  const results = await Promise.all(
    recipients.map((to) => sendEmail(to, template.subject, template.html, template.text))
  )
  const sent = results.filter((r) => r.success).length
  return { success: sent > 0, sent, total: recipients.length }
}
