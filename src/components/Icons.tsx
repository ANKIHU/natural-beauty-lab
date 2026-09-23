export function LeafIcon({ color = "currentColor", size = 16 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 20 C4 10 10 4 20 4 C20 14 14 20 4 20 Z" stroke={color} strokeWidth="1.8" />
      <path d="M4 20 C9 15 13 11 20 4" stroke={color} strokeWidth="1.4" />
    </svg>
  );
}

export function BrandMark() {
  return (
    <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="22" stroke="var(--honey)" strokeWidth="2" />
      <path d="M14 33 C14 21 21 14 33 14 C33 26 26 33 14 33 Z" fill="var(--moss)" />
      <path d="M14 33 C20 27 26 21 33 14" stroke="var(--paper)" strokeWidth="1.6" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M16.5 16.5 L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M6 8 h12 l-1.2 11 a2 2 0 0 1 -2 1.8 H9.2 a2 2 0 0 1 -2 -1.8 Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 8 a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function CloseIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path d="M4 12.5 L10 18 L20 6" stroke="var(--moss)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
