// src/ai/flows/refine-project-idea.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for refining a user's project idea using AI.
 *
 * The flow takes a project idea description as input and provides real-time suggestions to help the user articulate their vision more effectively.
 *
 * @fileOverview Defines:
 * - refineProjectIdea: The main function to refine a project idea.
 * - RefineProjectIdeaInput: The input type for the refineProjectIdea function.
 * - RefineProjectIdeaOutput: The output type for the refineProjectIdea function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineProjectIdeaInputSchema = z.object({
  projectIdea: z
    .string()
    .describe('The user-provided description of their project idea.'),
});
export type RefineProjectIdeaInput = z.infer<typeof RefineProjectIdeaInputSchema>;

const RefineProjectIdeaOutputSchema = z.object({
  refinedIdea: z
    .string()
    .describe(
      'The AI-refined version of the project idea, incorporating suggestions for clarity and completeness.'
    ),
});
export type RefineProjectIdeaOutput = z.infer<typeof RefineProjectIdeaOutputSchema>;

export async function refineProjectIdea(input: RefineProjectIdeaInput): Promise<RefineProjectIdeaOutput> {
  return refineProjectIdeaFlow(input);
}

const refineProjectIdeaPrompt = ai.definePrompt({
  name: 'refineProjectIdeaPrompt',
  input: {schema: RefineProjectIdeaInputSchema},
  output: {schema: RefineProjectIdeaOutputSchema},
  prompt: `You are an AI assistant designed to help users refine their project ideas.  Given the user's initial project idea, provide suggestions and improvements to make the idea more clear, complete, and compelling.

Initial Project Idea: {{{projectIdea}}}

Refined Project Idea:`, //Crucially return only the refined idea
});

const refineProjectIdeaFlow = ai.defineFlow(
  {
    name: 'refineProjectIdeaFlow',
    inputSchema: RefineProjectIdeaInputSchema,
    outputSchema: RefineProjectIdeaOutputSchema,
  },
  async input => {
    const {output} = await refineProjectIdeaPrompt(input);
    return output!;
  }
);
