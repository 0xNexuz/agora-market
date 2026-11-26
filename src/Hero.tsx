/**
 * Hero artwork, drawn for Agora: paper collage with a red sun, a bunch of
 * paper shopping bags, a grid of rounded tiles with cursor tags, and a dotted
 * overlay with scattered words that ask the question this shop is testing.
 */
const tile = (x: number, y: number, filled = false) => (
  <rect
    key={`${x}-${y}`}
    x={x}
    y={y}
    width="78"
    height="78"
    rx="18"
    fill={filled ? '#ffffff' : 'url(#hatch)'}
    stroke={filled ? '#1b1b1b' : '#c9c1b2'}
    strokeWidth={filled ? 2 : 1.5}
    strokeDasharray={filled ? undefined : '5 5'}
  />
);

function Bag({ x, y, r, w, h, fill, band }: { x: number; y: number; r: number; w: number; h: number; fill: string; band?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <path d={`M${w * 0.3} 0 C${w * 0.3} -34 ${w * 0.7} -34 ${w * 0.7} 0`} fill="none" stroke="#1b1b1b" strokeWidth="3" />
      <path d={`M0 0 H${w} L${w * 0.92} ${h} H${w * 0.08} Z`} fill={fill} stroke="#1b1b1b" strokeWidth="1.5" strokeLinejoin="round" />
      {band && <path d={`M0 0 H${w} L${w * 0.985} ${h * 0.2} H${w * 0.015} Z`} fill={band} />}
      <path d={`M${w * 0.5} ${h * 0.2} V${h} M${w * 0.08} ${h} L${w * 0.3} ${h * 0.72} L${w * 0.5} ${h}`} fill="none" stroke="rgba(0,0,0,.22)" strokeWidth="1.5" />
    </g>
  );
}

export function HeroArt() {
  return (
    <svg viewBox="0 0 720 520" className="hero-art" role="img" aria-label="Collage: a red sun, paper shopping bags, a grid of tiles with Seller and Shopper tags, and the words Could one tap sell more?">
      <defs>
        <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="#f4efe6" />
          <rect width="1.5" height="8" fill="#e3dccd" />
        </pattern>
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .1 0" />
        </filter>
      </defs>

      <rect width="720" height="520" fill="#f4efe6" />

      {/* tile grid */}
      {[0, 1, 2, 3].map((i) => tile(60 + i * 92, 60))}
      {[0, 1, 2, 3, 4].map((i) => tile(14 + i * 92, 152, i === 1 || i === 2))}
      {[0, 1, 2, 3].map((i) => tile(60 + i * 92, 244, i === 0 || i === 1))}
      {[0, 1, 2, 3, 4].map((i) => tile(14 + i * 92, 336))}

      {/* glyphs inside the filled tiles */}
      <path d="M128 176 l-14 6 -8 12 8 6 6 -5 v24 h28 v-24 l6 5 8 -6 -8 -12 -14 -6 q-6 6 -12 0z" fill="#e4572e" />
      <path d="M222 190 h34 l4 30 h-42 z M230 190 c0 -20 18 -20 18 0" fill="#1b1b1b" stroke="#1b1b1b" strokeWidth="3" fillRule="evenodd" />
      <path d="M82 268 h34 v34 h-34 z M82 268 l17 12 17 -12" fill="#c79a63" stroke="#1b1b1b" strokeWidth="2" />
      <text x="191" y="296" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="38" fill="#1b1b1b">A</text>

      {/* sun */}
      <circle cx="540" cy="150" r="82" fill="#e4572e" />

      {/* bags hanging from the right */}
      <path d="M720 268 L560 250" stroke="#1b1b1b" strokeWidth="3" />
      <Bag x={388} y={292} r={24} w={120} h={170} fill="#c79a63" />
      <Bag x={438} y={270} r={12} w={104} h={190} fill="#ffffff" />
      <Bag x={500} y={248} r={2} w={96} h={176} fill="#c79a63" band="#ffffff" />
      <Bag x={566} y={262} r={-14} w={84} h={150} fill="#1b1b1b" />
      <Bag x={604} y={270} r={-26} w={96} h={150} fill="#c79a63" band="#ffffff" />

      {/* dotted overlay */}
      <g stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeDasharray="0.1 11" fill="none">
        <path d="M540 60 V470 M552 60 V470 M564 80 V470 M528 80 V470" />
        <path d="M540 150 L330 250 M540 162 L330 262 M540 174 L340 272" />
        <path d="M540 150 L708 214 M540 162 L708 226" />
      </g>

      {/* scattered words */}
      <g fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="22" fill="#1b1b1b">
        <text x="420" y="66">Could</text>
        <text x="640" y="110">one</text>
        <text x="356" y="230">tap</text>
        <text x="646" y="330">sell</text>
        <text x="602" y="486">more?</text>
      </g>

      {/* cursor tags */}
      <g fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="17" fontWeight="600">
        <path d="M96 132 l18 6 -8 4 -3 9 z" fill="#1b1b1b" />
        <rect x="14" y="104" width="84" height="34" rx="17" fill="#1b1b1b" />
        <text x="56" y="127" textAnchor="middle" fill="#fff">Seller</text>
        <path d="M262 326 l-18 -6 8 -4 3 -9 z" fill="#1b1b1b" transform="translate(4 12)" />
        <rect x="262" y="336" width="104" height="34" rx="17" fill="#1b1b1b" />
        <text x="314" y="359" textAnchor="middle" fill="#fff">Shopper</text>
      </g>

      <rect width="720" height="520" filter="url(#grain)" />
    </svg>
  );
}
