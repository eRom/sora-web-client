const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
  const publicDir = path.join(__dirname, '..', 'public');
  const images = [
    'hero-placeholder.png',
    'og.png',
    // ❌ NE PAS convertir les icônes (compatibilité requise) :
    // 'favicon.png',
    // 'icon.png', 
    // 'apple-touch-icon.png',
    // 'icon-192.png',
    // 'icon-512.png'
  ];

  console.log('🚀 Starting image optimization...');

  for (const imageName of images) {
    const inputPath = path.join(publicDir, imageName);
    
    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  Skipping ${imageName} - file not found`);
      continue;
    }

    const baseName = path.parse(imageName).name;
    const ext = path.parse(imageName).ext;

    try {
      // Get original file size
      const originalStats = fs.statSync(inputPath);
      const originalSizeKB = Math.round(originalStats.size / 1024);

      console.log(`\n📸 Processing ${imageName} (${originalSizeKB}KB)...`);

      // Optimize WebP
      const webpPath = path.join(publicDir, `${baseName}.webp`);
      await sharp(inputPath)
        .webp({ 
          quality: 85,
          effort: 6 
        })
        .toFile(webpPath);

      const webpStats = fs.statSync(webpPath);
      const webpSizeKB = Math.round(webpStats.size / 1024);
      const webpSavings = Math.round(((originalSizeKB - webpSizeKB) / originalSizeKB) * 100);

      console.log(`✅ WebP: ${webpSizeKB}KB (${webpSavings}% smaller)`);

      // Optimize AVIF (if supported)
      try {
        const avifPath = path.join(publicDir, `${baseName}.avif`);
        await sharp(inputPath)
          .avif({ 
            quality: 80,
            effort: 6 
          })
          .toFile(avifPath);

        const avifStats = fs.statSync(avifPath);
        const avifSizeKB = Math.round(avifStats.size / 1024);
        const avifSavings = Math.round(((originalSizeKB - avifSizeKB) / originalSizeKB) * 100);

        console.log(`✅ AVIF: ${avifSizeKB}KB (${avifSavings}% smaller)`);
      } catch (avifError) {
        console.log(`⚠️  AVIF not supported for ${imageName}`);
      }

      // Generate responsive sizes for hero image
      if (imageName === 'hero-placeholder.png') {
        console.log('📱 Generating responsive sizes for hero image...');
        
        const sizes = [
          { width: 640, suffix: '-sm' },
          { width: 768, suffix: '-md' },
          { width: 1024, suffix: '-lg' },
          { width: 1280, suffix: '-xl' },
          { width: 1920, suffix: '-2xl' }
        ];

        for (const size of sizes) {
          // WebP responsive
          const responsiveWebpPath = path.join(publicDir, `${baseName}${size.suffix}.webp`);
          await sharp(inputPath)
            .resize(size.width, null, { 
              withoutEnlargement: true,
              fit: 'inside'
            })
            .webp({ quality: 85 })
            .toFile(responsiveWebpPath);

          const responsiveStats = fs.statSync(responsiveWebpPath);
          const responsiveSizeKB = Math.round(responsiveStats.size / 1024);
          
          console.log(`  📱 ${size.width}px WebP: ${responsiveSizeKB}KB`);
        }
      }

    } catch (error) {
      console.error(`❌ Error processing ${imageName}:`, error.message);
    }
  }

  console.log('\n🎉 Image optimization complete!');
}

optimizeImages().catch(console.error);
