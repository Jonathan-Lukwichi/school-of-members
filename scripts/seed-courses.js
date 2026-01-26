/**
 * Seed Courses Script
 * Uploads School of Members course PDFs to Supabase
 *
 * Usage: node --env-file=.env.local scripts/seed-courses.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Course file paths
const ENGLISH_PATH = 'C:\\Users\\BIBINBUSINESS\\OneDrive\\Desktop\\School of members docu\\course english version'
const FRENCH_PATH = 'C:\\Users\\BIBINBUSINESS\\OneDrive\\Desktop\\School of members docu\\course french version'

// Course definitions
const courses = [
  {
    title: 'School of Members (English)',
    description: 'Complete membership training program in English - 12 chapters covering church foundations, beliefs, and spiritual growth.',
    language: 'en',
    sourcePath: ENGLISH_PATH,
    modules: [
      { file: 'chapter 1 and 2.pdf', title: 'Chapter 1 & 2: Introduction to Membership', order: 1 },
      { file: 'chapter 2.pdf', title: 'Chapter 2: The Foundation of Faith', order: 2 },
      { file: 'Chapter 5.pdf', title: 'Chapter 5: Church Commitment', order: 3 },
      { file: 'chapitre 6.pdf', title: 'Chapter 6: Spiritual Growth', order: 4 },
      { file: 'chapter 7 and 8.pdf', title: 'Chapter 7 & 8: Service and Ministry', order: 5 },
      { file: 'chapter 9.pdf', title: 'Chapter 9: Christian Living', order: 6 },
      { file: 'chapitre 10.pdf', title: 'Chapter 10: Stewardship', order: 7 },
      { file: 'chapiter 11.pdf', title: 'Chapter 11: Fellowship', order: 8 },
      { file: 'chapiter 12.pdf', title: 'Chapter 12: Mission and Vision', order: 9 },
    ]
  },
  {
    title: 'École des Membres (Français)',
    description: 'Programme complet de formation des membres en français - 12 chapitres couvrant les fondements de l\'église, les croyances et la croissance spirituelle.',
    language: 'fr',
    sourcePath: FRENCH_PATH,
    modules: [
      { file: 'chapitre 1 et 2.pdf', title: 'Chapitre 1 & 2: Introduction à l\'Adhésion', order: 1 },
      { file: 'chapitre 3.pdf', title: 'Chapitre 3: Les Fondements de la Foi', order: 2 },
      { file: 'Chapitre 4.pdf', title: 'Chapitre 4: La Vie Chrétienne', order: 3 },
      { file: 'Chapitre 5.pdf', title: 'Chapitre 5: L\'Engagement dans l\'Église', order: 4 },
      { file: 'chapitre 6.pdf', title: 'Chapitre 6: La Croissance Spirituelle', order: 5 },
      { file: 'chapitre 7 et 8.pdf', title: 'Chapitre 7 & 8: Service et Ministère', order: 6 },
      { file: 'chapitre 9 et 10,11 et 12.pdf', title: 'Chapitre 9-12: Intendance, Communion et Mission', order: 7 },
    ]
  }
]

async function getAdminUserId() {
  // Get the first admin user to use as created_by
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'admin')
    .limit(1)
    .single()

  if (error || !data) {
    console.error('Error finding admin user:', error)
    // Fallback: try to get any user
    const { data: anyUser } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .single()
    return anyUser?.id || null
  }

  return data.id
}

async function uploadFile(filePath, fileName, courseLanguage) {
  console.log(`  Uploading: ${fileName}`)

  // Read file
  const fileBuffer = fs.readFileSync(filePath)
  const fileSize = fs.statSync(filePath).size

  // Generate unique storage path
  const storagePath = `${courseLanguage}/${Date.now()}-${fileName.replace(/\s+/g, '_')}`

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('modules')
    .upload(storagePath, fileBuffer, {
      contentType: 'application/pdf',
      upsert: false
    })

  if (error) {
    console.error(`  Error uploading ${fileName}:`, error.message)
    return null
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('modules')
    .getPublicUrl(storagePath)

  return {
    file_url: storagePath, // Store the path, not full URL
    file_name: fileName,
    file_size: fileSize
  }
}

async function seedCourse(courseData, adminUserId) {
  console.log(`\nCreating course: ${courseData.title}`)

  // Check if course already exists
  const { data: existingCourse } = await supabase
    .from('courses')
    .select('id')
    .eq('title', courseData.title)
    .single()

  if (existingCourse) {
    console.log(`  Course already exists with ID: ${existingCourse.id}`)
    return existingCourse.id
  }

  // Create course
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .insert({
      title: courseData.title,
      description: courseData.description,
      is_active: true,
      created_by: adminUserId
    })
    .select()
    .single()

  if (courseError) {
    console.error(`  Error creating course:`, courseError.message)
    return null
  }

  console.log(`  Course created with ID: ${course.id}`)

  // Upload modules
  for (const moduleData of courseData.modules) {
    const filePath = path.join(courseData.sourcePath, moduleData.file)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`  Skipping ${moduleData.file} - file not found`)
      continue
    }

    // Upload file
    const uploadResult = await uploadFile(filePath, moduleData.file, courseData.language)

    if (!uploadResult) {
      continue
    }

    // Create module record
    const { error: moduleError } = await supabase
      .from('modules')
      .insert({
        course_id: course.id,
        title: moduleData.title,
        description: `PDF document for ${moduleData.title}`,
        file_url: uploadResult.file_url,
        file_name: uploadResult.file_name,
        file_size: uploadResult.file_size,
        order_index: moduleData.order
      })

    if (moduleError) {
      console.error(`  Error creating module ${moduleData.title}:`, moduleError.message)
    } else {
      console.log(`  Module created: ${moduleData.title}`)
    }
  }

  return course.id
}

async function main() {
  console.log('=== School of Members Course Seeder ===\n')

  // Check Supabase connection
  console.log('Checking Supabase connection...')
  const { data: healthCheck, error: healthError } = await supabase
    .from('profiles')
    .select('count')
    .limit(1)

  if (healthError) {
    console.error('Failed to connect to Supabase:', healthError.message)
    console.log('\nMake sure your .env.local file has:')
    console.log('  NEXT_PUBLIC_SUPABASE_URL=your_url')
    console.log('  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key')
    process.exit(1)
  }

  console.log('Connected to Supabase successfully!\n')

  // Get admin user ID
  const adminUserId = await getAdminUserId()
  if (!adminUserId) {
    console.error('No admin user found. Please create an admin user first.')
    process.exit(1)
  }
  console.log(`Using admin user ID: ${adminUserId}`)

  // Seed each course
  for (const courseData of courses) {
    await seedCourse(courseData, adminUserId)
  }

  console.log('\n=== Seeding Complete ===')
  console.log('\nNext steps:')
  console.log('1. Check Supabase Dashboard to verify courses and modules')
  console.log('2. Visit /admin/courses in your app to see the courses')
  console.log('3. Enroll students to give them access')
}

main().catch(console.error)
