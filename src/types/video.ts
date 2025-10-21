import { z } from "zod";

// Modèles de vidéo disponibles
export const VideoModelSchema = z.enum(["sora-2", "sora-2-pro"]);
export type VideoModel = z.infer<typeof VideoModelSchema>;

// Dimensions de vidéo disponibles
export const VideoDimensionSchema = z.enum(["1280x720", "720x1280", "1024x1792", "1792x1024"]);
export type VideoDimension = z.infer<typeof VideoDimensionSchema>;

// Durées de vidéo disponibles
export const VideoDurationSchema = z.number().refine((val) => [4, 8, 12].includes(val), {
  message: "La durée doit être 4, 8 ou 12 secondes"
});
export type VideoDuration = z.infer<typeof VideoDurationSchema>;

// Statuts de vidéo
export const VideoStatusSchema = z.enum(["pending", "processing", "completed", "failed"]);
export type VideoStatus = z.infer<typeof VideoStatusSchema>;

// Schéma pour les données du formulaire (avec duration en string pour les selects)
export const VideoFormDataSchema = z.object({
  model: VideoModelSchema,
  size: VideoDimensionSchema,
  duration: z.string().transform((val) => parseInt(val, 10)).pipe(VideoDurationSchema),
  prompt: z.string().min(1, "Le prompt est requis").max(2000, "Le prompt ne peut pas dépasser 2000 caractères"),
  referenceImage: z.instanceof(File).optional(),
});

// Schéma pour le formulaire UI (avec duration en string)
export const VideoFormUISchema = z.object({
  model: VideoModelSchema,
  size: VideoDimensionSchema,
  duration: z.string(),
  prompt: z.string().min(1, "Le prompt est requis").max(2000, "Le prompt ne peut pas dépasser 2000 caractères"),
});

export type VideoFormData = z.infer<typeof VideoFormDataSchema>;
export type VideoFormUI = z.infer<typeof VideoFormUISchema>;

// Interface pour une vidéo dans la base de données
export interface Video {
  id: string;
  openaiVideoId: string;
  name: string;
  prompt: string;
  model: VideoModel;
  size: VideoDimension;
  duration: VideoDuration;
  status: VideoStatus;
  videoUrl?: string;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour les réponses des actions
export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Interface pour la liste des vidéos
export interface VideoListResult {
  videos: Video[];
}

// Interface pour le statut d'une vidéo
export interface VideoStatusResult {
  status: VideoStatus;
  videoUrl?: string;
  thumbnailUrl?: string;
}
