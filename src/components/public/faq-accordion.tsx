'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { type FAQ } from '@/data/faq'

interface FAQAccordionProps {
  faqs: FAQ[]
  defaultOpen?: string
}

export function FAQAccordion({ faqs, defaultOpen }: FAQAccordionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen}
      className="space-y-4"
    >
      {faqs.map((faq) => (
        <AccordionItem
          key={faq.id}
          value={`faq-${faq.id}`}
          className="bg-white rounded-lg border border-gray-200 px-6 shadow-sm data-[state=open]:shadow-md transition-shadow"
        >
          <AccordionTrigger className="text-left py-5 hover:no-underline">
            <span className="text-[#003366] font-semibold pr-4">
              {faq.question}
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 pb-5 leading-relaxed">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
