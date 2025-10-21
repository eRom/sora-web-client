"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Video as VideoIcon, ExternalLink, Trash2, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { listVideos, getVideoStatus, deleteVideo } from "@/actions/video-actions";
import { Video, VideoStatus } from "@/types/video";

interface VideoListSheetProps {
  children: React.ReactNode;
}

const POLLING_INTERVAL = 5000; // 5 secondes

export function VideoListSheet({ children }: VideoListSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Charger les vidéos
  const loadVideos = async () => {
    setIsLoading(true);
    try {
      const result = await listVideos();
      if (result.success && result.videos) {
        setVideos(result.videos);
      }
    } catch {
      console.error("Erreur lors du chargement des vidéos");
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les vidéos à l'ouverture uniquement
  useEffect(() => {
    if (isOpen) {
      loadVideos();
    }
  }, [isOpen]);

  // Polling pour les vidéos en cours
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(async () => {
      setVideos(prevVideos => {
        const pendingVideos = prevVideos.filter(v => v.status === "pending" || v.status === "processing");
        
        // Mettre à jour les statuts en parallèle
        pendingVideos.forEach(async (video) => {
          try {
            const result = await getVideoStatus(video.openaiVideoId);
            if (result.success && result.status) {
              setVideos(currentVideos => currentVideos.map(v => 
                v.id === video.id 
                  ? { ...v, status: result.status!, updatedAt: new Date() }
                  : v
              ));
            }
          } catch {
            console.error("Erreur lors de la vérification du statut");
          }
        });
        
        return prevVideos;
      });
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Ouvrir le sheet
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  // Supprimer une vidéo
  const handleDeleteVideo = async (videoId: string) => {
    try {
      const result = await deleteVideo(videoId);
      if (result.success) {
        toast.success("Vidéo supprimée avec succès");
        setVideos(videos.filter(v => v.id !== videoId));
      } else {
        toast.error(result.error || "Erreur lors de la suppression");
      }
    } catch {
      toast.error("Une erreur inattendue s'est produite");
    }
  };

  // Obtenir l'icône de statut
  const getStatusIcon = (status: VideoStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  // Obtenir le texte de statut
  const getStatusText = (status: VideoStatus) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "processing":
        return "En cours";
      case "completed":
        return "Terminée";
      case "failed":
        return "Échec";
      default:
        return "Inconnu";
    }
  };

  // Obtenir la couleur du badge
  const getStatusColor = (status: VideoStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "processing":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] bg-slate-900/95 backdrop-blur-xl border-slate-800/50">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-white">
            <VideoIcon className="h-5 w-5 text-purple-400" />
            Mes vidéos ({videos.length})
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
              <span className="ml-2 text-slate-400">Chargement...</span>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-8">
              <VideoIcon className="h-12 w-12 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400">Aucune vidéo générée</p>
              <p className="text-sm text-slate-500 mt-1">
                Vos vidéos générées apparaîtront ici
              </p>
            </div>
          ) : (
            videos.map((video) => (
              <Card key={video.id} className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* En-tête avec nom et statut */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate">
                          {video.name}
                        </h3>
                        <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                          {video.prompt}
                        </p>
                      </div>
                      <Badge className={`ml-2 ${getStatusColor(video.status)}`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(video.status)}
                          <span className="text-xs">{getStatusText(video.status)}</span>
                        </div>
                      </Badge>
                    </div>

                    {/* Détails de la vidéo */}
                    <div className="text-xs text-slate-500 space-y-1">
                      <div className="flex justify-between">
                        <span>Modèle:</span>
                        <span className="text-slate-300">{video.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dimensions:</span>
                        <span className="text-slate-300">{video.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Durée:</span>
                        <span className="text-slate-300">{video.duration}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Créée:</span>
                        <span className="text-slate-300">
                          {new Date(video.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                      <div className="flex items-center gap-2">
                        {video.status === "completed" && video.videoUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-xs bg-purple-600/20 border-purple-500/30 text-purple-300 hover:bg-purple-600/30"
                            onClick={() => window.open(video.videoUrl, "_blank")}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Voir
                          </Button>
                        )}
                      </div>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-xs bg-red-600/20 border-red-500/30 text-red-300 hover:bg-red-600/30"
                        onClick={() => handleDeleteVideo(video.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
