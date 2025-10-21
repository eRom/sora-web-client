"use server";

import { OpenAI } from "openai";
import { prisma } from "@/lib/prisma";
import { VideoFormData, Video, ActionResult, VideoListResult, VideoStatusResult } from "@/types/video";
import { generateVideoName } from "@/lib/video-helpers";

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
    const videoParams: any = {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await openai.videos.create(videoParams as any);

    // Créer l'enregistrement en base de données
    const video = await prisma.video.create({
      data: {
        openaiVideoId: response.id,
        name: generateVideoName(data.prompt),
        prompt: data.prompt,
        model: data.model,
        size: data.size,
        duration: Number(data.duration),
        status: "pending",
      },
    });

    return {
      success: true,
      data: video,
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
      data: { videos },
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
 * Récupère le statut d'une vidéo depuis l'API OpenAI
 */
export async function getVideoStatus(openaiVideoId: string): Promise<ActionResult<VideoStatusResult>> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await openai.videos.retrieve(openaiVideoId) as any;

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
        videoUrl: status === "completed" ? (response as any).video_url : undefined,
        thumbnailUrl: status === "completed" ? (response as any).thumbnail_url : undefined,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      data: {
        status,
        videoUrl: status === "completed" ? (response as any).video_url : undefined,
        thumbnailUrl: status === "completed" ? (response as any).thumbnail_url : undefined,
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
