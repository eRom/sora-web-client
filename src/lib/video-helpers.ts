import { ACCEPTED_IMAGE_FORMATS, COST_PER_SECOND_MATRIX, MAX_IMAGE_SIZE } from "@/lib/constants";
import { VideoDimension, VideoDuration, VideoModel } from "@/types/video";

/**
 * Valide le format et la taille d'un fichier image
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ACCEPTED_IMAGE_FORMATS.includes(file.type as typeof ACCEPTED_IMAGE_FORMATS[number])) {
    return {
      valid: false,
      error: "Format d'image non supporté. Utilisez JPG, PNG ou WebP.",
    };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: "Image trop volumineuse. Taille maximale : 5MB.",
    };
  }

  return { valid: true };
}

/**
 * Valide les dimensions d'une image
 */
export function validateImageDimensions(file: File): Promise<{ valid: boolean; error?: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const { width, height } = img;
      
      // Vérifier les dimensions minimales
      if (width < 256 || height < 256) {
        resolve({
          valid: false,
          error: "Dimensions trop petites. Minimum : 256x256 pixels.",
        });
        return;
      }

      // Vérifier le ratio d'aspect
      const aspectRatio = width / height;
      if (aspectRatio < 0.5 || aspectRatio > 2.0) {
        resolve({
          valid: false,
          error: "Ratio d'aspect non supporté. Utilisez un ratio entre 0.5 et 2.0.",
        });
        return;
      }

      resolve({ valid: true });
    };

    img.onerror = () => {
      resolve({
        valid: false,
        error: "Impossible de charger l'image.",
      });
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Calcule le coût estimé d'une génération vidéo
 * Formule : Tarif par seconde × durée
 */
export function calculateVideoCost(
  model: VideoModel,
  size: VideoDimension,
  duration: VideoDuration
): number {
  const modelRates = COST_PER_SECOND_MATRIX[model];
  if (!modelRates) return 0;
  
  const perSecondRate = modelRates[size as keyof typeof modelRates];
  if (typeof perSecondRate === "undefined") return 0;
  
  return perSecondRate * duration;
}

/**
 * Formate le coût pour l'affichage
 */
export function formatCost(cost: number): string {
  return `$${cost.toFixed(2)}`;
}

/**
 * Génère un nom unique pour une vidéo
 */
export function generateVideoName(prompt: string): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, "");
  const truncatedPrompt = prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, "");
  return `sora_${truncatedPrompt}_${timestamp}`;
}
