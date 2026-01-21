import { redirect } from 'next/navigation'

// Redirect student login to unified login page
// The unified login page has tabs for both student and admin login
export default function StudentLoginRedirect() {
  redirect('/login')
}
