// use server'
'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting SEO fixes based on identified errors and the website's technology.
 *
 * - suggestFixes - A function that takes SEO errors and website technology as input and suggests fixes.
 * - SuggestFixesInput - The input type for the suggestFixes function.
 * - SuggestFixesOutput - The return type for the suggestFixes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFixesInputSchema = z.object({
  seoErrors: z.string().describe('A description of the SEO errors found on the website.'),
  websiteTechnology: z.string().describe('The technology used to build the website (e.g., CMS or programming language).'),
});
export type SuggestFixesInput = z.infer<typeof SuggestFixesInputSchema>;

const SuggestFixesOutputSchema = z.object({
  suggestedFixes: z.string().describe('Suggestions for fixing the identified SEO errors, tailored to the website technology.'),
});
export type SuggestFixesOutput = z.infer<typeof SuggestFixesOutputSchema>;

export async function suggestFixes(input: SuggestFixesInput): Promise<SuggestFixesOutput> {
  return suggestFixesFlow(input);
}

const suggestFixesPrompt = ai.definePrompt({
  name: 'suggestFixesPrompt',
  input: {schema: SuggestFixesInputSchema},
  output: {schema: SuggestFixesOutputSchema},
  prompt: `You are an SEO expert. Given the following SEO errors and the technology used to build the website, suggest fixes tailored to that technology.

SEO Errors: {{{seoErrors}}}
Website Technology: {{{websiteTechnology}}}

Suggest fixes in Spanish.
`,
});

const suggestFixesFlow = ai.defineFlow(
  {
    name: 'suggestFixesFlow',
    inputSchema: SuggestFixesInputSchema,
    outputSchema: SuggestFixesOutputSchema,
  },
  async input => {
    const {output} = await suggestFixesPrompt(input);
    return output!;
  }
);
