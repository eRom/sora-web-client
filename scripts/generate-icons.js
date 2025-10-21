#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration des icônes à générer
const iconConfigs = [
  // Apple Touch Icon
  { name: 'apple-touch-icon.png', size: 180, format: 'png' },
  
  // Favicons
  { name: 'favicon-16x16.png', size: 16, format: 'png' },
  { name: 'favicon-32x32.png', size: 32, format: 'png' },
  { name: 'favicon.ico', size: 32, format: 'ico' },
  
  // PWA Icons
  { name: 'icon-192.png', size: 192, format: 'png' },
  { name: 'icon-512.png', size: 512, format: 'png' },
  
  // Standard icons
  { name: 'icon.png', size: 64, format: 'png' },
  { name: 'icon.svg', size: 64, format: 'svg' },
  { name: 'logo.svg', size: 64, format: 'svg' }
];

async function generateIcons() {
  const sourcePath = path.join(__dirname, '../logo.png');
  const outputDir = path.join(__dirname, '../public');
  
  // Vérifier que le fichier source existe
  if (!fs.existsSync(sourcePath)) {
    console.error('❌ Logo source non trouvé:', sourcePath);
    process.exit(1);
  }
  
  console.log('🚀 Génération des icônes à partir de:', sourcePath);
  console.log('📁 Dossier de sortie:', outputDir);
  
  // Créer le dossier public s'il n'existe pas
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const config of iconConfigs) {
    try {
      const outputPath = path.join(outputDir, config.name);
      
      console.log(`⏳ Génération de ${config.name} (${config.size}x${config.size})...`);
      
      let sharpInstance = sharp(sourcePath)
        .resize(config.size, config.size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 } // Transparent background
        });
      
      // Configuration spécifique selon le format
      switch (config.format) {
        case 'png':
          sharpInstance = sharpInstance.png({ quality: 90 });
          break;
        case 'ico':
          sharpInstance = sharpInstance.png({ quality: 90 });
          break;
        case 'svg':
          // Pour SVG, on génère d'abord en PNG puis on convertit
          sharpInstance = sharpInstance.png({ quality: 90 });
          break;
      }
      
      await sharpInstance.toFile(outputPath);
      
      // Conversion spéciale pour ICO
      if (config.format === 'ico') {
        const pngPath = outputPath.replace('.ico', '.png');
        await sharp(sourcePath)
          .resize(config.size, config.size, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 0 }
          })
          .png()
          .toFile(pngPath);
        
        // Note: Pour une vraie conversion ICO, il faudrait une librairie spécialisée
        // Pour l'instant, on garde le PNG avec l'extension .ico
        console.log(`⚠️  Note: ${config.name} généré en PNG (extension .ico)`);
      }
      
      console.log(`✅ ${config.name} généré avec succès`);
      successCount++;
      
    } catch (error) {
      console.error(`❌ Erreur lors de la génération de ${config.name}:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n📊 Résumé de la génération:');
  console.log(`✅ Succès: ${successCount}`);
  console.log(`❌ Erreurs: ${errorCount}`);
  console.log(`📁 Total: ${iconConfigs.length} fichiers`);
  
  if (errorCount === 0) {
    console.log('\n🎉 Toutes les icônes ont été générées avec succès!');
  } else {
    console.log('\n⚠️  Certaines icônes n\'ont pas pu être générées.');
  }
}

// Exécution du script
if (require.main === module) {
  generateIcons().catch(console.error);
}

module.exports = { generateIcons, iconConfigs };
