import { useId } from 'react';
import type { Product } from './data';

const LONG =
  'M74 38 C82 48 118 48 126 38 L150 46 C164 52 174 64 178 80 L192 188 C186 192 176 194 170 194 L152 108 L150 218 C150 222 148 224 144 224 L56 224 C52 224 50 222 50 218 L48 108 L30 194 C24 194 14 192 8 188 L22 80 C26 64 36 52 50 46 Z';
const BODY: Record<Product['shape'], string> = {
  tee: 'M74 38 C82 48 118 48 126 38 L150 46 C162 50 176 62 186 78 L168 102 C162 96 156 92 150 90 L150 218 C150 222 148 224 144 224 L56 224 C52 224 50 222 50 218 L50 90 C44 92 38 96 32 102 L14 78 C24 62 38 50 50 46 Z',
  crew: LONG,
  hoodie: LONG,
  shirt: LONG,
  jacket: LONG,
  kaftan:
    'M76 38 C84 46 116 46 124 38 L150 46 C166 54 178 70 182 88 L186 150 C180 154 170 155 164 154 L152 108 L158 232 C158 236 156 238 152 238 L48 238 C44 238 42 236 42 232 L48 108 L36 154 C30 155 20 154 14 150 L18 88 C22 70 34 54 50 46 Z',
  tote: 'M40 96 L160 96 C163 140 168 186 172 226 C172 229 170 230 168 230 L32 230 C30 230 28 229 28 226 C32 186 37 140 40 96 Z',
};

const seedOf = (id: string) => [...id].reduce((n, c) => (n * 31 + c.charCodeAt(0)) % 997, 7);

type Props = {
  product: Product;
  back?: boolean;
  className?: string;
  title?: string;
  /** cloth texture and wrinkles; off for the small side-on pieces on the rail */
  rich?: boolean;
};

