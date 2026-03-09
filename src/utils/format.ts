export function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function inches(value: number): string {
  return `${value.toFixed(1)} in`;
}

export function titleCase(value: string): string {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
