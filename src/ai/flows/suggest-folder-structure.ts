'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting a folder structure for a Firebase and React project.
 *
 * The flow takes a project description as input and returns a suggested folder structure.
 * - suggestFolderStructure - The main function to trigger the folder structure suggestion flow.
 * - SuggestFolderStructureInput - The input type for the suggestFolderStructure function.
 * - SuggestFolderStructureOutput - The output type for the suggestFolderStructure function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFolderStructureInputSchema = z.object({
  projectDescription: z
    .string()
    .describe('A description of the Firebase and React project.'),
});
export type SuggestFolderStructureInput = z.infer<
  typeof SuggestFolderStructureInputSchema
>;

const SuggestFolderStructureOutputSchema = z.object({
  folderStructure: z
    .string()
    .describe('The suggested folder structure for the project.'),
});
export type SuggestFolderStructureOutput = z.infer<
  typeof SuggestFolderStructureOutputSchema
>;

export async function suggestFolderStructure(
  input: SuggestFolderStructureInput
): Promise<SuggestFolderStructureOutput> {
  return suggestFolderStructureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFolderStructurePrompt',
  input: {schema: SuggestFolderStructureInputSchema},
  output: {schema: SuggestFolderStructureOutputSchema},
  prompt: `You are an expert software architect specializing in folder structures for Firebase and React projects.

  Based on the following project description, suggest an optimized folder structure:

  Project Description: {{{projectDescription}}}
  `,
});

const suggestFolderStructureFlow = ai.defineFlow(
  {
    name: 'suggestFolderStructureFlow',
    inputSchema: SuggestFolderStructureInputSchema,
    outputSchema: SuggestFolderStructureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
