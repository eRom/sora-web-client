'use client'

import { deleteVideo, getVideos, renameVideo } from '@/actions/video-actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ActionResult } from '@/types/video'
import { Calendar, CheckCircle, Clock, Edit, FileVideo, List, Loader2, Monitor, Play, Sparkles, Timer, Trash2, Video, XCircle } from 'lucide-react'
import { useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface VideoData {
  id: string
  name: string
  model: string
  size: string
  duration: number
  prompt: string
  openAiVideoId: string | null
  filePath: string | null
  status: string
  errorMessage: string | null
  createdAt: Date
  updatedAt: Date
}

function RenameDialogContent({ video, onClose }: { video: VideoData; onClose: () => void }) {
  const [state, formAction] = useActionState(
    async (prevState: ActionResult | null, formData: FormData) => {
      return await renameVideo(formData)
    },
    null
  )

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || 'Vidéo renommée avec succès!')
      onClose()
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state, onClose])

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Edit className="w-5 h-5 text-primary" />
          Renommer la vidéo
        </DialogTitle>
        <DialogDescription>
          Choisissez un nouveau nom pour cette vidéo
        </DialogDescription>
      </DialogHeader>
      <form action={formAction} className="space-y-6">
        <input type="hidden" name="id" value={video.id} />
        <div className="space-y-2">
          <Input
            name="name"
            defaultValue={video.name}
            placeholder="Nouveau nom de la vidéo"
            maxLength={100}
            required
            className="text-base"
          />
        </div>
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" className="bg-gradient-to-r from-primary to-primary/90">
            Renommer
          </Button>
        </div>
      </form>
    </DialogContent>
  )
}

function DeleteConfirmDialog({ video, onClose }: { video: VideoData; onClose: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteVideo(video.id)
      if (result.success) {
        toast.success(result.message)
        onClose()
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error('Erreur lors de la suppression')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-destructive">
          <Trash2 className="w-5 h-5" />
          Supprimer la vidéo
        </DialogTitle>
        <DialogDescription>
          Êtes-vous sûr de vouloir supprimer &ldquo;{video.name}&rdquo; ? Cette action est irréversible.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-6">
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive font-medium">
            Cette action supprimera définitivement la vidéo de votre base de données et ne pourra pas être annulée.
          </p>
        </div>
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={onClose} disabled={isDeleting}>
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-gradient-to-r from-destructive to-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </>
            )}
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}

function VideoCard({ video, onUpdate }: { video: VideoData; onUpdate: () => void }) {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          color: 'default',
          icon: CheckCircle,
          text: 'Terminée',
          className: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400'
        }
      case 'processing':
        return {
          color: 'secondary',
          icon: Clock,
          text: 'En cours',
          className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400'
        }
      case 'failed':
        return {
          color: 'destructive',
          icon: XCircle,
          text: 'Échouée',
          className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400'
        }
      default:
        return {
          color: 'outline',
          icon: Clock,
          text: 'En attente',
          className: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400'
        }
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const statusInfo = getStatusInfo(video.status)
  const StatusIcon = statusInfo.icon

  return (
    <>
      <Card className="relative hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm group">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-base font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                {video.name}
              </CardTitle>
              <CardDescription className="text-sm flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                {formatDate(video.createdAt)}
              </CardDescription>
            </div>
            <Badge variant={statusInfo.color as 'default' | 'secondary' | 'destructive' | 'outline'} className={statusInfo.className}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusInfo.text}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Preview ou placeholder */}
          {video.filePath ? (
            <div className="relative w-full h-32 rounded-xl overflow-hidden bg-muted shadow-lg group/preview">
              <video
                className="w-full h-full object-cover group-hover/preview:scale-105 transition-transform duration-300"
                controls={false}
                preload="metadata"
              >
                <source src={video.filePath} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Play className="w-8 h-8 text-white" />
              </div>
            </div>
          ) : (
            <div className="w-full h-32 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
              <div className="text-center">
                <FileVideo className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Aucune preview</p>
              </div>
            </div>
          )}

          <Separator />

          {/* Informations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                Modèle:
              </span>
              <Badge variant="outline" className="text-xs font-medium">
                {video.model}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Monitor className="w-3 h-3" />
                Taille:
              </span>
              <span className="font-medium">{video.size}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Timer className="w-3 h-3" />
                Durée:
              </span>
              <span className="font-medium">{video.duration}s</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {video.filePath && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => {
                  window.open(video.filePath || '', '_blank')
                }}
              >
                <Play className="w-3 h-3 mr-1" />
                Lire
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsRenameDialogOpen(true)}
              className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors"
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>

          {/* Message d'erreur */}
          {video.errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">{video.errorMessage}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      {isRenameDialogOpen && (
        <RenameDialogContent
          video={video}
          onClose={() => {
            setIsRenameDialogOpen(false)
            onUpdate()
          }}
        />
      )}
      {isDeleteDialogOpen && (
        <DeleteConfirmDialog
          video={video}
          onClose={() => {
            setIsDeleteDialogOpen(false)
            onUpdate()
          }}
        />
      )}
    </>
  )
}

export function VideoList() {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  const loadVideos = async () => {
    try {
      setIsLoading(true)
      const videoList = await getVideos()
      setVideos(videoList as unknown as VideoData[])
    } catch {
      toast.error('Erreur lors du chargement des vidéos')
    } finally {
      setIsLoading(false)
    }
  }

  // Charger les vidéos à l'ouverture du sheet
  useEffect(() => {
    if (isOpen) {
      loadVideos()
    }
  }, [isOpen])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-3 px-6 py-3 h-auto bg-gradient-to-r from-background to-background/80 hover:from-primary/10 hover:to-primary/5 border-primary/20 hover:border-primary/40 transition-all duration-300">
          <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
            <List className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left">
            <div className="font-semibold">Mes vidéos</div>
            <div className="text-xs text-muted-foreground">
              {videos.length > 0 ? `${videos.length} vidéo${videos.length > 1 ? 's' : ''}` : 'Aucune vidéo'}
            </div>
          </div>
          {videos.length > 0 && (
            <Badge variant="secondary" className="px-2 py-1 bg-primary/10 text-primary border-primary/20">
              {videos.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[600px] border-0 bg-gradient-to-br from-background via-background to-muted/20">
        <SheetHeader className="pb-6">
          <SheetTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <Video className="w-4 h-4 text-primary-foreground" />
            </div>
            Mes vidéos générées
          </SheetTitle>
          <SheetDescription className="text-base">
            Gérez vos vidéos créées avec Sora 2
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 max-h-[calc(100vh-140px)] overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground">Chargement des vidéos...</p>
              </div>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Video className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Aucune vidéo</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Vous n&apos;avez pas encore généré de vidéo avec Sora 2. Créez votre première vidéo maintenant !
              </p>
              <Button 
                onClick={() => setIsOpen(false)}
                className="bg-gradient-to-r from-primary to-primary/90"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Créer une vidéo
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onUpdate={loadVideos}
                />
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
