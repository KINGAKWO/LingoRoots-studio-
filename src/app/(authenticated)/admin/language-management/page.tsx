
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, Pencil } from "lucide-react";
// Define the AdminLanguage type locally to avoid conflicts with other types
type AdminLanguage = {
	id: string;
	name: string;
	description: string;
	imageUrl?: string;
	isActive: boolean;
	lessonCount: number;
	status: "published" | "draft";
	createdBy: string;
};
// import type { Language } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// Mock data - replace with actual data fetching later
const initialLanguages: AdminLanguage[] = [
	{
		id: "dua",
		name: "Duala",
		description: "A Bantu language spoken in Cameroon.",
		imageUrl: "/history-colonial-cameroon.jpg",
		isActive: true,
		lessonCount: 5,
		status: "published",
		createdBy: "admin",
	},
	{
		id: "ewo",
		name: "Ewondo",
		description: "Another Bantu language from Cameroon.",
		imageUrl: "/history-colonial-cameroon.jpg",
		isActive: false,
		lessonCount: 0,
		status: "draft",
		createdBy: "admin",
	},
];

export default function LanguageManagementPage() {
	const [languages, setLanguages] = useState<AdminLanguage[]>(initialLanguages);
	const [modalOpen, setModalOpen] = useState(false);
	const [editing, setEditing] = useState<AdminLanguage | null>(null);
	const [form, setForm] = useState<Partial<AdminLanguage>>({});

	const openAddModal = () => {
		setEditing(null);
		setForm({});
		setModalOpen(true);
	};

	const openEditModal = (lang: AdminLanguage) => {
		setEditing(lang);
		setForm(lang);
		setModalOpen(true);
	};

	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSave = () => {
		if (editing) {
			setLanguages(languages.map((l) => (l.id === editing.id ? { ...editing, ...form } as AdminLanguage : l)));
		} else {
			setLanguages([
				...languages,
				{
					...(form as AdminLanguage),
					id: form.id || Date.now().toString(),
					isActive: false,
					lessonCount: 0,
					status: "draft",
					createdBy: "admin",
				},
			]);
		}
		setModalOpen(false);
	};

	return (
		<ProtectedRoute allowedRoles={["admin"]}>
			<div className="space-y-6">
				<div className="flex justify-between items-center">
					<h1 className="text-3xl font-bold tracking-tight text-primary font-headline">
						Language Management
					</h1>
					<Button size="sm" variant="default" className="gap-1" onClick={openAddModal}>
						<PlusCircle size={16} /> Add New Language
					</Button>
				</div>
				<p className="text-muted-foreground">
					Manage the languages available for learning within LingoRoots.
				</p>

				<Card>
					<CardHeader>
						<CardTitle>Available Languages</CardTitle>
						<CardDescription>
							View, add, or edit languages offered on the platform.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{languages.length > 0 ? (
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-border">
									<thead className="bg-muted/50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
												Name
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
												ID (Code)
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
												Status
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
												Lessons
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="bg-card divide-y divide-border">
										{languages.map((lang) => (
											<tr key={lang.id}>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
													{lang.name}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
													{lang.id}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm">
													<Badge
														variant={lang.isActive ? "default" : "secondary"}
														className={
															lang.isActive
																? "bg-green-500 hover:bg-green-600"
																: "bg-yellow-500 hover:bg-yellow-600"
														}
													>
														{lang.isActive ? "Active" : "Inactive"}
													</Badge>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
													{lang.lessonCount}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
													<Button
														variant="link"
														size="sm"
														className="text-accent p-0 h-auto"
														onClick={() => openEditModal(lang)}
													>
														<Pencil className="mr-1 h-4 w-4" /> Edit
													</Button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<div className="text-center py-10">
								<Users className="mx-auto h-12 w-12 text-muted-foreground" />
								<h3 className="mt-2 text-sm font-medium text-foreground">
									No languages configured
								</h3>
								<p className="mt-1 text-sm text-muted-foreground">
									Get started by adding a new language.
								</p>
								<div className="mt-6">
									<Button variant="default" className="gap-1">
										<PlusCircle size={16} /> Add New Language
									</Button>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				<Dialog open={modalOpen} onOpenChange={setModalOpen}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>
								{editing ? "Edit Language" : "Add New Language"}
							</DialogTitle>
							<DialogDescription>
								{editing
									? "Modify the details of the language."
									: "Provide the details for the new language."}
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<Input
								name="name"
								placeholder="Enter language name"
								value={form.name}
								onChange={handleFormChange}
							/>
							<Input
								name="id"
								placeholder="Enter language ID"
								value={form.id}
								onChange={handleFormChange}
							/>
							<Input
								name="description"
								placeholder="Enter language description"
								value={form.description}
								onChange={handleFormChange}
							/>
							<div className="flex gap-4">
								<Button
									variant="default"
									className="flex-1"
									onClick={handleSave}
								>
									Save
								</Button>
								<Button
									variant="outline"
									className="flex-1"
									onClick={() => setModalOpen(false)}
								>
									Cancel
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</ProtectedRoute>
	);
}

