// FAQ data for School of Members
// Based on school_of_members_content_final.md

export interface FAQ {
  id: number
  category: "enrollment" | "program" | "contact"
  question: string
  answer: string
}

export const faqs: FAQ[] = [
  // Enrollment FAQs
  {
    id: 1,
    category: "enrollment",
    question: "Who can join the School of Members?",
    answer: "Anyone who has chosen or is considering Ramah Full Gospel Church as their spiritual home is welcome. This includes new believers, transferring Christians, and current members wanting to deepen their commitment.",
  },
  {
    id: 2,
    category: "enrollment",
    question: "Is there a cost to join?",
    answer: "Registration is completely free. We believe foundational training should be accessible to everyone.",
  },
  {
    id: 3,
    category: "enrollment",
    question: "How long does the program take?",
    answer: "The program is self-paced. We recommend one chapter per week over 12 weeks, but you can move at your own pace.",
  },
  {
    id: 4,
    category: "enrollment",
    question: "Is this online or in-person?",
    answer: "The School of Members is available online with 24/7 access. We also offer periodic in-person sessions in Pretoria.",
  },
  // Program FAQs
  {
    id: 5,
    category: "program",
    question: "What topics are covered in the 12 chapters?",
    answer: "The program covers biblical foundations of membership, the nature of the church, pastor-member relationships, spiritual responsibilities, community life, service, and preparation for Christ's return.",
  },
  {
    id: 6,
    category: "program",
    question: "Will I receive a certificate?",
    answer: "Yes! Upon completing all 12 chapters, you will receive a certificate of completion and join our community of committed graduates.",
  },
  {
    id: 7,
    category: "program",
    question: "Can I retake chapters if needed?",
    answer: "Absolutely. You have unlimited access to all course materials and can revisit any chapter as many times as you need.",
  },
  // Contact FAQs
  {
    id: 8,
    category: "contact",
    question: "How do I register?",
    answer: "Click 'Register Now' on our website and fill out the simple registration form with your phone number. You'll receive a PIN via WhatsApp to access your account.",
  },
  {
    id: 9,
    category: "contact",
    question: "How can I contact someone for help?",
    answer: "You can reach us by phone at +27 61 691 2540 or email at ramahfullgospelch@gmail.com. We're located in Pretoria, South Africa.",
  },
  {
    id: 10,
    category: "contact",
    question: "What if I forget my PIN?",
    answer: "You can request a PIN reset through the login page. A new PIN will be sent to your registered WhatsApp number.",
  },
]

export const getFaqsByCategory = (category: FAQ["category"]): FAQ[] => {
  return faqs.filter((faq) => faq.category === category)
}

export const enrollmentFaqs = faqs.filter((faq) => faq.category === "enrollment")
export const programFaqs = faqs.filter((faq) => faq.category === "program")
export const contactFaqs = faqs.filter((faq) => faq.category === "contact")
