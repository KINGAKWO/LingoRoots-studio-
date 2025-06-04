
export const mockRecentActivity = [
  { id: 1, type: "lesson", title: "Basic Greetings", date: "2 days ago" },
  { id: 2, type: "quiz", title: "Vocabulary Quiz 1", date: "1 day ago", score: "90%" },
  { id: 3, type: "badge", title: "Quick Learner", date: "1 day ago" },
];

export const mockFeaturedLesson = {
  id: "1", // This should match an ID from mockLessons
  title: "Understanding Noun Classes", // This was the existing one, or we can pick from mockLessons.
  description: "Dive deep into the fascinating world of Duala noun classes.", // Let's update if mockLessons has better one for ID 1.
  imageUrl: "https://placehold.co/600x400.png",
  dataAiHint: "african language study", 
};

// To ensure consistency, let's update featuredLesson based on mockLessons for lesson ID "1" if possible.
// However, the current mockLessons[0] (ID "1") is "Basic Duala Greetings".
// The original `featuredLesson` had a different title. We can either:
// 1. Keep the original `featuredLesson` as distinct mock content.
// 2. Update `featuredLesson` to truly reflect one of the `mockLessons`.
// For now, let's keep it distinct as it was to minimize changes to dashboard's immediate look,
// but in a real scenario, it would pull from the actual lessons.
