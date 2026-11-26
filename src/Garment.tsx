import { useId } from 'react';
import type { Product } from './data';

const LONG =
  'M72 40 L50 46 L22 74 L10 190 L32 194 L50 104 L50 222 L150 222 L150 104 L168 194 L190 190 L178 74 L150 46 L128 40 Q100 58 72 40 Z';
const BODY: Record<Product['shape'], string> = {
  tee: 'M72 40 L52 46 L18 70 L32 98 L52 86 L52 222 L148 222 L148 86 L168 98 L182 70 L148 46 L128 40 Q100 58 72 40 Z',
  crew: LONG,
  hoodie: LONG,
  shirt: LONG,
  jacket: LONG,
  kaftan:
    'M74 40 L50 46 L20 80 L16 150 L38 152 L50 104 L44 236 L156 236 L150 104 L162 152 L184 150 L180 80 L150 46 L126 40 Q100 56 74 40 Z',
  tote: 'M40 96 H160 L172 228 H28 Z',
};

type Props = { product: Product; back?: boolean; className?: string; title?: string };

/** Garments are drawn, not photographed: one SVG per product, front or back. */
export function Garment({ product, back = false, className, title }: Props) {
  const uid = useId().replace(/:/g, '');
  const { shape, pattern, color, accent, print } = product;
  const fill = pattern === 'plain' ? color : `url(#pat-${uid})`;
  const trim = 'rgba(0,0,0,.16)';
  const isTote = shape === 'tote';

  return (
    <svg viewBox="0 0 200 240" className={className} role="img" aria-label={title ?? product.name}>
      <defs>
        {pattern === 'wax' && (
          <pattern id={`pat-${uid}`} width="34" height="34" patternUnits="userSpaceOnUse">
            <rect width="34" height="34" fill={color} />
            <circle cx="17" cy="17" r="11" fill={accent} />
            <circle cx="17" cy="17" r="6.5" fill="#f4c542" />
            <circle cx="17" cy="17" r="2.8" fill={accent} />
            <path d="M0 0 L7 0 L0 7 Z M34 0 L27 0 L34 7 Z M0 34 L7 34 L0 27 Z M34 34 L27 34 L34 27 Z" fill="#f4efe6" />
          </pattern>
        )}
        {pattern === 'adire' && (
          <pattern id={`pat-${uid}`} width="26" height="26" patternUnits="userSpaceOnUse">
            <rect width="26" height="26" fill={color} />
            <circle cx="13" cy="13" r="7" fill="none" stroke={accent} strokeWidth="2" strokeDasharray="2 3" />
            <circle cx="13" cy="13" r="1.8" fill={accent} />
            <circle cx="0" cy="0" r="2" fill={accent} />
            <circle cx="26" cy="0" r="2" fill={accent} />
            <circle cx="0" cy="26" r="2" fill={accent} />
            <circle cx="26" cy="26" r="2" fill={accent} />
          </pattern>
        )}
        {pattern === 'stripe' && (
          <pattern id={`pat-${uid}`} width="20" height="16" patternUnits="userSpaceOnUse">
            <rect width="20" height="16" fill={color} />
            <rect width="20" height="6" fill={accent} />
          </pattern>
        )}
        <linearGradient id={`sh-${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity=".2" />
          <stop offset=".22" stopColor="#fff" stopOpacity=".1" />
          <stop offset=".6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".22" />
        </linearGradient>
      </defs>

      {isTote ? (
        <path d="M70 100 C70 28 130 28 130 100" fill="none" stroke={pattern === 'plain' ? color : accent} strokeWidth="9" />
      ) : (
        <>
          <path d="M100 30 V21 c0-6 9-6 9-13 a9 9 0 1 0 -17 -3" fill="none" stroke="#8d8d8d" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M56 46 L100 29 L144 46" fill="none" stroke="#b98a55" strokeWidth="5" strokeLinecap="round" />
        </>
      )}

      {shape === 'hoodie' && <path d="M66 46 Q100 0 134 46 Q100 70 66 46 Z" fill={color} stroke={trim} strokeWidth="1.5" />}

      <path d={BODY[shape]} fill={fill} />
      <path d={BODY[shape]} fill={`url(#sh-${uid})`} />
      <path d={BODY[shape]} fill="none" stroke={trim} strokeWidth="1.5" strokeLinejoin="round" />

      {isTote && <path d="M40 96 H160 L162 116 H38 Z" fill="rgba(0,0,0,.18)" />}

      {!back && shape === 'hoodie' && (
        <>
          <path d="M70 168 H130 L138 204 H62 Z" fill="rgba(0,0,0,.1)" stroke={trim} strokeWidth="1.5" />
          <path d="M90 58 V92 M110 58 V92" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}

      {!back && (shape === 'shirt' || shape === 'jacket') && (
        <>
          <path d="M72 40 L100 62 L88 76 Z M128 40 L100 62 L112 76 Z" fill={pattern === 'plain' ? color : accent} stroke={trim} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M100 62 V222" stroke={trim} strokeWidth="2" />
          {[92, 124, 156, 188].map((y) => (
            <circle key={y} cx="100" cy={y} r="3" fill={accent} stroke={trim} strokeWidth="1" />
          ))}
          {shape === 'shirt' && <path d="M116 96 H138 V120 L127 126 L116 120 Z" fill="rgba(0,0,0,.08)" stroke={trim} strokeWidth="1.5" />}
          {shape === 'jacket' && (
            <path d="M58 158 H88 V196 H58 Z M112 158 H142 V196 H112 Z" fill="rgba(0,0,0,.1)" stroke={trim} strokeWidth="1.5" />
          )}
        </>
      )}

      {!back && shape === 'kaftan' && (
        <>
          <path d="M100 50 V112" stroke={accent} strokeWidth="3" strokeLinecap="round" />
          <path d="M86 46 Q100 62 114 46" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" />
          <path d="M92 70 H108 M92 84 H108 M92 98 H108" stroke={accent} strokeWidth="2" strokeLinecap="round" />
        </>
      )}

      {(shape === 'crew' || shape === 'tee') && !back && (
        <path d="M72 40 Q100 62 128 40" fill="none" stroke={trim} strokeWidth="4" strokeLinecap="round" />
      )}

      {!back && print && (
        <text x="100" y="112" textAnchor="middle" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="800" fontSize="22" letterSpacing="1" fill={accent}>
          {print}
        </text>
      )}
    </svg>
  );
}
