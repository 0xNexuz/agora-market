/** Hand-drawn product shot: a tote in a wax-print style pattern. */
export function Tote() {
  return (
    <svg viewBox="0 0 320 320" role="img" aria-label="Ankara tote bag in orange, teal and indigo print" className="tote">
      <defs>
        <pattern id="wax" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#E8742A" />
          <circle cx="20" cy="20" r="13" fill="#1F3A5F" />
          <circle cx="20" cy="20" r="8" fill="#F4C542" />
          <circle cx="20" cy="20" r="3.5" fill="#1F3A5F" />
          <path d="M0 0 L8 0 L0 8 Z M40 0 L32 0 L40 8 Z M0 40 L8 40 L0 32 Z M40 40 L32 40 L40 32 Z" fill="#127A6E" />
        </pattern>
      </defs>
      <path d="M112 92 C112 40 208 40 208 92" fill="none" stroke="#5B3A21" strokeWidth="12" strokeLinecap="round" />
      <path d="M128 92 C128 58 192 58 192 92" fill="none" stroke="#3E2715" strokeWidth="6" strokeLinecap="round" />
      <path d="M70 92 H250 L268 290 H52 Z" fill="url(#wax)" stroke="#2B1B0E" strokeWidth="4" strokeLinejoin="round" />
      <path d="M70 92 H250 L252 112 H68 Z" fill="#5B3A21" />
    </svg>
  );
}
