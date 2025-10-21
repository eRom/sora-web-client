import { z } from 'zod'

// Modèles Sora disponibles
export const SORA_MODELS = [
  { value: 'sora-2', label: 'Sora 2', description: 'Modèle le plus récent et performant' },
  { value: 'sora-1.5', label: 'Sora 1.5', description: 'Version précédente stable' },
] as const

// Durées disponibles
export const DURATIONS = [
  { value: 5, label: '5 secondes', description: 'Court et rapide' },
  { value: 10, label: '10 secondes', description: 'Durée standard' },
  { value: 20, label: '20 secondes', description: 'Plus de détails' },
  { value: 30, label: '30 secondes', description: 'Maximum autorisé' },
] as const

// Durée par défaut
export const DEFAULT_DURATION = 10

// Dimensions disponibles
export const DIMENSIONS = [
  { value: '1024x576', label: '1024x576 (16:9)', description: 'Format paysage standard' },
  { value: '576x1024', label: '576x1024 (9:16)', description: 'Format portrait mobile' },
  { value: '1024x1024', label: '1024x1024 (1:1)', description: 'Format carré' },
] as const

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
