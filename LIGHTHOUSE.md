# 🚀 Scripts Lighthouse Automatisés

Ce projet inclut maintenant des scripts automatisés pour tester les performances avec Lighthouse.

## 📦 Installation

Les dépendances sont déjà installées :
- `lighthouse` - Bibliothèque principale
- `chrome-launcher` - Lanceur Chrome headless

## 🎯 Utilisation

### Tests Rapides

```bash
# Test complet (desktop + mobile)
npm run lighthouse:both

# Test desktop uniquement
npm run lighthouse:desktop

# Test mobile uniquement
npm run lighthouse:mobile
```

### Tests Personnalisés

```bash
# Test sur une URL spécifique
node scripts/lighthouse-test.js https://votre-site.com

# Test sur une URL avec un device spécifique
node scripts/lighthouse-test.js https://votre-site.com desktop
node scripts/lighthouse-test.js https://votre-site.com mobile
```

## 📊 Résultats

### Affichage Console
Le script affiche en temps réel :
- 🎯 **Scores par catégorie** (Performance, SEO, Accessibility, Best Practices)
- 🚀 **Core Web Vitals** (LCP, FID, CLS)
- ⚡ **Métriques de Performance** (FCP, Speed Index, TBT, TTI)
- 💡 **Recommandations** principales avec économies estimées

### Rapports Sauvegardés
Les rapports complets sont sauvegardés dans :
```
lighthouse-reports/
├── lighthouse-desktop-2024-10-20T04-30-00-000Z.json
└── lighthouse-mobile-2024-10-20T04-30-00-000Z.json
```

## 🎨 Configuration

### Throttling Desktop
- RTT: 40ms
- Throughput: 10 Mbps
- CPU: 1x slowdown
- Écran: 1350x940

### Throttling Mobile
- RTT: 150ms
- Throughput: 1.6 Mbps
- CPU: 4x slowdown
- Écran: 375x667 (iPhone SE)

## 🔧 Personnalisation

Modifiez `scripts/lighthouse-test.js` pour :
- Ajuster les configurations de throttling
- Ajouter/supprimer des audits
- Modifier les seuils de scores
- Changer le format de sortie

## 🚀 Intégration CI/CD

Ajoutez dans votre pipeline :

```yaml
# GitHub Actions exemple
- name: Run Lighthouse Tests
  run: |
    npm run build
    npm run start &
    sleep 10
    npm run lighthouse:both
```

## 📈 Exemple de Sortie

```
🎯 Test Lighthouse pour: http://localhost:3000
📱 Device: both

🚀 Démarrage du test Lighthouse Desktop...

📊 Résultats Lighthouse Desktop:
==================================================
🟢 Performance: 95/100
🟢 Accessibility: 100/100
🟢 Best Practices: 92/100
🟢 SEO: 98/100

🎯 Core Web Vitals:
📈 LCP: 292ms (🟢)
⚡ FID: 12ms (🟢)
📐 CLS: 0.00 (🟢)

⚡ Métriques de Performance:
🎨 FCP: 1.2s
🏃 Speed Index: 1.8s
⏱️ TBT: 45ms
🖱️ TTI: 2.1s

💡 Recommandations principales:
🔧 Serve static assets with an efficient cache policy: 2.3s d'économie possible
🔧 Eliminate render-blocking resources: 850ms d'économie possible
```

## 🎉 Avantages

✅ **Automatisation complète** - Plus besoin d'ouvrir Chrome DevTools  
✅ **Tests reproductibles** - Même configuration à chaque fois  
✅ **Rapports détaillés** - JSON complet pour analyse  
✅ **CI/CD ready** - Intégration facile dans les pipelines  
✅ **Comparaisons** - Historique des performances  
✅ **Recommandations** - Suggestions d'amélioration automatiques
