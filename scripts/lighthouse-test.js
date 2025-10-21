#!/usr/bin/env node

const lighthouse = require('lighthouse').default;
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

// Configuration des tests
const configs = {
  desktop: {
    name: 'Desktop',
    settings: {
      formFactor: 'desktop',
      throttling: {
        rttMs: 40,
        throughputKbps: 10240,
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0
      },
      screenEmulation: {
        mobile: false,
        width: 1350,
        height: 940,
        deviceScaleFactor: 1,
        disabled: false
      }
    }
  },
  mobile: {
    name: 'Mobile',
    settings: {
      formFactor: 'mobile',
      throttling: {
        rttMs: 150,
        throughputKbps: 1638.4,
        cpuSlowdownMultiplier: 4,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0
      },
      screenEmulation: {
        mobile: true,
        width: 375,
        height: 667,
        deviceScaleFactor: 2,
        disabled: false
      }
    }
  }
};

// Configuration Lighthouse
const lighthouseConfig = {
  extends: 'lighthouse:default',
  settings: {
    onlyAudits: [
      'first-contentful-paint',
      'largest-contentful-paint',
      'first-meaningful-paint',
      'speed-index',
      'cumulative-layout-shift',
      'total-blocking-time',
      'interactive',
      'performance-budget',
      'render-blocking-resources',
      'unused-css-rules',
      'unused-javascript',
      'modern-image-formats',
      'uses-optimized-images',
      'uses-text-compression',
      'uses-responsive-images',
      'efficient-animated-content',
      'preload-lcp-image',
      'uses-rel-preconnect',
      'uses-rel-preload',
      'font-display',
      'unminified-css',
      'unminified-javascript',
      'uses-webp-images',
      'uses-avif-images',
      'legacy-javascript',
      'dom-size',
      'no-document-write',
      'uses-http2',
      'uses-long-cache-ttl',
      'total-byte-weight',
      'offscreen-images',
      'render-blocking-resources',
      'unused-css-rules',
      'unused-javascript',
      'uses-webp-images',
      'uses-avif-images',
      'modern-image-formats',
      'uses-optimized-images',
      'uses-responsive-images',
      'efficient-animated-content',
      'preload-lcp-image',
      'uses-rel-preconnect',
      'uses-rel-preload',
      'font-display',
      'unminified-css',
      'unminified-javascript',
      'legacy-javascript',
      'dom-size',
      'no-document-write',
      'uses-http2',
      'uses-long-cache-ttl',
      'total-byte-weight',
      'offscreen-images'
    ]
  }
};

