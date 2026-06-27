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
          className="bg-white rounded-xl border border-mint px-6 shadow-premium data-[state=open]:shadow-premium-lg data-[state=open]:border-emerald/40 transition-all"
        >
          <AccordionTrigger className="text-left py-5 hover:no-underline">
            <span className="text-ink font-semibold pr-4">
              {faq.question}
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-ink-muted pb-5 leading-relaxed">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
