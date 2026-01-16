import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function StudentCoursesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1e293b]">Courses</h1>
        <p className="text-[#64748b]">
          Browse and access your courses.
        </p>
      </div>

      <Tabs defaultValue="my-courses">
        <TabsList className="bg-[#f1f5f9]">
          <TabsTrigger value="my-courses" className="data-[state=active]:bg-white data-[state=active]:text-[#003366]">My Courses</TabsTrigger>
          <TabsTrigger value="browse" className="data-[state=active]:bg-white data-[state=active]:text-[#003366]">Browse All</TabsTrigger>
        </TabsList>

        <TabsContent value="my-courses" className="mt-6">
          <Card className="bg-white border border-[#e2e8f0] shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#1e293b]">Enrolled Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#64748b]">
                You haven&apos;t enrolled in any courses yet. Browse available courses to get started.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="browse" className="mt-6">
          <Card className="bg-white border border-[#e2e8f0] shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#1e293b]">Available Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#64748b]">
                No courses available at the moment. Check back later!
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
