# Project summary

Web app pour générer des vidéos avec l'API Sora 2 de OpenAI.
- Basé sur Shadcn UI
- Prisma DB

## UI

### Paramètres de génération
- Liste des modeles : Sora 2 (sora-2), Sora 2 Pro (sora-2-pro). Par défaut "sora-2"
- Lister des dimensions : 
  - sora-2
    - 1280x720, 720x1280
    - Défaut : 1280x720
  - sora-2-pro
    - 1280x720, 720x1280
    - 1024x1792, 1792x1024
- Listes des durées (en secondes) : 4, 8 et 12. Par défaut "8"
- Un système pour charger une image local (image de reference)
  - Une preview de l'image chargée
  - Image format : jpg, png, webp
- Un textarea pouvant prendre le prompt
- Button "Générer" :   
  - Vérifier que tous les paramètres sont valides et définis
  - Au cas image de reference est défini, alors vérifé ces dimensions
    - Taille de sortie == Taille de l'image : OK
- Notification local : Toast avec le composant Sonner

### Listes des vidéos
- Liste des vidéos générées (composant "Sheet" ?)
- Nom, model, size, date 
- Pouvoir supprimer (après confirmation) la vidéo sélectionnée 
- Pouvoir renommer

## OpenAI
- Docs
  - https://cookbook.openai.com/examples/sora/sora2_prompting_guide
  - https://platform.openai.com/docs/guides/video-generation
  - https://platform.openai.com/docs/api-reference/videos/create?lang=javascript
  - https://platform.openai.com/docs/api-reference/videos/object
- API
  - Create video
  - List videos
  - Retrieve video
  - Delete video
  - Retrieve video content
  - Video job
- Streaming events
  - When you create a Response with stream set to true, the server will emit server-sent events to the client as the Response is generated
  - Docs : https://platform.openai.com/docs/guides/streaming-responses?api-mode=responses
- Error managment

## Specs
- DB local (SQLite) using Prisma (install)
  - Enregistrement des videos (id, name, model, size, durée, prompt, openai_video_id) 
- .env with OpenAI API Key
- 
