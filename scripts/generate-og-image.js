const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// Configuration
const WIDTH = 1280;
const HEIGHT = 800;
const OUTPUT_PATH = path.join(__dirname, '../public/og.png');

// Couleurs du thème Noël
const COLORS = {
  background: '#0f172a', // Bleu foncé
  primary: '#dc2626', // Rouge Noël
  secondary: '#16a34a', // Vert sapin
  accent: '#fbbf24', // Or
  text: '#ffffff',
  textSecondary: '#e2e8f0',
  snow: '#f8fafc'
};

// Fonction pour créer un dégradé
function createGradient(ctx, x1, y1, x2, y2, colorStops) {
  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  colorStops.forEach(stop => {
    gradient.addColorStop(stop.position, stop.color);
  });
  return gradient;
}

// Fonction pour dessiner des flocons de neige
function drawSnowflake(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = COLORS.snow;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.8;
  
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, size);
    ctx.stroke();
    ctx.rotate(Math.PI / 3);
  }
  
  ctx.restore();
}

// Fonction pour dessiner des étoiles
function drawStar(ctx, x, y, size, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.9;
  
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5;
    const radius = i % 2 === 0 ? size : size * 0.4;
    const px = Math.cos(angle) * radius;
    const py = Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  
  ctx.restore();
}

// Fonction pour dessiner des sapins
function drawTree(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  
  // Tronc
  ctx.fillStyle = '#8b4513';
  ctx.fillRect(-size * 0.1, size * 0.3, size * 0.2, size * 0.4);
  
  // Feuillage
  ctx.fillStyle = COLORS.secondary;
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.5);
  ctx.lineTo(-size * 0.4, size * 0.2);
  ctx.lineTo(size * 0.4, size * 0.2);
  ctx.closePath();
  ctx.fill();
  
  // Étoile au sommet
  drawStar(ctx, 0, -size * 0.5, size * 0.1, COLORS.accent);
  
  ctx.restore();
}

// Fonction pour dessiner un rectangle arrondi
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

async function generateOGImage() {
  // Créer le canvas
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  
  // Fond avec dégradé
  const backgroundGradient = createGradient(ctx, 0, 0, 0, HEIGHT, [
    { position: 0, color: COLORS.background },
    { position: 0.7, color: '#1e293b' },
    { position: 1, color: '#0f172a' }
  ]);
  
  ctx.fillStyle = backgroundGradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  
  // Ajouter des flocons de neige
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * WIDTH;
    const y = Math.random() * HEIGHT;
    const size = Math.random() * 8 + 4;
    drawSnowflake(ctx, x, y, size);
  }
  
  // Ajouter des étoiles scintillantes
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * WIDTH;
    const y = Math.random() * HEIGHT * 0.6;
    const size = Math.random() * 6 + 3;
    drawStar(ctx, x, y, size, COLORS.accent);
  }
  
  // Ajouter des sapins en arrière-plan
  const treePositions = [
    { x: 100, y: HEIGHT - 150, size: 80 },
    { x: 200, y: HEIGHT - 120, size: 60 },
    { x: WIDTH - 150, y: HEIGHT - 140, size: 70 },
    { x: WIDTH - 250, y: HEIGHT - 110, size: 50 }
  ];
  
  treePositions.forEach(tree => {
    drawTree(ctx, tree.x, tree.y, tree.size);
  });
  
  // Zone de contenu principal
  const contentX = WIDTH * 0.1;
  const contentY = HEIGHT * 0.2;
  const contentWidth = WIDTH * 0.8;
  const contentHeight = HEIGHT * 0.6;
  
  // Fond semi-transparent pour le contenu
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  drawRoundedRect(ctx, contentX, contentY, contentWidth, contentHeight, 20);
  ctx.fill();
  
  // Bordure dorée
  ctx.strokeStyle = COLORS.accent;
  ctx.lineWidth = 3;
  drawRoundedRect(ctx, contentX, contentY, contentWidth, contentHeight, 20);
  ctx.stroke();
  
  // Titre principal
  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 64px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  
  const titleText = 'Marché de Noël';
  const titleY = contentY + 40;
  ctx.fillText(titleText, contentX + contentWidth / 2, titleY);
  
  // Sous-titre
  ctx.fillStyle = COLORS.accent;
  ctx.font = 'bold 48px Arial, sans-serif';
  const subtitleText = 'du MPR de Nantes';
  const subtitleY = titleY + 80;
  ctx.fillText(subtitleText, contentX + contentWidth / 2, subtitleY);
  
  // Dates
  ctx.fillStyle = COLORS.textSecondary;
  ctx.font = '36px Arial, sans-serif';
  const dateText = '15 au 24 décembre 2024';
  const dateY = subtitleY + 80;
  ctx.fillText(dateText, contentX + contentWidth / 2, dateY);
  
  // Description
  ctx.fillStyle = COLORS.textSecondary;
  ctx.font = '24px Arial, sans-serif';
  const descriptionText = 'Artisans locaux • Produits authentiques • Ambiance festive';
  const descriptionY = dateY + 60;
  ctx.fillText(descriptionText, contentX + contentWidth / 2, descriptionY);
  
  // Icônes décoratives
  const iconY = descriptionY + 80;
  const iconSpacing = 80;
  const startX = contentX + contentWidth / 2 - (iconSpacing * 2);
  
  // Icône sapin
  drawTree(ctx, startX, iconY, 30);
  
  // Icône cadeau (carré avec ruban)
  ctx.save();
  ctx.translate(startX + iconSpacing, iconY);
  ctx.fillStyle = COLORS.primary;
  ctx.fillRect(-15, -10, 30, 20);
  ctx.fillStyle = COLORS.accent;
  ctx.fillRect(-15, -2, 30, 4);
  ctx.fillRect(-2, -10, 4, 20);
  ctx.restore();
  
  // Icône étoile
  drawStar(ctx, startX + iconSpacing * 2, iconY, 20, COLORS.accent);
  
  // Icône cœur
  ctx.save();
  ctx.translate(startX + iconSpacing * 3, iconY);
  ctx.fillStyle = COLORS.primary;
  ctx.beginPath();
  ctx.arc(-8, 0, 8, Math.PI, 0, false);
  ctx.arc(8, 0, 8, Math.PI, 0, false);
  ctx.lineTo(0, 20);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  
  // Icône sapin
  drawTree(ctx, startX + iconSpacing * 4, iconY, 30);
  
  // Sauvegarder l'image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(OUTPUT_PATH, buffer);
  
  console.log(`✅ Image OpenGraph générée avec succès : ${OUTPUT_PATH}`);
  console.log(`📐 Dimensions : ${WIDTH} × ${HEIGHT} pixels`);
}

// Exécuter la génération
generateOGImage().catch(console.error);
