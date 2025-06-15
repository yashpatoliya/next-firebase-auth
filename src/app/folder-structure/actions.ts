"use server";

import { suggestFolderStructure, type SuggestFolderStructureOutput } from '@/ai/flows/suggest-folder-structure';

interface ActionResult {
  folderStructure?: string;
  error?: string;
}

export async function suggestProjectFolderStructure(projectDescription: string): Promise<ActionResult> {
  if (!projectDescription || projectDescription.trim().length < 10) {
    return { error: "Project description must be at least 10 characters long." };
  }

  try {
    const result: SuggestFolderStructureOutput = await suggestFolderStructure({ projectDescription });
    if (result.folderStructure) {
      return { folderStructure: result.folderStructure };
    }
    return { error: "AI could not generate a folder structure based on the description." };
  } catch (error: any) {
    console.error("Error calling suggestFolderStructure flow:", error);
    // It's good practice to not expose raw error messages to the client for security reasons
    // unless they are known to be safe.
    let errorMessage = "An error occurred while generating the folder structure.";
    if (error.message && typeof error.message === 'string' && error.message.length < 200) {
        // Only include potentially user-friendly messages
        if (error.message.includes('quota') || error.message.includes('limit')) {
            errorMessage = "The request could not be processed due to limitations. Please try again later.";
        } else if (error.message.includes('API key')) {
            errorMessage = "There's an issue with the AI service configuration. Please contact support.";
        }
        // Avoid leaking internal details, for other errors, stick to generic message
    }
    return { error: errorMessage };
  }
}
