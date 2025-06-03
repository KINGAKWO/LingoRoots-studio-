
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Globe } from "lucide-react";
import type { Language } from "@/types"; // Import the new Language type
import { Badge } from "@/components/ui/badge"; // Import Badge component

// Mock data - replace with actual data fetching later
const languages: Language[] = [
  { id: "dua", name: "Duala", description: "A Bantu language spoken in Cameroon.", imageUrl: "https://placehold.co/50x50.png", isActive: true, lessonCount: 5 },
  { id: "ewo", name: "Ewondo", description: "Another Bantu language from Cameroon.", imageUrl: "https://placehold.co/50x50.png", isActive: false, lessonCount: 0 },
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID (Code)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Lessons</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {languages.map(lang => (
                    <tr key={lang.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{lang.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{lang.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge 
                          variant={lang.isActive ? 'default' : 'secondary'}
                          className={lang.isActive ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'}
                        >
                          {lang.isActive ? 'Active' : 'Inactive'}
                        </Badge>
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