/** Garments are drawn, not photographed: one SVG per product, front or back. */
export function Garment({ product, back = false, className, title, rich = true }: Props) {
  const uid = useId().replace(/:/g, '');
  const { shape, pattern, color, accent, print } = product;
  const fill = pattern === 'plain' ? color : `url(#pat-${uid})`;
  const seam = 'rgba(0,0,0,.22)';
  const isTote = shape === 'tote';
  const longSleeve = shape === 'crew' || shape === 'hoodie' || shape === 'shirt' || shape === 'jacket';
  const ribbed = shape === 'crew' || shape === 'hoodie';
  const seed = seedOf(product.id);

  return (
    <svg viewBox="0 0 200 240" className={className} role="img" aria-label={title ?? product.name}>
      <defs>
        {pattern === 'wax' && (
          <pattern id={`pat-${uid}`} width="30" height="30" patternUnits="userSpaceOnUse">
            <rect width="30" height="30" fill={color} />
            <circle cx="15" cy="15" r="10" fill={accent} />
            <circle cx="15" cy="15" r="6" fill="#f4c542" />
            <circle cx="15" cy="15" r="2.6" fill={accent} />
            <path d="M0 0 L6 0 L0 6 Z M30 0 L24 0 L30 6 Z M0 30 L6 30 L0 24 Z M30 30 L24 30 L30 24 Z" fill="#f4efe6" />
          </pattern>
        )}
        {pattern === 'adire' && (
          <pattern id={`pat-${uid}`} width="24" height="24" patternUnits="userSpaceOnUse">
            <rect width="24" height="24" fill={color} />
            <circle cx="12" cy="12" r="6.5" fill="none" stroke={accent} strokeWidth="1.8" strokeDasharray="2 3" />
            <circle cx="12" cy="12" r="1.6" fill={accent} />
            <circle cx="0" cy="0" r="1.8" fill={accent} />
            <circle cx="24" cy="0" r="1.8" fill={accent} />
            <circle cx="0" cy="24" r="1.8" fill={accent} />
            <circle cx="24" cy="24" r="1.8" fill={accent} />
          </pattern>
        )}
        {pattern === 'stripe' && (
          <pattern id={`pat-${uid}`} width="20" height="15" patternUnits="userSpaceOnUse">
            <rect width="20" height="15" fill={color} />
            <rect width="20" height="5.5" fill={accent} />
          </pattern>
        )}
        <clipPath id={`clip-${uid}`}>
          <path d={BODY[shape]} />
        </clipPath>
        <linearGradient id={`sh-${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity=".3" />
          <stop offset=".2" stopColor="#000" stopOpacity=".04" />
          <stop offset=".38" stopColor="#fff" stopOpacity=".14" />
          <stop offset=".62" stopColor="#000" stopOpacity="0" />
          <stop offset=".84" stopColor="#000" stopOpacity=".08" />
          <stop offset="1" stopColor="#000" stopOpacity=".34" />
        </linearGradient>
        <linearGradient id={`dn-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".1" />
          <stop offset=".5" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".16" />
        </linearGradient>
        <linearGradient id={`wood-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d4a66f" />
          <stop offset="1" stopColor="#a87643" />
        </linearGradient>
        {rich && (
          <>
            <filter id={`wr-${uid}`} x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.016 0.03" numOctaves="3" seed={seed} result="n" />
              <feDiffuseLighting in="n" surfaceScale="7" diffuseConstant="1.15" lightingColor="#ffffff">
                <feDistantLight azimuth="235" elevation="60" />
              </feDiffuseLighting>
            </filter>
            <filter id={`wv-${uid}`} x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed={seed + 3} />
              <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 -.12" />
            </filter>
            <filter id={`bl-${uid}`}>
              <feGaussianBlur stdDeviation="2.2" />
            </filter>
          </>
        )}
      </defs>

      {isTote ? (
        <>
          <path d="M66 100 C66 22 134 22 134 100" fill="none" stroke={pattern === 'plain' ? color : accent} strokeWidth="9" />
          <path d="M66 100 C66 22 134 22 134 100" fill="none" stroke="rgba(0,0,0,.38)" strokeWidth="9" />
          <path d="M72 100 C72 34 128 34 128 100" fill="none" stroke={pattern === 'plain' ? color : accent} strokeWidth="9" />
          <path d="M72 100 C72 34 128 34 128 100" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="2" strokeDasharray="3 3" />
        </>
      ) : (
        <>
          <path d="M100 32 V22 c0-6 9-6 9-13 a9 9 0 1 0 -17 -3" fill="none" stroke="#9a9a9a" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M100 29 C97 29 82 36 76 40 C74 42 75 45 78 45 L122 45 C125 45 126 42 124 40 C118 36 103 29 100 29 Z" fill={`url(#wood-${uid})`} />
        </>
      )}

      {shape === 'hoodie' && back && <path d="M68 42 C70 8 130 8 132 42 C134 78 66 78 68 42 Z" fill={color} />}
      {shape === 'hoodie' && !back && (
        <>
          <path d="M66 46 C66 10 134 10 134 46 C122 62 78 62 66 46 Z" fill={color} />
          <path d="M77 46 C80 24 120 24 123 46 C112 56 88 56 77 46 Z" fill="rgba(0,0,0,.45)" />
        </>
      )}

      <g clipPath={`url(#clip-${uid})`} style={{ isolation: 'isolate' }}>
        <rect width="200" height="240" fill={fill} />
        {/* construction details sit under the cloth shading */}
        {longSleeve && <path d="M50 46 C48 70 48 90 48 108 M150 46 C152 70 152 90 152 108" fill="none" stroke={seam} strokeWidth="1.2" />}
        {shape === 'tee' && <path d="M50 46 C49 62 50 76 50 90 M150 46 C151 62 150 76 150 90" fill="none" stroke={seam} strokeWidth="1.2" />}
        {ribbed && (
          <>
            <rect x="48" y="210" width="104" height="16" fill="rgba(0,0,0,.12)" />
            <path d="M8 180 L32 186 L30 196 L6 190 Z M192 180 L168 186 L170 196 L194 190 Z" fill="rgba(0,0,0,.14)" />
            {Array.from({ length: 17 }, (_, i) => (
              <path key={i} d={`M${52 + i * 6} 210 V226`} stroke="rgba(0,0,0,.12)" strokeWidth="1" />
            ))}
          </>
        )}
        {(shape === 'tee' || shape === 'shirt' || shape === 'kaftan') && (
          <path d={shape === 'kaftan' ? 'M42 230 H158' : 'M50 218 H150'} stroke={seam} strokeWidth="1" strokeDasharray="2 2" />
        )}
        {isTote && (
          <>
            <path d="M38 96 H162 L164 116 H36 Z" fill="rgba(0,0,0,.2)" />
            <path d="M37 116 H163" stroke="rgba(255,255,255,.35)" strokeWidth="1" strokeDasharray="3 3" />
          </>
        )}

        {!back && shape === 'hoodie' && (
          <>
            <path d="M70 166 H130 L140 206 H60 Z" fill="rgba(0,0,0,.1)" stroke={seam} strokeWidth="1.2" />
            <path d="M91 56 V96 M109 56 V96" stroke={accent} strokeWidth="2.4" strokeLinecap="round" />
            <path d="M91 96 v5 M109 96 v5" stroke="#8d8d8d" strokeWidth="3" strokeLinecap="round" />
          </>
        )}

        {!back && (shape === 'shirt' || shape === 'jacket') && (
          <>
            <path d="M96 60 H104 V224 H96 Z" fill="rgba(0,0,0,.06)" />
            <path d="M96 60 V224 M104 60 V224" stroke={seam} strokeWidth="1" />
            {[84, 112, 140, 168, 196].map((y) => (
              <g key={y}>
                <circle cx="100" cy={y} r="2.8" fill={accent} stroke="rgba(0,0,0,.35)" strokeWidth=".8" />
                <path d={`M99 ${y} h2`} stroke="rgba(0,0,0,.45)" strokeWidth=".8" />
              </g>
            ))}
            {shape === 'shirt' && <path d="M116 96 H138 V118 L127 125 L116 118 Z" fill="rgba(0,0,0,.07)" stroke={seam} strokeWidth="1.2" />}
            {shape === 'jacket' && (
              <path d="M58 156 H90 V198 H58 Z M110 156 H142 V198 H110 Z M112 92 H138 V118 H112 Z" fill="rgba(0,0,0,.09)" stroke={seam} strokeWidth="1.2" />
            )}
          </>
        )}

        {!back && shape === 'kaftan' && (
          <>
            <path d="M94 44 H106 V118 L100 126 L94 118 Z" fill="rgba(0,0,0,.07)" stroke={accent} strokeWidth="1.6" />
            <path d="M97 62 H103 M97 76 H103 M97 90 H103 M97 104 H103" stroke={accent} strokeWidth="2" strokeLinecap="round" />
            <path d="M84 42 C90 54 110 54 116 42" fill="none" stroke={accent} strokeWidth="2.4" strokeLinecap="round" />
          </>
        )}

        {!back && print && (
          <text x="100" y="112" textAnchor="middle" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="800" fontSize="22" letterSpacing="1" fill={accent}>
            {print}
          </text>
        )}

        {/* cloth: soft folds, wrinkles and weave */}
        {rich && !isTote && (
          <g filter={`url(#bl-${uid})`} fill="none" strokeLinecap="round">
            <path d="M56 112 C64 140 60 176 56 214 M144 112 C136 140 140 176 144 214" stroke="rgba(0,0,0,.2)" strokeWidth="5" />
            <path d="M78 70 C84 110 80 170 86 222 M122 70 C116 110 120 170 114 222" stroke="rgba(0,0,0,.09)" strokeWidth="6" />
            <path d="M100 70 C98 120 102 170 100 222" stroke="rgba(255,255,255,.16)" strokeWidth="9" />
            {longSleeve && <path d="M30 96 C24 130 20 160 18 186 M170 96 C176 130 180 160 182 186" stroke="rgba(255,255,255,.14)" strokeWidth="5" />}
          </g>
        )}
        {rich && (
          <>
            <rect width="200" height="240" filter={`url(#wr-${uid})`} style={{ mixBlendMode: 'multiply' }} opacity={isTote ? 0.45 : 0.7} />
            <rect width="200" height="240" filter={`url(#wv-${uid})`} opacity=".32" />
          </>
        )}
        <rect width="200" height="240" fill={`url(#sh-${uid})`} />
        <rect width="200" height="240" fill={`url(#dn-${uid})`} />
      </g>

      {/* collars and necklines sit on top of the cloth */}
      {!back && (shape === 'shirt' || shape === 'jacket') && (
        <path
          d="M74 38 L100 60 L86 76 C80 64 76 52 74 38 Z M126 38 L100 60 L114 76 C120 64 124 52 126 38 Z"
          fill={pattern === 'plain' ? color : accent}
          stroke="rgba(0,0,0,.3)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      )}
      {(shape === 'tee' || shape === 'crew') && (
        <>
          {!back && <path d="M74 38 C82 48 118 48 126 38 C118 56 82 56 74 38 Z" fill="rgba(0,0,0,.4)" />}
          <path
            d={back ? 'M74 38 C86 44 114 44 126 38' : 'M74 38 C80 58 120 58 126 38'}
            fill="none"
            stroke={pattern === 'plain' ? color : accent}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d={back ? 'M74 38 C86 44 114 44 126 38' : 'M74 38 C80 58 120 58 126 38'}
            fill="none"
            stroke="rgba(0,0,0,.18)"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </>
      )}

      <path d={BODY[shape]} fill="none" stroke="rgba(0,0,0,.28)" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}
