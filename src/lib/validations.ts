import { z } from 'zod'

// Modèles Sora disponibles
export const SORA_MODELS = [
  { value: 'sora-2', label: 'Sora 2', description: 'Modèle standard pour la plupart des cas d\'usage' },
  { value: 'sora-2-pro', label: 'Sora 2 Pro', description: 'Modèle avancé avec plus de capacités' },
] as const

// Durées disponibles
export const DURATIONS = [
  { value: 4, label: '4 secondes', description: 'Court et rapide' },
  { value: 8, label: '8 secondes', description: 'Durée standard' },
  { value: 12, label: '12 secondes', description: 'Plus de détails' },
] as const

// Durée par défaut
export const DEFAULT_DURATION = 4

// Dimensions disponibles par modèle
export const MODEL_DIMENSIONS = {
  'sora-2': [
    { value: '1280x720', label: '1280x720 (16:9)', description: 'Format paysage HD' },
    { value: '720x1280', label: '720x1280 (9:16)', description: 'Format portrait HD' },
  ],
  'sora-2-pro': [
    { value: '1280x720', label: '1280x720 (16:9)', description: 'Format paysage HD' },
    { value: '720x1280', label: '720x1280 (9:16)', description: 'Format portrait HD' },
    { value: '1024x1792', label: '1024x1792 (9:16)', description: 'Format portrait haute résolution' },
    { value: '1792x1024', label: '1792x1024 (16:9)', description: 'Format paysage haute résolution' },
  ],
} as const

// Dimensions par défaut (pour compatibilité)
export const DIMENSIONS = MODEL_DIMENSIONS['sora-2']

// Matrice de prix par modèle et dimension (en USD par seconde)
export const PRICING_MATRIX = {
  'sora-2': {
    '1280x720': 0.10,
    '720x1280': 0.10,
  },
  'sora-2-pro': {
    '1280x720': 0.30,
    '720x1280': 0.30,
    '1024x1792': 0.50,
    '1792x1024': 0.50,
  },
} as const

// Fonction pour obtenir le tarif par seconde
export const getPricePerSecond = (model: string, size: string): number => {
  return PRICING_MATRIX[model as keyof typeof PRICING_MATRIX]?.[size as keyof typeof PRICING_MATRIX['sora-2']] || 0
}

// Schéma de validation pour la génération de vidéo
export const videoGenerationSchema = z.object({
  prompt: z
    .string()
    .min(10, 'Le prompt doit contenir au moins 10 caractères')
    .max(1000, 'Le prompt ne peut pas dépasser 1000 caractères'),
  model: z
    .string()
    .refine((val) => SORA_MODELS.some(m => m.value === val), {
      message: 'Modèle non valide'
    }),
  duration: z
    .number()
    .min(5, 'La durée minimum est de 5 secondes')
    .max(30, 'La durée maximum est de 30 secondes'),
  size: z
    .string()
    .refine((val) => DIMENSIONS.some(d => d.value === val), {
      message: 'Dimension non valide'
    }),
  image: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      if (!file) return true
      return file.type.startsWith('image/')
    }, 'Le fichier doit être une image')
    .refine((file) => {
      if (!file) return true
      return file.size <= 10 * 1024 * 1024 // 10MB
    }, 'L\'image ne peut pas dépasser 10MB'),
})

export type VideoGenerationInput = z.infer<typeof videoGenerationSchema>

// Schéma de validation pour le renommage
export const renameVideoSchema = z.object({
  id: z.string().min(1, 'ID requis'),
  name: z
    .string()
    .min(1, 'Le nom est requis')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
})

export type RenameVideoInput = z.infer<typeof renameVideoSchema>

// Schéma de validation pour la suppression
export const deleteVideoSchema = z.object({
  id: z.string().min(1, 'ID requis'),
})

export type DeleteVideoInput = z.infer<typeof deleteVideoSchema>
