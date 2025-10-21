#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { puppeteerConfig, viewportConfigs, screenshotConfig, waitConfig } = require('./puppeteer-config');

async function generateScreenshots() {
  console.log('📸 Génération des captures d\'écran pour le manifest...');

  const browser = await puppeteer.launch(puppeteerConfig);

  try {
    const page = await browser.newPage();

    // Configuration des viewports
    const viewports = [
      {
        name: 'mobile',
        config: viewportConfigs.mobile,
        filename: 'screenshot-mobile.png'
      },
      {
        name: 'desktop',
        config: viewportConfigs.desktop,
        filename: 'screenshot-desktop.png'
      }
    ];

    for (const viewport of viewports) {
      console.log(`📱 Génération capture ${viewport.name} (${viewport.config.width}x${viewport.config.height})...`);
      
      // Configuration du viewport
      await page.setViewport(viewport.config);

      // Configuration de l'user agent pour mobile
      if (viewport.config.isMobile) {
        await page.setUserAgent(viewport.config.userAgent);
      }

      // Naviguer vers la page d'accueil
      await page.goto('http://localhost:3000', {
        waitUntil: waitConfig.waitUntil,
        timeout: waitConfig.timeout
      });

      // Attendre que les animations se terminent
      await new Promise(resolve => setTimeout(resolve, waitConfig.animationDelay));

      // Attendre que les images se chargent
      await new Promise(resolve => setTimeout(resolve, waitConfig.imageLoadDelay));

      // Prendre la capture d'écran
      const screenshotPath = path.join(__dirname, '..', 'public', viewport.filename);
      await page.screenshot({
        path: screenshotPath,
        ...screenshotConfig
      });

      // Vérifier que le fichier a été créé
      if (fs.existsSync(screenshotPath)) {
        const stats = fs.statSync(screenshotPath);
        const sizeKB = Math.round(stats.size / 1024);
        console.log(`✅ Capture ${viewport.name} sauvegardée: ${viewport.filename} (${sizeKB}KB)`);
      } else {
        console.error(`❌ Erreur: Fichier ${viewport.filename} non créé`);
      }
    }

    console.log('🎉 Génération des captures terminée !');

  } catch (error) {
    console.error('❌ Erreur lors de la génération des captures:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Vérifier si le serveur est en cours d'exécution
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000');
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  console.log('🔍 Vérification du serveur de développement...');
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log('⚠️  Serveur non détecté sur http://localhost:3000');
    console.log('💡 Démarrez le serveur avec: npm run dev');
    console.log('🔄 Relancez ce script après avoir démarré le serveur');
    process.exit(1);
  }

  await generateScreenshots();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { generateScreenshots };
