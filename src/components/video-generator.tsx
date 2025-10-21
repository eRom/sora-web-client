'use client'

import { generateVideo } from '@/actions/video-actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { MODEL_DIMENSIONS as CONSTANTS_DIMENSIONS, COST_PER_SECOND_MATRIX, VIDEO_DURATIONS, VIDEO_MODELS } from '@/lib/constants'
import { DEFAULT_DURATION } from '@/lib/validations'
import { ActionResult, Video } from '@/types/video'
import { Clock, FileImage, Image as ImageIcon, Loader2, Monitor, Settings, Sparkles, Upload, Wand2, X } from 'lucide-react'
import Image from 'next/image'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'

function SubmitButton({ estimatedCost }: { estimatedCost: number }) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
      size="lg"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
          Génération en cours...
        </>
      ) : (
        <>
          <Wand2 className="w-5 h-5 mr-3" />
          Générer la vidéo ({estimatedCost.toFixed(2)} $US)
        </>
      )}
    </Button>
  )
}

export function VideoGenerator() {
  const [selectedModel, setSelectedModel] = useState<string>('sora-2')
  const [selectedDuration, setSelectedDuration] = useState<number>(DEFAULT_DURATION)
  const [selectedSize, setSelectedSize] = useState<string>('1280x720')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [estimatedCost, setEstimatedCost] = useState<number>(0)

  const [state, formAction] = useActionState(
    async (prevState: ActionResult<Video> | null, formData: FormData) => {
      const data = {
        model: formData.get('model') as "sora-2" | "sora-2-pro",
        size: formData.get('size') as "1280x720" | "720x1280" | "1024x1792" | "1792x1024",
        duration: parseInt(formData.get('duration') as string),
        prompt: formData.get('prompt') as string,
        referenceImage: formData.get('image') as File | undefined,
      }
      return await generateVideo(data)
    },
    null
  )

  // Mettre à jour les dimensions disponibles quand le modèle change
  useEffect(() => {
    const availableDimensions = CONSTANTS_DIMENSIONS[selectedModel as keyof typeof CONSTANTS_DIMENSIONS]
    if (availableDimensions && !availableDimensions.some(dim => dim.value === selectedSize)) {
      // Si la taille actuelle n'est pas disponible pour le nouveau modèle, utiliser la première disponible
      setSelectedSize(availableDimensions[0].value)
    }
  }, [selectedModel, selectedSize])

  // Calculer le coût estimé
  useEffect(() => {
    const pricePerSecond = COST_PER_SECOND_MATRIX[selectedModel as keyof typeof COST_PER_SECOND_MATRIX]?.[selectedSize as keyof typeof COST_PER_SECOND_MATRIX['sora-2']] || 0
    setEstimatedCost(pricePerSecond * selectedDuration)
  }, [selectedModel, selectedSize, selectedDuration])

  // Gérer les notifications
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || 'Vidéo générée avec succès!')
      // Réinitialiser le formulaire
      setImagePreview(null)
      if (imageInputRef.current) {
        imageInputRef.current.value = ''
      }
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner une image valide (JPG, PNG, WebP)')
        return
      }

      // Vérifier la taille (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('L&apos;image ne doit pas dépasser 10MB')
        return
      }

      // Créer une preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  const currentModel = VIDEO_MODELS[selectedModel as keyof typeof VIDEO_MODELS]

  return (
    <Card className="w-full border-0 shadow-2xl bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              Créer une nouvelle vidéo
            </CardTitle>
            <CardDescription className="text-base">
              Utilisez l&apos;IA Sora 2 pour générer des vidéos à partir de vos descriptions
            </CardDescription>
          </div>
          <Badge variant="outline" className="hidden sm:flex px-4 py-2 text-sm font-medium">
            <Settings className="w-4 h-4 mr-2" />
{currentModel?.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-8">
          {/* Modèle Sora */}
          <div className="space-y-4">
            <Label htmlFor="model" className="text-lg font-semibold flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-primary" />
              Modèle IA
            </Label>
            <Select
              name="model"
              value={selectedModel}
              onValueChange={setSelectedModel}
              required
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Choisir un modèle" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(VIDEO_MODELS).map(([key, model]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <span className="font-semibold">{model.label}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {model.description}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator className="my-8" />

          {/* Résolutions et durée */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label htmlFor="size" className="text-lg font-semibold flex items-center gap-2">
                <Monitor className="w-5 h-5 text-primary" />
                Résolutions
              </Label>
              <Select
                name="size"
                value={selectedSize}
                onValueChange={setSelectedSize}
                required
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Choisir la résolution" />
                </SelectTrigger>
                <SelectContent>
                  {CONSTANTS_DIMENSIONS[selectedModel as keyof typeof CONSTANTS_DIMENSIONS]?.map((dimension) => (
                    <SelectItem key={dimension.value} value={dimension.value}>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-gradient-to-br from-primary to-primary/80 rounded-full" />
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{dimension.label}</span>
                          <span className="text-xs text-muted-foreground">
                            - {dimension.orientation}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label htmlFor="duration" className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Durée
              </Label>
              <Select
                name="duration"
                value={selectedDuration.toString()}
                onValueChange={(value) => setSelectedDuration(parseInt(value))}
                required
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Choisir la durée" />
                </SelectTrigger>
                <SelectContent>
                  {VIDEO_DURATIONS.map((duration) => (
                    <SelectItem key={duration} value={duration.toString()}>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{duration} secondes</span>
                        {duration === DEFAULT_DURATION && (
                          <Badge variant="secondary" className="text-xs">
                            Défaut
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Image de référence */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              Image de référence
            </Label>
            <p className="text-sm text-muted-foreground">
              Ajoutez une image pour guider la génération (optionnel)
            </p>

            <input
              ref={imageInputRef}
              type="file"
              name="imageFile"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />

            {!imagePreview ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => imageInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-medium text-foreground">
                      Cliquez pour ajouter une image
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      JPG, PNG, WebP (max 10MB)
                    </p>
                  </div>
                </div>
              </Button>
            ) : (
              <div className="relative group">
                <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-border shadow-lg">
                  <Image
                    src={imagePreview}
                    alt="Image de référence"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeImage}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <X className="w-4 h-4" />
                </Button>
                <Badge className="absolute bottom-3 left-3" variant="secondary">
                  <FileImage className="w-3 h-3 mr-1" />
                  Image de référence
                </Badge>
              </div>
            )}
          </div>

          <Separator className="my-8" />

          {/* Prompt */}
          <div className="space-y-4">
            <Label htmlFor="prompt" className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Description de la vidéo
            </Label>
            <Textarea
              id="prompt"
              name="prompt"
              placeholder="Décrivez en détail la vidéo que vous souhaitez générer... Soyez créatif et précis pour de meilleurs résultats !"
              className="min-h-[140px] resize-none text-base leading-relaxed border-2 focus:border-primary/50 transition-colors duration-300"
              maxLength={4000}
              required
            />
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span>4000 caractères maximum.</span>
              <Badge variant="outline" className="text-xs">
                Soyez précis pour de meilleurs résultats
              </Badge>
            </p>
          </div>

          {/* Bouton de génération */}
          <div className="pt-4">
            <SubmitButton estimatedCost={estimatedCost} />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
