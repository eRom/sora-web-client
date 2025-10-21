import { VideoModel, VideoDimension } from "@/types/video";

// Modèles de vidéo disponibles avec leurs descriptions
export const VIDEO_MODELS = {
  "sora-2": {
    label: "Sora 2",
    description: "Modèle standard pour la plupart des cas d'usage",
  },
  "sora-2-pro": {
    label: "Sora 2 Pro",
    description: "Modèle avancé avec plus de capacités",
  },
} as const;

// Dimensions disponibles par modèle
export const MODEL_DIMENSIONS: Record<VideoModel, VideoDimension[]> = {
  "sora-2": ["1280x720", "720x1280"],
  "sora-2-pro": ["1280x720", "720x1280", "1024x1792", "1792x1024"],
};

// Durées disponibles
export const VIDEO_DURATIONS = [4, 8, 12] as const;

// Tarifs par seconde pour Sora 2 (en USD) - Source OpenAI officielle
export const COST_PER_SECOND_MATRIX = {
  "sora-2": {
    "1280x720": 0.10,
    "720x1280": 0.10,
  },
  "sora-2-pro": {
    "1280x720": 0.30,
    "720x1280": 0.30,
    "1024x1792": 0.50,
    "1792x1024": 0.50,
  },
} as const;

// Formats d'image acceptés
export const ACCEPTED_IMAGE_FORMATS = ["image/jpeg", "image/png", "image/webp"] as const;

// Taille maximale d'image (5MB)
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

// Messages d'erreur
export const ERROR_MESSAGES = {
  INVALID_API_KEY: "Clé API OpenAI invalide",
  GENERATION_FAILED: "Échec de la génération de la vidéo",
  INVALID_IMAGE_FORMAT: "Format d'image non supporté",
  IMAGE_TOO_LARGE: "Image trop volumineuse (max 5MB)",
  INVALID_IMAGE_DIMENSIONS: "Dimensions d'image invalides",
  NETWORK_ERROR: "Erreur de connexion",
  UNKNOWN_ERROR: "Une erreur inattendue s'est produite",
} as const;

// Messages de succès
export const SUCCESS_MESSAGES = {
  VIDEO_GENERATED: "Vidéo générée avec succès",
  VIDEO_DELETED: "Vidéo supprimée avec succès",
} as const;
