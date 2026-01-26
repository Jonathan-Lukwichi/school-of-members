/**
 * Bulk Upload Course PDFs to Supabase
 *
 * Usage: node scripts/upload-courses.js
 *
 * Make sure your .env.local has:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

// Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Course configuration
const COURSE_TITLE = 'School of Members'
const COURSE_DESCRIPTION = 'Complete course curriculum for the School of Members program. Available in English and French.'

// Admin user ID (you need to provide this - the admin who created the course)
const ADMIN_USER_ID = process.env.ADMIN_USER_ID || null

// Paths to course files
const ENGLISH_PATH = 'C:\\Users\\BIBINBUSINESS\\OneDrive\\Desktop\\School of members docu\\course english version'
const FRENCH_PATH = 'C:\\Users\\BIBINBUSINESS\\OneDrive\\Desktop\\School of members docu\\course french version'

// Module mapping with proper titles
const englishModules = [
  { file: 'chapter 1 and 2.pdf', title: 'Chapter 1 & 2: Introduction', order: 1 },
  { file: 'chapter 2.pdf', title: 'Chapter 2: Foundations', order: 2 },
  { file: 'Chapter 5.pdf', title: 'Chapter 5: Growth', order: 3 },
  { file: 'chapitre 6.pdf', title: 'Chapter 6: Ministry', order: 4 },
  { file: 'chapter 7 and 8.pdf', title: 'Chapter 7 & 8: Service', order: 5 },
  { file: 'chapter 9.pdf', title: 'Chapter 9: Leadership', order: 6 },
  { file: 'chapitre 10.pdf', title: 'Chapter 10: Maturity', order: 7 },
  { file: 'chapiter 11.pdf', title: 'Chapter 11: Discipleship', order: 8 },
  { file: 'chapiter 12.pdf', title: 'Chapter 12: Commission', order: 9 },
]

const frenchModules = [
  { file: 'chapitre 1 et 2.pdf', title: 'Chapitre 1 & 2: Introduction', order: 1 },
  { file: 'chapitre 3.pdf', title: 'Chapitre 3: Fondements', order: 2 },
  { file: 'Chapitre 4.pdf', title: 'Chapitre 4: Croissance', order: 3 },
  { file: 'Chapitre 5.pdf', title: 'Chapitre 5: Développement', order: 4 },
  { file: 'chapitre 6.pdf', title: 'Chapitre 6: Ministère', order: 5 },
  { file: 'chapitre 7 et 8.pdf', title: 'Chapitre 7 & 8: Service', order: 6 },
  { file: 'chapitre 9 et 10,11 et 12.pdf', title: 'Chapitre 9-12: Maturité & Mission', order: 7 },
]

async function uploadFile(filePath, fileName, courseId, language) {
  const fileBuffer = fs.readFileSync(filePath)
  const storagePath = `${courseId}/${language}/${Date.now()}-${fileName.replace(/\s+/g, '_')}`

  const { data, error } = await supabase.storage
    .from('modules')
    .upload(storagePath, fileBuffer, {
      contentType: 'application/pdf',
      cacheControl: '3600'
    })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  const { data: urlData } = supabase.storage
    .from('modules')
    .getPublicUrl(storagePath)

  return {
    url: urlData.publicUrl,
    size: fileBuffer.length
  }
}

async function createModule(courseId, title, description, fileUrl, fileName, fileSize, orderIndex, language) {
  const { data, error } = await supabase
    .from('modules')
    .insert({
      course_id: courseId,
      title,
      description,
      file_url: fileUrl,
      file_name: fileName,
      file_size: fileSize,
      order_index: orderIndex,
      language
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Module creation failed: ${error.message}`)
  }

  return data
}

async function main() {
  console.log('🚀 Starting Course Upload Script\n')

  // Check environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing Supabase credentials in .env.local')
    console.log('Required variables:')
    console.log('  - NEXT_PUBLIC_SUPABASE_URL')
    console.log('  - SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  // Check if course already exists
  console.log('📚 Checking for existing course...')
  const { data: existingCourse } = await supabase
    .from('courses')
    .select('id')
    .eq('title', COURSE_TITLE)
    .single()

  let courseId

  if (existingCourse) {
    courseId = existingCourse.id
    console.log(`✅ Found existing course: ${courseId}`)
  } else {
    // Need admin user ID to create course
    if (!ADMIN_USER_ID) {
      console.error('❌ ADMIN_USER_ID is required to create a new course')
      console.log('Please set ADMIN_USER_ID in .env.local or create the course manually in admin panel')
      process.exit(1)
    }

    console.log('📝 Creating new course...')
    const { data: newCourse, error: courseError } = await supabase
      .from('courses')
      .insert({
        title: COURSE_TITLE,
        description: COURSE_DESCRIPTION,
        is_active: true,
        created_by: ADMIN_USER_ID
      })
      .select()
      .single()

    if (courseError) {
      console.error('❌ Failed to create course:', courseError.message)
      process.exit(1)
    }

    courseId = newCourse.id
    console.log(`✅ Created new course: ${courseId}`)
  }

  // Upload English modules
  console.log('\n📖 Uploading English modules...')
  let englishCount = 0

  for (const module of englishModules) {
    const filePath = path.join(ENGLISH_PATH, module.file)

    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠️ File not found: ${module.file}`)
      continue
    }

    try {
      console.log(`  📤 Uploading: ${module.file}`)
      const { url, size } = await uploadFile(filePath, module.file, courseId, 'en')
      await createModule(
        courseId,
        module.title,
        `English version - ${module.title}`,
        url,
        module.file,
        size,
        module.order,
        'en'
      )
      englishCount++
      console.log(`  ✅ Uploaded: ${module.title}`)
    } catch (error) {
      console.log(`  ❌ Failed: ${module.file} - ${error.message}`)
    }
  }

  // Upload French modules
  console.log('\n📖 Uploading French modules...')
  let frenchCount = 0

  for (const module of frenchModules) {
    const filePath = path.join(FRENCH_PATH, module.file)

    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠️ File not found: ${module.file}`)
      continue
    }

    try {
      console.log(`  📤 Uploading: ${module.file}`)
      const { url, size } = await uploadFile(filePath, module.file, courseId, 'fr')
      await createModule(
        courseId,
        module.title,
        `Version française - ${module.title}`,
        url,
        module.file,
        size,
        module.order + 100, // Offset French modules
        'fr'
      )
      frenchCount++
      console.log(`  ✅ Uploaded: ${module.title}`)
    } catch (error) {
      console.log(`  ❌ Failed: ${module.file} - ${error.message}`)
    }
  }

  console.log('\n✨ Upload Complete!')
  console.log(`   English modules: ${englishCount}/${englishModules.length}`)
  console.log(`   French modules: ${frenchCount}/${frenchModules.length}`)
  console.log(`\n📚 Course ID: ${courseId}`)
}

main().catch(console.error)
