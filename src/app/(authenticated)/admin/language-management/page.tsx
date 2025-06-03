import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Globe } from "lucide-react";

// Mock data - replace with actual data fetching later
const languages = [
  { id: "1", name: "Duala", code: "dua", status: "Active", lessonCount: 5 },
  { id: "2", name: "Ewondo", code: "ewo", status: "Inactive", lessonCount: 0 },
];

export default function LanguageManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Language Management</h1>
        <Button size="sm" variant="default" className="gap-1">
          <PlusCircle size={16} /> Add New Language
        </Button>
      </div>
      <p className="text-muted-foreground">
        Manage the languages available for learning within LingoRoots.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Available Languages</CardTitle>
          <CardDescription>View, add, or edit languages offered on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          {languages.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Lessons</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {languages.map(lang => (
                    <tr key={lang.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{lang.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{lang.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${lang.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {lang.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{lang.lessonCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button variant="link" size="sm" className="text-accent p-0 h-auto">Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
             <div className="text-center py-10">
                <Globe className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium text-foreground">No languages configured</h3>
                <p className="mt-1 text-sm text-muted-foreground">Get started by adding a new language.</p>
                <div className="mt-6">
                    <Button variant="default" className="gap-1">
                        <PlusCircle size={16} /> Add New Language
                    </Button>
                </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
