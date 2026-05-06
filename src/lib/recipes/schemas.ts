import { z } from "zod";

export const extractedIngredientSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().nullable(),
  unit: z.string().nullable(),
  rawText: z.string().min(1),
});

export const extractedStepSchema = z.object({
  stepNumber: z.number().int().positive(),
  description: z.string().min(1),
  estimatedTimeMinutes: z.number().int().positive().nullable(),
});

export const extractedRecipeSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable(),
  ingredients: z.array(extractedIngredientSchema),
  steps: z.array(extractedStepSchema),
  servings: z.number().int().positive().nullable(),
  estimatedTimeMinutes: z.number().int().positive().nullable(),
  difficulty: z.enum(["easy", "medium", "hard"]).nullable(),
  dishType: z.string().nullable(),
  tags: z.array(z.string()),
  caloriesEstimate: z.number().int().positive().nullable(),
  confidence: z.number().min(0).max(1),
  warnings: z.array(z.string()),
});

export type ExtractedRecipe = z.infer<typeof extractedRecipeSchema>;
