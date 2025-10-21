'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { VideoGenerator } from '@/components/video-generator'
import { VideoList } from '@/components/video-list'
import { CreditCard, Film, PenTool, Play, Settings, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header moderne avec glass effect */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
                  <Film className="w-7 h-7 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse-slow"></div>
              </div>
              <div className="animate-fade-in">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Le cinéma de vos idées
                </h1>
                <p className="text-sm text-muted-foreground">
                  Créez des vidéos avec l&apos;IA Sora 2 de OpenAI
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 animate-slide-in">
              <Button
                variant="outline"
                onClick={() => window.open('https://platform.openai.com/settings/organization/billing/overview', '_blank')}
                className="gap-3 px-6 py-3 h-auto bg-gradient-to-r from-background to-background/80 hover:from-primary/10 hover:to-primary/5 border-primary/20 hover:border-primary/40 transition-all duration-300"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Crédits</div>
                  <div className="text-xs text-muted-foreground">
                    OpenAI facturation
                  </div>
                </div>
              </Button>
              <VideoList />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content avec design moderne */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-16">
          

          {/* Main Grid avec design amélioré */}
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Formulaire de génération */}
            <div className="lg:col-span-2 animate-fade-in">
              <VideoGenerator />
            </div>

            {/* Sidebar avec informations et instructions */}
            <div className="space-y-8 animate-slide-in">
              {/* Instructions modernes */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                      <Play className="w-4 h-4 text-primary-foreground" />
                    </div>
                    Comment ça marche ?
                  </CardTitle>
                  <CardDescription className="text-base">
                    Créez votre première vidéo en 3 étapes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4 group">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl flex-shrink-0 mt-1 group-hover:scale-110 transition-transform">
                      <span className="text-sm font-bold">1</span>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2 text-base">
                        <PenTool className="w-4 h-4 text-primary" />
                        Décrivez votre vidéo
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Écrivez une description détaillée et créative de ce que vous voulez créer
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl flex-shrink-0 mt-1 group-hover:scale-110 transition-transform">
                      <span className="text-sm font-bold">2</span>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2 text-base">
                        <Settings className="w-4 h-4 text-primary" />
                        Choisissez les paramètres
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Modèle, dimensions, durée et optionnellement une image de référence
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl flex-shrink-0 mt-1 group-hover:scale-110 transition-transform">
                      <span className="text-sm font-bold">3</span>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2 text-base">
                        <Play className="w-4 h-4 text-primary" />
                        Générez et téléchargez
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Lancez la génération et recevez votre vidéo en quelques minutes
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips et conseils */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-accent/50 to-accent/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Conseils pour de meilleurs résultats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-muted-foreground">
                        Soyez précis dans vos descriptions
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-muted-foreground">
                        Mentionnez le style visuel souhaité
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-muted-foreground">
                        Utilisez des images de référence pour plus de contrôle
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer moderne */}
      <footer className="border-t border-border/50 bg-muted/30 mt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Film className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Le cinéma de vos idées</span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>
                Créé avec ♥️ en Next.js & OpenAI Sora 2 API
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
