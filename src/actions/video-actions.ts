"use server";

import { prisma } from "@/lib/prisma";
import { generateVideoName } from "@/lib/video-helpers";
import { ActionResult, Video, VideoFormData, VideoListResult, VideoStatusResult } from "@/types/video";
import { OpenAI } from "openai";

// Initialiser OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Génère une vidéo avec l'API Sora 2
 */
export async function generateVideo(data: VideoFormData): Promise<ActionResult<Video>> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return {
        success: false,
        error: "Clé API OpenAI non configurée",
      };
    }

    // Préparer les paramètres pour l'API OpenAI
    const videoParams: Record<string, unknown> = {
      model: data.model,
      prompt: data.prompt,
      size: data.size,
      duration: data.duration,
    };

    // Ajouter l'image de référence si fournie
    if (data.referenceImage) {
      const imageBuffer = await data.referenceImage.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString("base64");
      videoParams.image = `data:${data.referenceImage.type};base64,${base64Image}`;
    }

    // Appeler l'API OpenAI
    const response = await openai.videos.create(videoParams as unknown as Parameters<typeof openai.videos.create>[0]);

    // Créer l'enregistrement en base de données
    const video = await prisma.video.create({
      data: {
        openaiVideoId: response.id,
        name: generateVideoName(data.prompt),
        prompt: data.prompt,
        model: data.model as "sora-2" | "sora-2-pro",
        size: data.size as "1280x720" | "720x1280" | "1024x1792" | "1792x1024",
        duration: Number(data.duration) as 4 | 8 | 12,
        status: "pending",
      },
    });

    return {
      success: true,
      data: video as Video,
    };
  } catch (error: unknown) {
    console.error("Erreur lors de la génération de vidéo:", error);
    
    let errorMessage = "Échec de la génération de la vidéo";
    
    if (error && typeof error === "object" && "code" in error) {
      const openaiError = error as { code?: string; message?: string };
      if (openaiError.code === "invalid_api_key") {
        errorMessage = "Clé API OpenAI invalide";
      } else if (openaiError.message) {
        errorMessage = openaiError.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Récupère la liste des vidéos depuis la base de données locale
 */
export async function listVideos(): Promise<ActionResult<VideoListResult>> {
  try {
    const videos = await prisma.video.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: { videos: videos as Video[] },
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des vidéos:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération des vidéos",
    };
  }
}

/**
 * Récupère la liste des vidéos (alias pour listVideos)
 */
export async function getVideos() {
  const result = await listVideos();
  if (result.success && result.data) {
    return result.data.videos;
  }
  throw new Error(result.error);
}

/**
 * Récupère le statut d'une vidéo depuis l'API OpenAI
 */
export async function getVideoStatus(openaiVideoId: string): Promise<ActionResult<VideoStatusResult>> {
  try {
    const response = await openai.videos.retrieve(openaiVideoId) as {
      status: string;
      video_url?: string;
      thumbnail_url?: string;
    };

    // Mapper les statuts OpenAI vers nos statuts
    let status: "pending" | "processing" | "completed" | "failed";
    switch (response.status) {
      case "queued":
        status = "pending";
        break;
      case "in_progress":
        status = "processing";
        break;
      case "completed":
        status = "completed";
        break;
      case "failed":
        status = "failed";
        break;
      default:
        status = "pending";
    }

    // Mettre à jour la base de données locale
    await prisma.video.update({
      where: { openaiVideoId },
      data: {
        status,
        ...(status === "completed" && response.video_url && { videoUrl: response.video_url }),
        ...(status === "completed" && response.thumbnail_url && { thumbnailUrl: response.thumbnail_url }),
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      data: {
        status,
        videoUrl: status === "completed" ? response.video_url : undefined,
        thumbnailUrl: status === "completed" ? response.thumbnail_url : undefined,
      },
    };
  } catch (error) {
    console.error("Erreur lors de la récupération du statut:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération du statut",
    };
  }
}

/**
 * Supprime une vidéo
 */
export async function deleteVideo(videoId: string): Promise<ActionResult> {
  try {
    // Récupérer la vidéo pour obtenir l'ID OpenAI
    const video = await prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      return {
        success: false,
        error: "Vidéo non trouvée",
      };
    }

    // Supprimer de l'API OpenAI
    try {
      await openai.videos.delete(video.openaiVideoId);
    } catch (openaiError) {
      console.warn("Erreur lors de la suppression OpenAI:", openaiError);
      // Continuer même si la suppression OpenAI échoue
    }

    // Supprimer de la base de données locale
    await prisma.video.delete({
      where: { id: videoId },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return {
      success: false,
      error: "Erreur lors de la suppression de la vidéo",
    };
  }
}

/**
 * Renomme une vidéo
 */
export async function renameVideo(formData: FormData): Promise<ActionResult> {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;

    if (!id || !name) {
      return {
        success: false,
        error: "ID et nom requis",
      };
    }

    await prisma.video.update({
      where: { id },
      data: { name },
    });

    return {
      success: true,
      message: "Vidéo renommée avec succès",
    };
  } catch (error) {
    console.error("Erreur lors du renommage:", error);
    return {
      success: false,
      error: "Erreur lors du renommage de la vidéo",
    };
  }
}
