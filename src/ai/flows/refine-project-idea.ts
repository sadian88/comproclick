
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
      'The AI-refined version of the project idea, incorporating suggestions for clarity, completeness, and impact. This should be a constructive suggestion to enhance the original idea.'
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
  prompt: `You are an expert AI assistant specialized in helping users conceptualize and refine project ideas.
Your goal is to collaborate with the user. Given their initial project idea, analyze it and provide a constructive, enhanced version.
This enhanced version should aim to improve clarity, completeness, market appeal, or innovative aspects.
Focus on being helpful and inspiring. If the idea is already very good, you can acknowledge that and offer minor polish or confirm its strength.
Do not just repeat the idea; offer tangible improvements or a more compelling phrasing.

Initial Project Idea:
{{{projectIdea}}}

Constructively Refined Project Idea (return only this enhanced idea text):`,
});

const refineProjectIdeaFlow = ai.defineFlow(
  {
    name: 'refineProjectIdeaFlow',
    inputSchema: RefineProjectIdeaInputSchema,
    outputSchema: RefineProjectIdeaOutputSchema,
  },
  async input => {
    // Basic check to prevent refining empty or too short ideas, though the UI also does this.
    if (!input.projectIdea || input.projectIdea.trim().length < 5) {
      return { refinedIdea: input.projectIdea }; // Return original if too short
    }
    const {output} = await refineProjectIdeaPrompt(input);
    // Ensure output is not null and refinedIdea is not empty. If AI fails, return original.
    return (output && output.refinedIdea) ? output : { refinedIdea: input.projectIdea };
  }
);

    