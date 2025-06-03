import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import type { UserProfile } from "@/types"; // Assuming UserProfile is defined appropriately
import { Badge } from "@/components/ui/badge";

// Mock data - replace with actual data fetching later
const users: Pick<UserProfile, 'id' | 'displayName' | 'email' | 'role'>[] = [
  { id: "1", displayName: "Alice Wonderland", email: "alice@example.com", role: "learner" },
  { id: "2", displayName: "Bob The Builder", email: "bob@example.com", role: "contentCreator" },
  { id: "3", displayName: "Charlie Admin", email: "charlie@example.com", role: "admin" },
];

export default function UserManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">User Management</h1>
        {/* <Button size="sm" variant="default" className="gap-1">
          <PlusCircle size={16} /> Add New User
        </Button> */}
      </div>
      <p className="text-muted-foreground">
        View, edit roles, and manage users of the LingoRoots platform.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Platform Users</CardTitle>
          <CardDescription>Manage user accounts and their roles.</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Display Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {users.map(user => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{user.displayName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'contentCreator' ? 'secondary' : 'outline'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button variant="link" size="sm" className="text-accent p-0 h-auto">Edit Role</Button>
                         {/* Add other actions like 'View Profile', 'Suspend User' etc. */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
             <div className="text-center py-10">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium text-foreground">No users found</h3>
                <p className="mt-1 text-sm text-muted-foreground">User data will appear here once available.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
