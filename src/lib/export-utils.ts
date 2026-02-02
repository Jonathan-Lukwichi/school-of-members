import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
} from 'docx'

// Student interface for export
interface StudentExport {
  id: string
  full_name: string
  email?: string
  phone: string
  whatsapp_number: string
  address?: string | null
  church_of_provenance?: string | null
  baptized_by_immersion?: boolean | null
  preferred_language?: string
  status: string
  assigned_teacher?: {
    full_name: string
  } | null
  last_login: string | null
  login_count: number
  created_at: string
}

// Format date for display
const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Never'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Format boolean for display
const formatBoolean = (value: boolean | null | undefined): string => {
  if (value === null || value === undefined) return 'Not specified'
  return value ? 'Yes' : 'No'
}

// Format language for display
const formatLanguage = (lang: string | undefined): string => {
  if (!lang) return 'Not specified'
  return lang === 'en' ? 'English' : lang === 'fr' ? 'French' : lang
}

// Format status for display
const formatStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

// Prepare student data for export
const prepareStudentData = (students: StudentExport[]) => {
  return students.map((student, index) => ({
    'No.': index + 1,
    'Full Name': student.full_name,
    'Email': student.email || 'N/A',
    'Phone': student.phone,
    'WhatsApp': student.whatsapp_number,
    'Address': student.address || 'N/A',
    'Church of Provenance': student.church_of_provenance || 'N/A',
    'Baptized by Immersion': formatBoolean(student.baptized_by_immersion),
    'Preferred Language': formatLanguage(student.preferred_language),
    'Status': formatStatus(student.status),
    'Assigned Teacher': student.assigned_teacher?.full_name || 'Unassigned',
    'Last Login': formatDate(student.last_login),
    'Login Count': student.login_count,
    'Registration Date': formatDate(student.created_at),
  }))
}

/**
 * Export students to Excel (.xlsx) file
 */
export const exportToExcel = (students: StudentExport[], filename: string = 'students') => {
  const data = prepareStudentData(students)

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(data)

  // Set column widths
  const columnWidths = [
    { wch: 5 },   // No.
    { wch: 25 },  // Full Name
    { wch: 30 },  // Email
    { wch: 18 },  // Phone
    { wch: 18 },  // WhatsApp
    { wch: 35 },  // Address
    { wch: 25 },  // Church of Provenance
    { wch: 20 },  // Baptized by Immersion
    { wch: 18 },  // Preferred Language
    { wch: 12 },  // Status
    { wch: 20 },  // Assigned Teacher
    { wch: 20 },  // Last Login
    { wch: 12 },  // Login Count
    { wch: 20 },  // Registration Date
  ]
  worksheet['!cols'] = columnWidths

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students')

  // Generate buffer and save
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

  // Create filename with date
  const date = new Date().toISOString().split('T')[0]
  saveAs(blob, `${filename}_${date}.xlsx`)
}

/**
 * Export students to Word (.docx) file
 */
export const exportToWord = async (students: StudentExport[], filename: string = 'students') => {
  const data = prepareStudentData(students)

  // Define table headers
  const headers = [
    'No.', 'Full Name', 'Email', 'Phone', 'WhatsApp', 'Address',
    'Church', 'Baptized', 'Language', 'Status', 'Teacher', 'Last Login', 'Logins', 'Registered'
  ]

  // Create header row
  const headerRow = new TableRow({
    children: headers.map(header =>
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: header,
                bold: true,
                size: 20,
                color: '003366',
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
        shading: { fill: 'E8E8E8' },
      })
    ),
    tableHeader: true,
  })

  // Create data rows
  const dataRows = data.map(student =>
    new TableRow({
      children: [
        student['No.'].toString(),
        student['Full Name'],
        student['Email'],
        student['Phone'],
        student['WhatsApp'],
        student['Address'],
        student['Church of Provenance'],
        student['Baptized by Immersion'],
        student['Preferred Language'],
        student['Status'],
        student['Assigned Teacher'],
        student['Last Login'],
        student['Login Count'].toString(),
        student['Registration Date'],
      ].map(value =>
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: value,
                  size: 18,
                }),
              ],
            }),
          ],
        })
      ),
    })
  )

  // Create document
  const doc = new Document({
    sections: [
      {
        children: [
          // Title
          new Paragraph({
            children: [
              new TextRun({
                text: 'School of Members - Student List',
                bold: true,
                size: 36,
                color: '003366',
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          // Subtitle with date and count
          new Paragraph({
            children: [
              new TextRun({
                text: `Generated on ${new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} • Total Students: ${students.length}`,
                size: 22,
                color: '666666',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          // Table
          new Table({
            rows: [headerRow, ...dataRows],
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
          }),
          // Footer
          new Paragraph({
            children: [
              new TextRun({
                text: '\n\nRamah Full Gospel Church - School of Members Platform',
                size: 18,
                italics: true,
                color: '999999',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 400 },
          }),
        ],
      },
    ],
  })

  // Generate and save document
  const blob = await Packer.toBlob(doc)
  const date = new Date().toISOString().split('T')[0]
  saveAs(blob, `${filename}_${date}.docx`)
}
