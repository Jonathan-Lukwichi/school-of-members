import { formatPhoneForWhatsApp } from '@/lib/auth/phone'

interface TwilioConfig {
  accountSid: string
  authToken: string
  whatsappNumber: string
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
    whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886',
  }
}

// Check if Twilio is configured
export function isTwilioConfigured(): boolean {
  const config = getTwilioConfig()
  return !!(config.accountSid && config.authToken && config.whatsappNumber)
}

/**
 * Send WhatsApp message via Twilio API
 */
export async function sendWhatsAppMessage(
  to: string,
  message: string
): Promise<SendMessageResult> {
  const config = getTwilioConfig()

  if (!config.accountSid || !config.authToken) {
    console.warn('Twilio is not configured. Message not sent.')
    return {
      success: false,
      error: 'Twilio is not configured',
    }
  }

  const formattedTo = formatPhoneForWhatsApp(to)

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
          From: config.whatsappNumber,
          To: formattedTo,
          Body: message,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('Twilio error:', data)
      return {
        success: false,
        error: data.message || 'Failed to send message',
      }
    }

    return {
      success: true,
      sid: data.sid,
    }
  } catch (error) {
    console.error('WhatsApp send error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Message templates
 */
export const MESSAGE_TEMPLATES: Record<string, MessageTemplate> = {
  welcome: {
    type: 'welcome',
    content: `Welcome to School of Members!

Your account has been created successfully.

Your PIN: {pin}

Use this PIN to log in to the platform.

Your assigned teacher will contact you shortly.

God bless you!`,
  },

  pin_reminder: {
    type: 'pin',
    content: `School of Members - PIN Reminder

Your login PIN is: {pin}

If you didn't request this, please contact support.`,
  },

  new_pin: {
    type: 'pin',
    content: `School of Members - New PIN

Your new PIN is: {pin}

Use this PIN to log in to the platform.`,
  },

  teacher_assigned: {
    type: 'notification',
    content: `School of Members - Teacher Assigned

Dear {studentName},

You have been assigned to {teacherName} as your teacher.

They will be reaching out to you soon to guide you through your learning journey.

God bless you!`,
  },

  course_enrolled: {
    type: 'notification',
    content: `School of Members - Course Enrollment

Dear {studentName},

You have been enrolled in: {courseName}

Start your learning journey today!

Login at: {appUrl}`,
  },

  module_available: {
    type: 'notification',
    content: `School of Members - New Module Available

Dear {studentName},

A new module is available in your course "{courseName}":

{moduleName}

Login to access it now!`,
  },

  reminder: {
    type: 'reminder',
    content: `School of Members - Learning Reminder

Dear {studentName},

Don't forget to continue your learning journey!

You have {pendingModules} modules waiting for you.

Login at: {appUrl}`,
  },
}

/**
 * Send templated message
 */
export async function sendTemplatedMessage(
  to: string,
  templateName: string,
  variables: Record<string, string>
): Promise<SendMessageResult> {
  const template = MESSAGE_TEMPLATES[templateName]
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

  return sendWhatsAppMessage(to, message)
}

/**
 * Send welcome message with PIN
 */
export async function sendWelcomeMessage(
  to: string,
  pin: string
): Promise<SendMessageResult> {
  return sendTemplatedMessage(to, 'welcome', { pin })
}

/**
 * Send PIN reminder
 */
export async function sendPinReminder(
  to: string,
  pin: string
): Promise<SendMessageResult> {
  return sendTemplatedMessage(to, 'pin_reminder', { pin })
}

/**
 * Send new PIN notification
 */
export async function sendNewPinNotification(
  to: string,
  pin: string
): Promise<SendMessageResult> {
  return sendTemplatedMessage(to, 'new_pin', { pin })
}

/**
 * Send teacher assignment notification
 */
export async function sendTeacherAssignmentNotification(
  to: string,
  studentName: string,
  teacherName: string
): Promise<SendMessageResult> {
  return sendTemplatedMessage(to, 'teacher_assigned', {
    studentName,
    teacherName,
  })
}

/**
 * Send course enrollment notification
 */
export async function sendCourseEnrollmentNotification(
  to: string,
  studentName: string,
  courseName: string,
  appUrl: string
): Promise<SendMessageResult> {
  return sendTemplatedMessage(to, 'course_enrolled', {
    studentName,
    courseName,
    appUrl,
  })
}
