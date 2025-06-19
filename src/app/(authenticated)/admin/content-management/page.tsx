"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import useAuth from "@/hooks/use-auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Mock Data
const initialLessons = [
    { id: "1", title: "Basic Greetings", category: "Vocabulary", status: "Published" },
    { id: "2", title: "Duala Alphabet", category: "Fundamentals", status: "Draft" },
];
const initialQuizzes = [
    { id: "q1", title: "Greetings Quiz", lesson: "Basic Greetings", status: "Published" },
];

export default function ContentManagementPage() {
    const { user } = useAuth();
    const [lessons, setLessons] = useState(initialLessons);
    const [quizzes, setQuizzes] = useState(initialQuizzes);

    // Lesson modal state
    const [lessonModalOpen, setLessonModalOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState<any | null>(null);
    const [lessonForm, setLessonForm] = useState<any>({});

    // Quiz modal state
    const [quizModalOpen, setQuizModalOpen] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState<any | null>(null);
    const [quizForm, setQuizForm] = useState<any>({});

    if (!user || (user.role !== "admin" && user.role !== "contentCreator")) {
        return <p className="p-8 text-center text-destructive">Access denied.</p>;
    }

    // Lesson handlers
    const openAddLessonModal = () => {
        setEditingLesson(null);
        setLessonForm({});
        setLessonModalOpen(true);
    };
    const openEditLessonModal = (lesson: any) => {
        setEditingLesson(lesson);
        setLessonForm(lesson);
        setLessonModalOpen(true);
    };
    const handleLessonFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLessonForm({ ...lessonForm, [e.target.name]: e.target.value });
    };
    const handleLessonSave = () => {
        if (editingLesson) {
            setLessons(lessons.map(l => l.id === editingLesson.id ? { ...editingLesson, ...lessonForm } : l));
        } else {
            setLessons([...lessons, { ...lessonForm, id: Date.now().toString(), status: "Draft" }]);
        }
        setLessonModalOpen(false);
    };

    // Quiz handlers
    const openAddQuizModal = () => {
        setEditingQuiz(null);
        setQuizForm({});
        setQuizModalOpen(true);
    };
    const openEditQuizModal = (quiz: any) => {
        setEditingQuiz(quiz);
        setQuizForm(quiz);
        setQuizModalOpen(true);
    };
    const handleQuizFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuizForm({ ...quizForm, [e.target.name]: e.target.value });
    };
    const handleQuizSave = () => {
        if (editingQuiz) {
            setQuizzes(quizzes.map(q => q.id === editingQuiz.id ? { ...editingQuiz, ...quizForm } : q));
        } else {
            setQuizzes([...quizzes, { ...quizForm, id: Date.now().toString(), status: "Draft" }]);
        }
        setQuizModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Content Management</h1>
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
                                <Button size="sm" variant="outline" className="gap-1" onClick={openAddLessonModal}>
                                    <PlusCircle size={16} /> Add New Lesson
                                </Button>
                            </div>
                            <CardDescription>Create, edit, and publish lessons.</CardDescription>
                        </CardHeader>
                        <CardContent>
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
                                                    <Badge variant={lesson.status === 'Published' ? 'default' : 'secondary'}
                                                        className={lesson.status === 'Published' ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'}>
                                                        {lesson.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Button variant="link" size="sm" className="text-accent p-0 h-auto" onClick={() => openEditLessonModal(lesson)}>Edit</Button>
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
                                <Button size="sm" variant="outline" className="gap-1" onClick={openAddQuizModal}>
                                    <PlusCircle size={16} /> Add New Quiz
                                </Button>
                            </div>
                            <CardDescription>Create, edit, and assign quizzes to lessons.</CardDescription>
                        </CardHeader>
                        <CardContent>
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
                                                    <Badge variant={quiz.status === 'Published' ? 'default' : 'secondary'}
                                                        className={quiz.status === 'Published' ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'}>
                                                        {quiz.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Button variant="link" size="sm" className="text-accent p-0 h-auto" onClick={() => openEditQuizModal(quiz)}>Edit</Button>
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

            {/* Lesson Dialog */}
            <Dialog open={lessonModalOpen} onOpenChange={setLessonModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingLesson ? "Edit Lesson" : "Add New Lesson"}</DialogTitle>
                        <DialogClose className="text-muted-foreground hover:text-muted">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </DialogClose>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Input placeholder="Lesson Title" label="Title" name="title" value={lessonForm.title} onChange={handleLessonFormChange} />
                        <Input placeholder="Category" label="Category" name="category" value={lessonForm.category} onChange={handleLessonFormChange} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setLessonModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleLessonSave}>{editingLesson ? "Update Lesson" : "Create Lesson"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Quiz Dialog */}
            <Dialog open={quizModalOpen} onOpenChange={setQuizModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingQuiz ? "Edit Quiz" : "Add New Quiz"}</DialogTitle>
                        <DialogClose className="text-muted-foreground hover:text-muted">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </DialogClose>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Input placeholder="Quiz Title" label="Title" name="title" value={quizForm.title} onChange={handleQuizFormChange} />
                        <Input placeholder="Related Lesson" label="Lesson" name="lesson" value={quizForm.lesson} onChange={handleQuizFormChange} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setQuizModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleQuizSave}>{editingQuiz ? "Update Quiz" : "Create Quiz"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
