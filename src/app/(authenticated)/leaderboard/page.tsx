
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getLeaderboardUsers } from "@/services/userService"; // We'll create this service
import type { LeaderboardUser } from "@/types";
import { Trophy, Users } from "lucide-react";

export default async function LeaderboardPage() {
  const topUsers: LeaderboardUser[] = await getLeaderboardUsers(10); // Fetch top 10 users

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Leaderboard</h1>
      </div>
      <p className="text-muted-foreground">
        See who's topping the charts in LingoRoots! Keep learning to climb the ranks.
      </p>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Top Learners</CardTitle>
          <CardDescription>Ranking based on total points earned.</CardDescription>
        </CardHeader>
        <CardContent>
          {topUsers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] text-center">Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-center text-lg">
                      {user.rank === 1 && <Trophy className="inline-block h-5 w-5 text-yellow-500 mr-1" />}
                      {user.rank === 2 && <Trophy className="inline-block h-5 w-5 text-slate-400 mr-1" />}
                      {user.rank === 3 && <Trophy className="inline-block h-5 w-5 text-yellow-700 mr-1" />}
                      {user.rank}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border">
                          {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.displayName} data-ai-hint="user avatar" />}
                          <AvatarFallback>{user.avatarFallback}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.displayName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary">{user.points.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <Users className="mx-auto h-12 w-12 mb-4" />
              <p className="font-semibold">No users on the leaderboard yet.</p>
              <p className="text-sm">Start learning and completing quizzes to earn points!</p>
            </div>
          )}
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground text-center">
        Leaderboard updates periodically. Keep up the great work!
      </p>
    </div>
  );
}
