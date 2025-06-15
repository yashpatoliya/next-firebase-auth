"use client";

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Lightbulb, AlertTriangle, Loader2 } from 'lucide-react';
import { suggestProjectFolderStructure } from './actions';

export default function FolderStructurePage() {
  const [projectDescription, setProjectDescription] = useState('');
  const [suggestedStructure, setSuggestedStructure] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuggestedStructure(null);

    if (!projectDescription.trim()) {
      setError("Please provide a project description.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await suggestProjectFolderStructure(projectDescription);
        if (result.folderStructure) {
          setSuggestedStructure(result.folderStructure);
        } else {
          setError(result.error || "Failed to get suggestion. Unknown error.");
        }
      } catch (e: any) {
        setError(e.message || "An unexpected error occurred.");
      }
    });
  };

  return (
    <div className="container mx-auto py-10 animate-in fade-in duration-500">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <Lightbulb className="mx-auto h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-3xl font-headline">AI Folder Structure Suggester</CardTitle>
          <CardDescription className="text-lg">
            Describe your Firebase and React project, and our AI will suggest an optimal folder structure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="projectDescription" className="text-base">Project Description</Label>
              <Textarea
                id="projectDescription"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="e.g., A to-do list app with user authentication, real-time updates using Firestore, and a separate admin dashboard..."
                rows={6}
                className="text-base"
                disabled={isPending}
              />
            </div>
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-3" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                'Suggest Structure'
              )}
            </Button>
          </form>
        </CardContent>
        
        {error && (
          <CardFooter className="flex flex-col items-start mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-md">
             <div className="flex items-center text-destructive mb-2">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <h3 className="font-semibold">Error</h3>
             </div>
            <p className="text-sm text-destructive">{error}</p>
          </CardFooter>
        )}

        {suggestedStructure && (
          <CardFooter className="flex flex-col items-start mt-6 p-4 bg-primary/5 border border-primary/20 rounded-md">
            <h3 className="text-xl font-semibold text-primary mb-3">Suggested Folder Structure:</h3>
            <pre className="whitespace-pre-wrap bg-muted/50 p-4 rounded-md text-sm text-foreground w-full overflow-x-auto font-code">
              {suggestedStructure}
            </pre>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
