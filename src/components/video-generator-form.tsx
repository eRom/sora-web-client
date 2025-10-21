"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Play, Loader2, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { generateVideo } from "@/actions/video-actions";
import { calculateVideoCost, formatCost, validateImageDimensions, validateImageFile } from "@/lib/video-helpers";
import { VideoDimension, VideoDuration, VideoFormUI, VideoFormUISchema, VideoModel } from "@/types/video";
import { VIDEO_MODELS, MODEL_DIMENSIONS, VIDEO_DURATIONS } from "@/lib/constants";

export function VideoGeneratorForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VideoFormUI>({
    resolver: zodResolver(VideoFormUISchema),
    defaultValues: {
      model: "sora-2",
      size: "1280x720",
      duration: "4", // Durée par défaut : 4 secondes
      prompt: "",
    },
  });

  const selectedModel = watch("model") as VideoModel;
  const selectedSize = watch("size") as VideoDimension;

  const handleModelChange = (value: VideoModel) => {
    setValue("model", value);
    // Réinitialiser la taille si elle n'est pas compatible avec le nouveau modèle
    const availableSizes = MODEL_DIMENSIONS[value];
    if (!availableSizes.includes(selectedSize)) {
      setValue("size", availableSizes[0]);
    }
  };

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageError(null);

    // Validation du fichier
    const fileValidation = validateImageFile(file);
    if (!fileValidation.valid) {
      setImageError(fileValidation.error);
      return;
    }

    // Validation des dimensions
    const dimensionValidation = await validateImageDimensions(file);
    if (!dimensionValidation.valid) {
      setImageError(dimensionValidation.error);
      return;
    }

    // Créer l'aperçu
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedImage = () => {
    setImagePreview(null);
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: VideoFormUI) => {
    setIsGenerating(true);
    setProgress(0);

    try {
      // Simulation de progression
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      const result = await generateVideo({
        ...data,
        duration: parseInt(data.duration) as VideoDuration,
        referenceImage: imagePreview ? fileInputRef.current?.files?.[0] : undefined,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (result.success) {
        toast.success("Vidéo générée avec succès !");
        // Réinitialiser le formulaire
        setValue("prompt", "");
        setImagePreview(null);
        setImageError(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        toast.error(result.error || "Erreur lors de la génération");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur inattendue s'est produite");
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <div className="relative">
      {/* Effet de fond moderne */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-3xl blur-3xl"></div>
      
      <Card className="relative w-full max-w-7xl mx-auto bg-slate-900/80 backdrop-blur-xl border-slate-800/50 shadow-2xl">
        <CardContent className="p-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            {/* Layout en 3 colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_1fr] gap-8">
              
              {/* Colonne 1: Paramètres */}
              <div className="space-y-6 lg:border-r lg:border-slate-700/50 lg:pr-8">
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">Paramètres</h3>
                  <p className="text-slate-400">Configurez votre génération</p>
                </div>
                
                {/* Modèle */}
                <div className="space-y-2">
                  <Label htmlFor="model" className="text-slate-200 font-medium text-sm">Modèle</Label>
                  <Select
                    value={selectedModel}
                    onValueChange={handleModelChange}
                    disabled={isGenerating}
                  >
                    <SelectTrigger className="w-full bg-slate-800/50 border-slate-700 hover:border-purple-500/50 focus:border-purple-500 text-white h-10">
                      <SelectValue placeholder="Sélectionnez un modèle" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 w-[280px]">
                      {Object.entries(VIDEO_MODELS).map(([key, model]) => (
                        <SelectItem key={key} value={key} className="text-white hover:bg-slate-700">
                          <div className="text-left">
                            <div className="font-medium text-left">{model.label}</div>
                            <div className="text-sm text-slate-400 text-left">{model.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Dimensions */}
                <div className="space-y-2">
                  <Label htmlFor="size" className="text-slate-200 font-medium text-sm">Dimensions</Label>
                  <Select
                    value={selectedSize}
                    onValueChange={(value: VideoDimension) => setValue("size", value)}
                    disabled={isGenerating}
                  >
                    <SelectTrigger className="w-full bg-slate-800/50 border-slate-700 hover:border-purple-500/50 focus:border-purple-500 text-white h-10">
                      <SelectValue placeholder="Sélectionnez les dimensions" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 w-[280px]">
                      {MODEL_DIMENSIONS[selectedModel].map((size) => {
                        const [width, height] = size.split('x').map(Number);
                        const orientation = width > height ? 'paysage' : 'portrait';
                        return (
                          <SelectItem key={size} value={size} className="text-white hover:bg-slate-700">
                            <div className="flex items-center justify-between w-full">
                              <span>{size}</span>
                              <span className="text-slate-400 text-xs ml-2">- {orientation}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Durée */}
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-slate-200 font-medium text-sm">Durée</Label>
                  <Select
                    value={watch("duration")}
                    onValueChange={(value) => setValue("duration", value)}
                    disabled={isGenerating}
                  >
                    <SelectTrigger className="w-full bg-slate-800/50 border-slate-700 hover:border-purple-500/50 focus:border-purple-500 text-white h-10">
                      <SelectValue placeholder="Sélectionnez la durée" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 w-[280px]">
                      {VIDEO_DURATIONS.map((duration) => (
                        <SelectItem key={duration} value={duration.toString()} className="text-white hover:bg-slate-700">
                          {duration} secondes
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Colonne 2: Image de référence */}
              <div className="space-y-8 lg:border-r lg:border-slate-700/50 lg:px-8">
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">Image de référence</h3>
                  <p className="text-slate-400">Guidez la génération (optionnel)</p>
                </div>
                
                <div className="space-y-6">
                  <div className="relative">
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageSelect}
                      disabled={isGenerating}
                      className="h-10 cursor-pointer bg-slate-800/50 border-slate-700 hover:border-purple-500/50 focus:border-purple-500 text-white file:bg-purple-600 file:border-0 file:rounded-lg file:px-4 file:py-2 file:text-white file:cursor-pointer file:h-8 file:flex file:items-center"
                    />
                  </div>
                  
                  {imagePreview ? (
                    <div className="relative group">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={400}
                        height={192}
                        className="w-full h-48 object-cover rounded-2xl border border-slate-700 shadow-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700"
                        onClick={removeSelectedImage}
                        disabled={isGenerating}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-slate-800/30 border-2 border-dashed border-slate-600 rounded-2xl flex flex-col items-center justify-center text-slate-400">
                      <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mb-3">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-medium">Aucune image sélectionnée</p>
                      <p className="text-xs mt-1">Cliquez sur &quot;Choisir un fichier&quot; ci-dessus</p>
                    </div>
                  )}
                  
                  {imageError && (
                    <p className="text-sm text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-800/50">
                      {imageError}
                    </p>
                  )}
                  
                  <p className="text-sm text-slate-400 bg-slate-800/30 p-3 rounded-lg">
                    Formats : JPG, PNG, WebP (max 5MB)
                  </p>
                </div>
              </div>

              {/* Colonne 3: Idées */}
              <div className="space-y-8 lg:pl-8">
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">Idées</h3>
                  <p className="text-slate-400">Décrivez votre vision</p>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="prompt" className="text-slate-200 font-medium">Description de la vidéo</Label>
                  <Textarea
                    {...register("prompt")}
                    placeholder="Décrivez la vidéo que vous souhaitez générer..."
                    className="min-h-[275px] resize-none bg-slate-800/50 border-slate-700 hover:border-purple-500/50 focus:border-purple-500 text-white placeholder:text-slate-400"
                    disabled={isGenerating}
                  />
                  {errors.prompt && (
                    <p className="text-sm text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-800/50">
                      {errors.prompt.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Progression */}
            {isGenerating && (
              <div className="space-y-4 bg-slate-800/30 p-6 rounded-2xl border border-slate-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-200">Génération en cours...</span>
                  <span className="text-purple-400 font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full h-2 bg-slate-700" />
              </div>
            )}

            {/* Séparateur */}
            <Separator className="my-6 bg-slate-700" />

            {/* Bouton de soumission et coût */}
            <div className="flex items-center justify-between pt-4">
              {/* Coût estimé */}
              <div className="text-left">
                <p className="text-slate-400 text-sm">
                  Coût total : <span className="text-white font-medium">
                    {formatCost(calculateVideoCost(selectedModel, selectedSize, parseInt(watch("duration")) as VideoDuration))}
                  </span>
                  <span className="text-slate-500 text-xs ml-2">
                    (Tarif par seconde × durée)
                  </span>
                </p>
              </div>

              {/* Bouton de soumission */}
              <Button
                type="submit"
                size="lg"
                className="px-16 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Play className="mr-3 h-6 w-6" />
                    Générer la vidéo
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
