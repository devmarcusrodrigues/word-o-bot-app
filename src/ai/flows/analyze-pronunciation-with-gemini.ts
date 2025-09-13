'use server';
/**
 * @fileOverview Analyzes the pronunciation of a user's audio recording using Gemini, providing a similarity score and star rating.
 *
 * - analyzePronunciation - A function that analyzes the pronunciation and returns a score and star rating.
 * - AnalyzePronunciationInput - The input type for the analyzePronunciation function.
 * - AnalyzePronunciationOutput - The return type for the analyzePronunciation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePronunciationInputSchema = z.object({
  recordedAudioUri: z
    .string()
    .describe(
      'The recorded audio of the user pronouncing the phrase, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected typo here
    ),
  targetPhrase: z.string().describe('The target phrase to compare the pronunciation against.'),
});
export type AnalyzePronunciationInput = z.infer<typeof AnalyzePronunciationInputSchema>;

const AnalyzePronunciationOutputSchema = z.object({
  similarityPercentage: z
    .number()
    .describe('The similarity percentage between the recorded audio and the target phrase.'),
  starRating: z.number().describe('The star rating (1-3) based on the similarity percentage.'),
});
export type AnalyzePronunciationOutput = z.infer<typeof AnalyzePronunciationOutputSchema>;

export async function analyzePronunciation(input: AnalyzePronunciationInput): Promise<AnalyzePronunciationOutput> {
  return analyzePronunciationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePronunciationPrompt',
  input: {schema: AnalyzePronunciationInputSchema},
  output: {schema: AnalyzePronunciationOutputSchema},
  prompt: `You are an AI pronunciation expert. You will analyze the user\'s recorded pronunciation of the target phrase and provide a similarity percentage and a star rating.

  Analyze the following audio recording:
  {{media url=recordedAudioUri}}

  Compared to the target phrase: {{{targetPhrase}}}

  Provide the similarityPercentage as a number between 0 and 100. Provide the starRating as a number between 1 and 3, based on the following:
  - 80% or higher: 3 stars
  - 60% to 79%: 2 stars
  - Below 60%: 1 star`,
});

const analyzePronunciationFlow = ai.defineFlow(
  {
    name: 'analyzePronunciationFlow',
    inputSchema: AnalyzePronunciationInputSchema,
    outputSchema: AnalyzePronunciationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
