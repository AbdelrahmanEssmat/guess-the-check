import { PersonSummary } from '../types';

const CANVAS_WIDTH = 800;
const PADDING = 48;
const CONTENT_WIDTH = CANVAS_WIDTH - PADDING * 2;

function formatEGP(amount: number): string {
  return `${amount.toFixed(2)} EGP`;
}

function getInitials(name: string): string {
  if (!name || !name.trim()) return '?';
  return name
    .trim()
    .split(' ')
    .filter((part) => part.length > 0)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export async function generateReceiptImage(
  summary: PersonSummary,
  restaurantName?: string
): Promise<Blob | null> {
  const { person, subtotal, taxAmount, serviceAmount, tipAmount, total, items } = summary;

  // Load Nunito font
  try {
    await document.fonts.load('700 24px Nunito');
    await document.fonts.load('600 20px Nunito');
    await document.fonts.load('500 20px Nunito');
  } catch {
    // Font may already be loaded
  }

  // Calculate height dynamically
  const HEADER_HEIGHT = 100; // avatar + name + restaurant
  const ITEM_ROW_HEIGHT = 44;
  const CHARGE_ROW_HEIGHT = 38;
  const SEPARATOR_HEIGHT = 32;
  const TOTAL_HEIGHT = 56;
  const FOOTER_HEIGHT = 56;

  const chargeCount = [subtotal, taxAmount, serviceAmount, tipAmount].filter((v) => v > 0).length
    || 4; // show all 4 even if 0

  const canvasHeight =
    PADDING + // top padding
    HEADER_HEIGHT +
    items.length * ITEM_ROW_HEIGHT +
    SEPARATOR_HEIGHT +
    4 * CHARGE_ROW_HEIGHT + // always show 4 charge rows
    SEPARATOR_HEIGHT +
    TOTAL_HEIGHT +
    FOOTER_HEIGHT +
    PADDING; // bottom padding

  const canvas = document.createElement('canvas');
  const scale = 2;
  canvas.width = CANVAS_WIDTH * scale;
  canvas.height = canvasHeight * scale;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(scale, scale);

  // Background
  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, 0, 0, CANVAS_WIDTH, canvasHeight, 24);
  ctx.fill();

  let y = PADDING;

  // === HEADER: Avatar + Name ===
  // Avatar circle
  const avatarSize = 52;
  ctx.fillStyle = person.color;
  ctx.beginPath();
  ctx.arc(PADDING + avatarSize / 2, y + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
  ctx.fill();

  // Initials
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 20px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(getInitials(person.name), PADDING + avatarSize / 2, y + avatarSize / 2 + 1);

  // Name
  ctx.fillStyle = '#2D3436';
  ctx.font = '700 26px Nunito, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(person.name, PADDING + avatarSize + 16, y + avatarSize / 2);

  y += avatarSize + 8;

  // Restaurant name (subtitle)
  if (restaurantName) {
    ctx.fillStyle = '#636E72';
    ctx.font = '500 18px Nunito, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(restaurantName, PADDING, y + 16);
    y += 32;
  } else {
    y += 16;
  }

  // === ITEMS ===
  items.forEach((item) => {
    y += 6;
    ctx.fillStyle = '#636E72';
    ctx.font = '500 20px Nunito, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(truncateText(ctx, item.name, CONTENT_WIDTH - 160), PADDING, y + 22);

    ctx.fillStyle = '#2D3436';
    ctx.font = '600 20px Nunito, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(formatEGP(item.amount), CANVAS_WIDTH - PADDING, y + 22);
    y += ITEM_ROW_HEIGHT - 6;
  });

  // === SEPARATOR ===
  y += 8;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PADDING, y);
  ctx.lineTo(CANVAS_WIDTH - PADDING, y);
  ctx.stroke();
  y += SEPARATOR_HEIGHT - 8;

  // === CHARGES ===
  const charges = [
    { label: 'Subtotal', value: subtotal },
    { label: 'Tax', value: taxAmount },
    { label: 'Service', value: serviceAmount },
    { label: 'Tip', value: tipAmount },
  ];

  charges.forEach((charge) => {
    ctx.fillStyle = '#B2BEC3';
    ctx.font = '500 19px Nunito, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(charge.label, PADDING, y + 22);

    ctx.fillStyle = '#2D3436';
    ctx.font = '600 19px Nunito, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(formatEGP(charge.value), CANVAS_WIDTH - PADDING, y + 22);
    y += CHARGE_ROW_HEIGHT;
  });

  // === SEPARATOR ===
  y += 4;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PADDING, y);
  ctx.lineTo(CANVAS_WIDTH - PADDING, y);
  ctx.stroke();
  y += SEPARATOR_HEIGHT - 4;

  // === TOTAL ===
  ctx.fillStyle = '#2D3436';
  ctx.font = '700 24px Nunito, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Total', PADDING, y + 24);

  ctx.fillStyle = '#00B894';
  ctx.font = '700 28px Nunito, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(formatEGP(total), CANVAS_WIDTH - PADDING, y + 24);
  y += TOTAL_HEIGHT;

  // === FOOTER ===
  ctx.fillStyle = '#B2BEC3';
  ctx.font = '500 14px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Guess The Check', CANVAS_WIDTH / 2, y + 12);

  // Convert to blob
  return new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/png')
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function truncateText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 0 && ctx.measureText(truncated + '…').width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + '…';
}
