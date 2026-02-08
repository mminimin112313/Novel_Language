import { z } from "zod";

export const EpisodeSelectionSchema = z
  .object({
    sceneIds: z.array(z.string().min(1)).min(1).optional(),
    narrativeRange: z
      .object({
        from: z.number().int().min(1),
        to: z.number().int().min(1)
      })
      .optional()
  })
  .strict()
  .refine(
    (v) => {
      if (v.narrativeRange && v.narrativeRange.to < v.narrativeRange.from) return false;
      return true;
    },
    { message: "selection.narrativeRange.to must be >= from" }
  );

export const EpisodeRequirementsSchema = z
  .object({
    language: z.enum(["ko"]).default("ko"),
    style: z.enum(["Cinematic", "Noir", "Classic", "LightNovel"]).default("Classic"),
    pov: z.enum(["first_person", "third_person_limited", "omniscient"]).default("third_person_limited"),
    tense: z.enum(["past", "present"]).default("past"),
    targetChars: z.number().int().min(500).max(50000).optional(),
    minChars: z.number().int().min(200).max(50000).optional(),
    maxChars: z.number().int().min(200).max(200000).optional(),
    bannedPhrases: z.array(z.string().min(1)).optional(),
    requiredMotifs: z.array(z.string().min(1)).optional(),
    contentWarnings: z.array(z.string().min(1)).optional(),
    citeEvents: z.boolean().default(true)
  })
  .strict()
  .refine(
    (v) => {
      if (v.minChars && v.maxChars && v.maxChars < v.minChars) return false;
      return true;
    },
    { message: "requirements.maxChars must be >= minChars" }
  );

export const EpisodeSpecSchema = z
  .object({
    id: z.string().min(1),
    storyId: z.string().min(1),
    title: z.string().min(1),
    selection: EpisodeSelectionSchema.optional(),
    direction: z.string().min(1),
    requirements: EpisodeRequirementsSchema.default({
      language: "ko",
      style: "Classic",
      pov: "third_person_limited",
      tense: "past",
      citeEvents: true
    })
  })
  .strict();

export type EpisodeSpec = z.infer<typeof EpisodeSpecSchema>;
