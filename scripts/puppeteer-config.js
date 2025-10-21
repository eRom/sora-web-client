const puppeteer = require('puppeteer');

// Configuration Puppeteer pour les captures d'écran
const puppeteerConfig = {
  // Configuration de base
  headless: 'new',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--disable-gpu'
  ],
  
  // Configuration pour les captures d'écran
  defaultViewport: {
    width: 1280,
    height: 720,
    deviceScaleFactor: 1
  },
  
  // Timeouts
  timeout: 30000,
  
  // Configuration réseau
  ignoreHTTPSErrors: true,
  
  // Configuration des ressources
  ignoreDefaultArgs: ['--disable-extensions']
};

// Configuration des viewports pour les captures
const viewportConfigs = {
  mobile: {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  },
  desktop: {
    width: 1280,
    height: 720,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
};

// Configuration des captures d'écran
const screenshotConfig = {
  // Format PNG (pas de qualité pour PNG)
  type: 'png',
  
  // Capture complète
  fullPage: true,
  
  // Masquer les éléments non nécessaires
  omitBackground: false,
  
  // Capture optimisée
  captureBeyondViewport: true
};

// Configuration des attentes
const waitConfig = {
  // Attendre le chargement complet
  waitUntil: 'networkidle0',
  
  // Timeout pour le chargement
  timeout: 30000,
  
  // Attendre les animations
  animationDelay: 2000,
  
  // Attendre les images
  imageLoadDelay: 1000
};

module.exports = {
  puppeteerConfig,
  viewportConfigs,
  screenshotConfig,
  waitConfig
};
