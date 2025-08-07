
"use client";

import RootLayout from '@/app/layout';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Language } from "@/types";
import { CheckCircle, Languages, Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import  useAuth  from '@/hooks/use-auth'; // Import useAuth

// Mock data - replace with actual data fetching later
const availableLanguages: Language[] = [
  { id: "dua", name: "Duala", description: "A Bantu language spoken in Cameroon.", imageUrl: "https://placehold.co/300x200.png", isActive: true, lessonCount: 5 },
  { id: "ewo", name: "Ewondo", description: "Another Bantu language from Cameroon.", imageUrl: "https://placehold.co/300x200.png", isActive: false, lessonCount: 0 },
  { id: "bas", name: "Bassa", description: "A language spoken by the Bassa people of Cameroon.", imageUrl: "https://placehold.co/300x200.png", isActive: false, lessonCount: 0 },
];

export default function SelectLanguagePage() {
  const { user, updateUserInContextAndFirestore, loading: authLoading } = useAuth(); // Get user and updateUser function
  const [selectedLanguageId, setSelectedLanguageId] = useState<string | null>(null);
  const [clientLoaded, setClientLoaded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setClientLoaded(true);
    if (user?.selectedLanguageId) {
      setSelectedLanguageId(user.selectedLanguageId);
    }
  }, [user]);

  const handleSelectLanguage = async (languageId: string) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    setIsUpdating(true);
    const selectedLang = availableLanguages.find(lang => lang.id === languageId);
    
    try {
      await updateUserInContextAndFirestore({ selectedLanguageId: languageId });
      setSelectedLanguageId(languageId); // Update local state for immediate UI feedback
      toast({
        title: "Language Selected",
        description: `You've selected ${selectedLang?.name}. Redirecting to lessons...`,
      });
      router.push('/lessons'); 
    } catch (error) {
      console.error("Error selecting language:", error);
      toast({ title: "Error", description: "Could not save your language selection.", variant: "destructive"});
    } finally {
      setIsUpdating(false);
    }
  };

  if (!clientLoaded || authLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-pulse text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight text-primary font-headline">Select Your Language</CardTitle>
          <CardDescription>
            Choose the Cameroonian mother tongue you want to learn or practice today.
          </CardDescription>
        </CardHeader>
      </Card>

      {availableLanguages.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availableLanguages.map((language) => (
            <Card 
              key={language.id} 
              className={`flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1
                ${selectedLanguageId === language.id ? 'border-2 border-primary ring-2 ring-primary/50' : 'border-border'}
                ${!language.isActive ? 'opacity-50 cursor-not-allowed bg-muted/50' : 'cursor-pointer'}`
              }
              onClick={() => language.isActive && !isUpdating && handleSelectLanguage(language.id)}
              data-ai-hint={`${language.name.toLowerCase()} cameroon cultural`}
            >
              {language.imageUrl && (
                 <div className="relative h-48 w-full">
                    <Image 
                        src={language.imageUrl} 
                        alt={language.name} 
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-t-lg"
                        data-ai-hint={`${language.name.toLowerCase()} cameroon cultural`}
                    />
                 </div>
              )}
              {!language.imageUrl && (
                <div className="h-48 w-full bg-secondary/20 flex items-center justify-center rounded-t-lg" data-ai-hint="language abstract pattern">
                    <Languages className="w-16 h-16 text-primary/50" />
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className={`text-xl font-semibold ${selectedLanguageId === language.id ? 'text-primary' : 'text-foreground'}`}>
                  {language.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{language.description}</p>
                {language.lessonCount !== undefined && (
                  <p className="text-xs text-muted-foreground mt-2">{language.lessonCount > 0 ? `${language.lessonCount} lessons available` : 'No lessons yet'}</p>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={selectedLanguageId === language.id ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation(); 
                    if (language.isActive && !isUpdating) handleSelectLanguage(language.id);
                  }}
                  disabled={!language.isActive || isUpdating}
                >
                  {isUpdating && selectedLanguageId === language.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : selectedLanguageId === language.id && <CheckCircle className="mr-2 h-4 w-4" />}
                  {selectedLanguageId === language.id ? 'Selected' : (language.isActive ? 'Select Language' : 'Coming Soon')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <Languages className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-foreground">No languages available</h3>
            <p className="mt-1 text-sm text-muted-foreground">Please check back later or contact an administrator.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
