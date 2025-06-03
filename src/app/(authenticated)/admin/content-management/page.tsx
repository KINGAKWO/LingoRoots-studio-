import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

// Mock Data
const lessons = [
  { id: "1", title: "Basic Greetings", category: "Vocabulary", status: "Published" },
  { id: "2", title: "Duala Alphabet", category: "Fundamentals", status: "Draft" },
];
const quizzes = [
  { id: "q1", title: "Greetings Quiz", lesson: "Basic Greetings", status: "Published" },
];

export default function ContentManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Content Management</h1>
        {/* Add New button could be context-specific to tab */}
      </div>
      <p className="text-muted-foreground">
        Manage lessons, quizzes, and other learning materials for LingoRoots.
      </p>

      <Tabs defaultValue="lessons" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        </TabsList>
        <TabsContent value="lessons">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Manage Lessons</CardTitle>
                <Button size="sm" variant="outline" className="gap-1">
                  <PlusCircle size={16} /> Add New Lesson
                </Button>
              </div>
              <CardDescription>Create, edit, and publish lessons.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder for lessons table or list */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {lessons.map(lesson => (
                      <tr key={lesson.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{lesson.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{lesson.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${lesson.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {lesson.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button variant="link" size="sm" className="text-accent p-0 h-auto">Edit</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {lessons.length === 0 && <p className="text-center text-muted-foreground py-4">No lessons created yet.</p>}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="quizzes">
          <Card>
            <CardHeader>
               <div className="flex justify-between items-center">
                <CardTitle>Manage Quizzes</CardTitle>
                <Button size="sm" variant="outline" className="gap-1">
                  <PlusCircle size={16} /> Add New Quiz
                </Button>
              </div>
              <CardDescription>Create, edit, and assign quizzes to lessons.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder for quizzes table or list */}
               <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Related Lesson</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {quizzes.map(quiz => (
                      <tr key={quiz.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{quiz.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{quiz.lesson}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${quiz.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {quiz.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                           <Button variant="link" size="sm" className="text-accent p-0 h-auto">Edit</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {quizzes.length === 0 && <p className="text-center text-muted-foreground py-4">No quizzes created yet.</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