async function runLighthouseTest(url, config, configName) {
  console.log(`\n🚀 Démarrage du test Lighthouse ${configName}...`);
  
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
  });

  try {
    const options = {
      logLevel: 'info',
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      port: chrome.port,
      ...config
    };

    const runnerResult = await lighthouse(url, options, lighthouseConfig);
    
    // Sauvegarder le rapport complet
    const reportDir = path.join(__dirname, '../lighthouse-reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(reportDir, `lighthouse-${configName.toLowerCase()}-${timestamp}.json`);
    fs.writeFileSync(reportPath, runnerResult.report);
    
    // Afficher les résultats
    const lhr = runnerResult.lhr;
    console.log(`\n📊 Résultats Lighthouse ${configName}:`);
    console.log('=' .repeat(50));
    
    // Scores par catégorie
    Object.entries(lhr.categories).forEach(([category, data]) => {
      const score = Math.round(data.score * 100);
      const emoji = score >= 90 ? '🟢' : score >= 50 ? '🟡' : '🔴';
      console.log(`${emoji} ${data.title}: ${score}/100`);
    });
    
    // Métriques Core Web Vitals
    console.log('\n🎯 Core Web Vitals:');
    const audits = lhr.audits;
    
    if (audits['largest-contentful-paint']) {
      const lcp = audits['largest-contentful-paint'];
      console.log(`📈 LCP: ${lcp.displayValue} (${lcp.score >= 0.9 ? '🟢' : lcp.score >= 0.5 ? '🟡' : '🔴'})`);
    }
    
    if (audits['first-input-delay']) {
      const fid = audits['first-input-delay'];
      console.log(`⚡ FID: ${fid.displayValue} (${fid.score >= 0.9 ? '🟢' : fid.score >= 0.5 ? '🟡' : '🔴'})`);
    }
    
    if (audits['cumulative-layout-shift']) {
      const cls = audits['cumulative-layout-shift'];
      console.log(`📐 CLS: ${cls.displayValue} (${cls.score >= 0.9 ? '🟢' : cls.score >= 0.5 ? '🟡' : '🔴'})`);
    }
    
    // Métriques de performance
    console.log('\n⚡ Métriques de Performance:');
    if (audits['first-contentful-paint']) {
      console.log(`🎨 FCP: ${audits['first-contentful-paint'].displayValue}`);
    }
    if (audits['speed-index']) {
      console.log(`🏃 Speed Index: ${audits['speed-index'].displayValue}`);
    }
    if (audits['total-blocking-time']) {
      console.log(`⏱️ TBT: ${audits['total-blocking-time'].displayValue}`);
    }
    if (audits['interactive']) {
      console.log(`🖱️ TTI: ${audits['interactive'].displayValue}`);
    }
    
    // Recommandations d'amélioration
    console.log('\n💡 Recommandations principales:');
    const opportunities = Object.entries(audits)
      .filter(([key, audit]) => audit.details && audit.details.type === 'opportunity' && audit.numericValue > 0)
      .sort((a, b) => b[1].numericValue - a[1].numericValue)
      .slice(0, 5);
    
    opportunities.forEach(([key, audit]) => {
      const savings = audit.displayValue || `${Math.round(audit.numericValue)}ms`;
      console.log(`🔧 ${audit.title}: ${savings} d'économie possible`);
    });
    
    console.log(`\n📄 Rapport complet sauvegardé: ${reportPath}`);
    
    return {
      configName,
      scores: Object.fromEntries(
        Object.entries(lhr.categories).map(([key, data]) => [key, Math.round(data.score * 100)])
      ),
      metrics: {
        lcp: audits['largest-contentful-paint']?.numericValue,
        fcp: audits['first-contentful-paint']?.numericValue,
        cls: audits['cumulative-layout-shift']?.numericValue,
        tbt: audits['total-blocking-time']?.numericValue,
        tti: audits['interactive']?.numericValue
      }
    };
    
  } finally {
    await chrome.kill();
  }
}

async function main() {
  const url = process.argv[2] || 'http://localhost:3000';
  const device = process.argv[3] || 'both'; // desktop, mobile, ou both
  
  console.log(`🎯 Test Lighthouse pour: ${url}`);
  console.log(`📱 Device: ${device}`);
  
  const results = [];
  
  if (device === 'desktop' || device === 'both') {
    const desktopResult = await runLighthouseTest(url, configs.desktop.settings, configs.desktop.name);
    results.push(desktopResult);
  }
  
  if (device === 'mobile' || device === 'both') {
    const mobileResult = await runLighthouseTest(url, configs.mobile.settings, configs.mobile.name);
    results.push(mobileResult);
  }
  
  // Résumé final
  console.log('\n🏆 RÉSUMÉ FINAL');
  console.log('=' .repeat(50));
  
  results.forEach(result => {
    console.log(`\n📊 ${result.configName}:`);
    Object.entries(result.scores).forEach(([category, score]) => {
      const emoji = score >= 90 ? '🟢' : score >= 50 ? '🟡' : '🔴';
      console.log(`  ${emoji} ${category}: ${score}/100`);
    });
  });
  
  console.log('\n✨ Test terminé !');
}

// Gestion des erreurs
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Erreur non gérée:', reason);
  process.exit(1);
});

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { runLighthouseTest, configs };
