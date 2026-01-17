// Founder information for School of Members
// Based on school_of_members_content_final.md

export interface Founder {
  id: number
  name: string
  title: string
  role: string
  image: string
  bio: string[]
  scripture?: {
    text: string
    reference: string
  }
  contact?: {
    phone?: string
    email?: string
  }
}

export const founders: Founder[] = [
  {
    id: 1,
    name: "Narcisse Majila",
    title: "Apostle",
    role: "Founder & Senior Pastor, Ramah Full Gospel Church Pretoria",
    image: "/images/founders/apostle-narcisse-majila.jpg",
    bio: [
      "Apostle Narcisse Majila is a man called by God to shepherd His people and build faithful members for the Kingdom. As the fifth-born son of Patriarch Jonas Majila, he carries the spiritual legacy of the Ramah movement while pioneering new territory in South Africa.",
      "On March 8, 2012, Apostle Narcisse founded Ramah Full Gospel Church Pretoria, beginning with a small gathering in a home in Moreletta. Through faith, perseverance, and the power of the Holy Spirit, the church has grown and relocated multiple times—finally establishing at Christian Progressive College (CPC) in Pretoria CBD since July 2014.",
      "Apostle Narcisse is passionate about teaching, deliverance, and raising a generation of equipped believers who understand their identity and purpose in Christ.",
    ],
    scripture: {
      text: "The Spirit of the Lord GOD is upon me, because the LORD has anointed me to bring good news to the poor; he has sent me to bind up the brokenhearted, to proclaim liberty to the captives...",
      reference: "Isaiah 61:1-3",
    },
    contact: {
      phone: "+27 61 691 2540",
      email: "ramahfullgospelch@gmail.com",
    },
  },
  {
    id: 2,
    name: "Jonas Majila",
    title: "Patriarch",
    role: "Founder of the Ramah Movement",
    image: "/images/founders/patriarch-jonas-majila.jpg",
    bio: [
      "Patriarch Jonas Majila is the spiritual father and founder of the Ramah Full Gospel Church movement. His journey of faith began in 1980 when God called him while working in Lubumbashi, Democratic Republic of Congo.",
      "In 1981, he relocated to Likasi where he started a small prayer group. What began as a humble gathering grew into a powerful movement. The first major crusade was held in 1987, and by 1993, the church began expanding across the Democratic Republic of Congo.",
      "Patriarch Jonas is more than a founder—he is a trainer of ministers, an evangelist to nations, and a coach to countless men and women of God around the world.",
      "He is married to Marie Majila, and together they have seven children who continue the legacy of ministry and service to God's Kingdom.",
    ],
  },
]

export const getFounderByName = (name: string): Founder | undefined => {
  return founders.find((f) => f.name.toLowerCase().includes(name.toLowerCase()))
}
