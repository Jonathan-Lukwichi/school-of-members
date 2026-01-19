interface TwilioConfig {
  accountSid: string
  authToken: string
  smsNumber: string
}

interface SendMessageResult {
  success: boolean
  sid?: string
  error?: string
}

interface MessageTemplate {
  type: 'welcome' | 'pin' | 'reminder' | 'notification' | 'custom'
  content: string
}

// Get Twilio configuration from environment
function getTwilioConfig(): TwilioConfig {
  return {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    smsNumber: process.env.TWILIO_SMS_NUMBER || process.env.TWILIO_PHONE_NUMBER || '',
  }
}

// Check if Twilio SMS is configured
export function isTwilioSmsConfigured(): boolean {
  const config = getTwilioConfig()
  return !!(config.accountSid && config.authToken && config.smsNumber)
}

/**
 * Format phone number for SMS (E.164 format)
 */
function formatPhoneForSms(phone: string): string {
  // Remove any non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '')

  // Ensure it starts with +
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned
  }

  return cleaned
}

/**
 * Send SMS message via Twilio API
 */
export async function sendSms(
  to: string,
  message: string
): Promise<SendMessageResult> {
  const config = getTwilioConfig()

  if (!config.accountSid || !config.authToken) {
    console.warn('Twilio is not configured. SMS not sent.')
    return {
      success: false,
      error: 'Twilio is not configured',
    }
  }

  if (!config.smsNumber) {
    console.warn('Twilio SMS number is not configured.')
    return {
      success: false,
      error: 'SMS sender number is not configured',
    }
  }

  const formattedTo = formatPhoneForSms(to)

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(`${config.accountSid}:${config.authToken}`).toString('base64'),
        },
        body: new URLSearchParams({
          From: config.smsNumber,
          To: formattedTo,
          Body: message,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('Twilio SMS error:', data)
      return {
        success: false,
        error: data.message || 'Failed to send SMS',
      }
    }

    return {
      success: true,
      sid: data.sid,
    }
  } catch (error) {
    console.error('SMS send error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * SMS Message templates (shorter for SMS)
 */
export const SMS_TEMPLATES: Record<string, MessageTemplate> = {
  welcome: {
    type: 'welcome',
    content: `School of Members: Welcome {fullName}! Your PIN is {pin}. Use this to login at the platform. God bless!`,
  },

  pin_reminder: {
    type: 'pin',
    content: `School of Members: Your login PIN is {pin}`,
  },

  new_pin: {
    type: 'pin',
    content: `School of Members: Your new PIN is {pin}`,
  },

  teacher_assigned: {
    type: 'notification',
    content: `School of Members: {studentName}, you've been assigned to teacher {teacherName}. They will contact you soon!`,
  },

  course_enrolled: {
    type: 'notification',
    content: `School of Members: You're enrolled in {courseName}. Login at {appUrl} to start learning!`,
  },

  reminder: {
    type: 'reminder',
    content: `School of Members: Don't forget to continue learning! You have {pendingModules} modules waiting.`,
  },
}

/**
 * Send templated SMS
 */
export async function sendTemplatedSms(
  to: string,
  templateName: string,
  variables: Record<string, string>
): Promise<SendMessageResult> {
  const template = SMS_TEMPLATES[templateName]
  if (!template) {
    return {
      success: false,
      error: `Template "${templateName}" not found`,
    }
  }

  // Replace variables in template
  let message = template.content
  for (const [key, value] of Object.entries(variables)) {
    message = message.replace(new RegExp(`{${key}}`, 'g'), value)
  }

  return sendSms(to, message)
}

/**
 * Send welcome SMS with PIN and student name
 */
export async function sendWelcomeSms(
  to: string,
  pin: string,
  fullName: string
): Promise<SendMessageResult> {
  return sendTemplatedSms(to, 'welcome', { pin, fullName })
}

/**
 * Send PIN reminder via SMS
 */
export async function sendPinReminderSms(
  to: string,
  pin: string
): Promise<SendMessageResult> {
  return sendTemplatedSms(to, 'pin_reminder', { pin })
}

/**
 * Send new PIN notification via SMS
 */
export async function sendNewPinSms(
  to: string,
  pin: string
): Promise<SendMessageResult> {
  return sendTemplatedSms(to, 'new_pin', { pin })
}
