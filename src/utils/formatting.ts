export function formatEGP(amount: number): string {
  return `${amount.toFixed(2)} EGP`;
}

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export const AVATAR_COLORS = [
  '#00B894',
  '#4ECDC4',
  '#A29BFE',
  '#74B9FF',
  '#FDCB6E',
  '#E17055',
  '#FD79A8',
  '#6C5CE7',
];

export function getAvatarColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

export function getInitials(name: string): string {
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

export function formatPersonShareText(
  summary: { person: { name: string }; subtotal: number; taxAmount: number; serviceAmount: number; tipAmount: number; total: number; items: { name: string; amount: number }[] },
  restaurantName?: string
): string {
  const header = restaurantName
    ? `🧾 ${restaurantName} — ${summary.person.name}'s share`
    : `🧾 ${summary.person.name}'s share`;

  const itemLines = summary.items
    .map((item) => `  • ${item.name}: ${formatEGP(item.amount)}`)
    .join('\n');

  const charges = [
    `Subtotal: ${formatEGP(summary.subtotal)}`,
    summary.taxAmount > 0 ? `Tax: ${formatEGP(summary.taxAmount)}` : '',
    summary.serviceAmount > 0 ? `Service: ${formatEGP(summary.serviceAmount)}` : '',
    summary.tipAmount > 0 ? `Tip: ${formatEGP(summary.tipAmount)}` : '',
  ].filter(Boolean).join('\n');

  const separator = '━━━━━━━━━━━━━━━';
  const totalLine = `💰 Total: ${formatEGP(summary.total)}`;

  return `${header}\n\n${itemLines}\n\n${charges}\n${separator}\n${totalLine}`;
}
