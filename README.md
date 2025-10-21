# 🎬 Sora Video Generator

Une application Next.js moderne pour générer des vidéos avec l'API Sora 2 d'OpenAI.

## ✨ Fonctionnalités

- **Génération de vidéos** avec l'API Sora 2 d'OpenAI
- **Interface moderne** avec design sombre et glassmorphism
- **Application desktop uniquement** avec avertissement mobile
- **Layout 3 colonnes** : Paramètres, Image de référence, Idées
- **Calcul de coût en temps réel** basé sur les tarifs officiels OpenAI
- **Gestion des vidéos** avec liste locale et statuts en temps réel
- **Upload d'images** avec validation et prévisualisation
- **Indicateurs d'orientation** (paysage/portrait) pour les dimensions
- **Accès direct à la facturation** OpenAI
- **Polling automatique** pour le suivi des générations

## 🚀 Technologies

- **Next.js 15** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS v4** pour le styling
- **Shadcn/ui** pour les composants
- **Prisma** avec SQLite pour la base de données
- **OpenAI SDK** pour l'intégration API
- **Zod** pour la validation
- **React Hook Form** pour la gestion des formulaires
- **Sonner** pour les notifications

## 📦 Installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd sora-web-client
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env.local
   ```
   
   Remplir `.env.local` :
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   DATABASE_URL="file:./dev.db"
   ```

4. **Initialiser la base de données**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

## 🎯 Utilisation

1. **Ouvrir l'application** sur `http://localhost:3000`
2. **Configurer les paramètres** :
   - Modèle (Sora 2 ou Sora 2 Pro)
   - Dimensions avec indicateur d'orientation
   - Durée (4, 8 ou 12 secondes)
3. **Ajouter une image de référence** (optionnel)
4. **Rédiger votre prompt** dans la section "Idées"
5. **Vérifier le coût estimé** et cliquer sur "Générer la vidéo"
6. **Suivre la progression** et consulter vos vidéos dans "Mes vidéos"

## 💰 Tarification

Les coûts sont calculés selon la formule officielle OpenAI :
- **Tarif par seconde × durée**
- Sora 2 : $0.10/seconde (1280x720, 720x1280)
- Sora 2 Pro : $0.30/seconde (1280x720, 720x1280), $0.50/seconde (1024x1792, 1792x1024)

## 🏗️ Architecture

```
src/
├── app/                    # Pages Next.js
├── components/            # Composants React
│   ├── ui/               # Composants Shadcn/ui
│   ├── video-generator-form.tsx
│   └── video-list-sheet.tsx
├── actions/              # Server Actions
├── lib/                  # Utilitaires et configuration
├── types/                # Types TypeScript
└── prisma/               # Schéma de base de données
```

## 🔧 Scripts disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run start` - Serveur de production
- `npm run lint` - Linting ESLint
- `npm run db:push` - Synchroniser la base de données

## 📱 Responsive

L'application est optimisée pour les écrans desktop (minimum 1024px) avec un avertissement pour les utilisateurs mobiles.

## 🎨 Design

- **Thème sombre** avec gradients purple/pink
- **Glassmorphism** avec effets de flou et transparence
- **Animations fluides** et micro-interactions
- **Typographie moderne** avec Geist Sans/Mono
- **Icônes Lucide** pour une cohérence visuelle

## 🔒 Sécurité

- Validation côté client et serveur avec Zod
- Gestion sécurisée des clés API
- Protection CSRF avec Next.js
- Validation des types TypeScript

## 📈 Performance

- **Build optimisé** avec Next.js 15
- **Images optimisées** avec next/image
- **Code splitting** automatique
- **Cache intelligent** des requêtes API

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- [OpenAI](https://openai.com/) pour l'API Sora 2
- [Next.js](https://nextjs.org/) pour le framework
- [Shadcn/ui](https://ui.shadcn.com/) pour les composants
- [Tailwind CSS](https://tailwindcss.com/) pour le styling

---

**Prêt pour la production !** 🚀