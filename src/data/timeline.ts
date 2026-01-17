// Church history timeline
// Based on school_of_members_content_final.md

export interface TimelineEvent {
  id: number
  year: string
  title: string
  description?: string
  isHighlight?: boolean
}

export const timeline: TimelineEvent[] = [
  {
    id: 1,
    year: "1980",
    title: "The Call",
    description: "Patriarch Jonas Majila receives the call of God in Lubumbashi, DRC",
  },
  {
    id: 2,
    year: "1981",
    title: "The Beginning",
    description: "Prayer group begins in Likasi, DRC",
  },
  {
    id: 3,
    year: "1987",
    title: "First Crusade",
    description: "First major crusade held, marking a turning point in the ministry",
  },
  {
    id: 4,
    year: "1993",
    title: "Expansion Begins",
    description: "Church expansions begin across the Democratic Republic of Congo",
  },
  {
    id: 5,
    year: "2012",
    title: "Ramah Pretoria Founded",
    description: "Apostle Narcisse founds Ramah Full Gospel Church Pretoria on March 8",
    isHighlight: true,
  },
  {
    id: 6,
    year: "2012-2014",
    title: "Growth Period",
    description: "Church grows through multiple locations in Pretoria",
  },
  {
    id: 7,
    year: "2014",
    title: "Permanent Home",
    description: "Church establishes at Christian Progressive College (CPC), Pretoria CBD in July",
    isHighlight: true,
  },
  {
    id: 8,
    year: "2021",
    title: "Syllabus Formalized",
    description: "School of Members Syllabus is officially formalized and structured",
  },
  {
    id: 9,
    year: "2026",
    title: "LMS Launch",
    description: "School of Members LMS Platform launched for online learning",
    isHighlight: true,
  },
]

export const getHighlightEvents = (): TimelineEvent[] => {
  return timeline.filter((event) => event.isHighlight)
}
