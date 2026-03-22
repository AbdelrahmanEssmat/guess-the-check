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

export function formatShareText(
  session: { restaurantName?: string },
  summaries: { person: { name: string }; total: number }[],
  grandTotal: number
): string {
  const header = session.restaurantName
    ? `🧾 Guess The Check — ${session.restaurantName}`
    : '🧾 Guess The Check';

  const personLines = summaries
    .map((s) => `👤 ${s.person.name}: ${formatEGP(s.total)}`)
    .join('\n');

  const separator = '━━━━━━━━━━━━━━━';
  const totalLine = `💰 Total: ${formatEGP(grandTotal)}`;

  return `${header}\n\n${personLines}\n${separator}\n${totalLine}`;
}
