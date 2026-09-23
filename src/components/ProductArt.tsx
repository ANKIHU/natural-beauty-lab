"use client";

import Image from "next/image";
import { CAT_META, type Product } from "@/lib/products";

/**
 * Renders the product visual. When `product.image` is set (path relative to /public),
 * a real photograph is shown. Otherwise the branded SVG vessel illustration is used
 * as an intentional fallback until hero photography is ready.
 */
export function ProductArt({ product, big = false }: { product: Product; big?: boolean }) {
  if (product.image) {
    return (
      <Image
        src={product.image}
        alt={product.name}
        width={big ? 720 : 360}
        height={big ? 600 : 300}
        className="w-full h-full object-cover"
        sizes={big ? "(max-width: 980px) 100vw, 50vw" : "(max-width: 720px) 50vw, 232px"}
        priority={big}
      />
    );
  }

  const m = CAT_META[product.category] || CAT_META["Body"];
  const uid = (big ? "b" : "s") + product.id;
  const label = product.name.split(" ").slice(0, 2).join(" ").toUpperCase().slice(0, 16);

  const labelBlock = (x: number, y: number, w: number, h: number, fs1: number, fs2: number) => (
    <>
      <rect x={x} y={y} width={w} height={h} rx={5} fill="#FBF8F0" stroke={m.ink} strokeOpacity=".22" />
      <text x={x + w / 2} y={y + h * 0.42} textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontWeight="700" fontSize={fs1} fill={m.ink}>N·B·L</text>
      <line x1={x + w * 0.2} y1={y + h * 0.55} x2={x + w * 0.8} y2={y + h * 0.55} stroke={m.ink} strokeOpacity=".35" />
      <text x={x + w / 2} y={y + h * 0.78} textAnchor="middle" fontFamily="'Karla',sans-serif" fontSize={fs2} letterSpacing=".5" fill={m.ink} opacity=".85">{label}</text>
    </>
  );

  const vesselMap: Record<string, React.ReactNode> = {
    bar: (
      <g>
        <rect x={96} y={150} width={168} height={96} rx={14} fill={`url(#g${uid})`} stroke={m.ink} strokeOpacity=".25" />
        <rect x={96} y={150} width={168} height={18} rx={9} fill="#FFFFFF" opacity=".28" />
        {labelBlock(122, 176, 116, 46, 17, 7.5)}
      </g>
    ),
    jar: (
      <g>
        <rect x={110} y={128} width={140} height={16} rx={7} fill={m.ink} opacity=".85" />
        <rect x={104} y={144} width={152} height={106} rx={16} fill={`url(#g${uid})`} stroke={m.ink} strokeOpacity=".25" />
        <rect x={104} y={144} width={152} height={20} rx={10} fill="#FFFFFF" opacity=".22" />
        {labelBlock(126, 168, 108, 52, 17, 7.5)}
      </g>
    ),
    dropper: (
      <g>
        <rect x={164} y={92} width={32} height={20} rx={4} fill="#2E2A24" />
        <rect x={171} y={80} width={18} height={14} rx={7} fill="#3A352C" />
        <rect x={146} y={112} width={68} height={138} rx={12} fill={`url(#g${uid})`} stroke={m.ink} strokeOpacity=".3" />
        <rect x={152} y={118} width={12} height={120} rx={6} fill="#FFFFFF" opacity=".22" />
        {labelBlock(152, 150, 56, 64, 13, 5.6)}
      </g>
    ),
    pump: (
      <g>
        <path d="M172 84 h34 v12 h-22 v14 h-12 z" fill="#2E2A24" />
        <rect x={166} y={108} width={28} height={18} fill="#3A352C" />
        <rect x={140} y={126} width={80} height={124} rx={12} fill={`url(#g${uid})`} stroke={m.ink} strokeOpacity=".3" />
        <rect x={146} y={132} width={12} height={110} rx={6} fill="#FFFFFF" opacity=".25" />
        {labelBlock(148, 158, 64, 62, 14, 5.8)}
      </g>
    ),
    bottle: (
      <g>
        <rect x={164} y={86} width={32} height={22} rx={5} fill="#2E2A24" />
        <path d="M150 108 h60 l10 26 v104 a12 12 0 0 1 -12 12 h-56 a12 12 0 0 1 -12 -12 v-104 z" fill={`url(#g${uid})`} stroke={m.ink} strokeOpacity=".3" />
        <rect x={148} y={140} width={12} height={96} rx={6} fill="#FFFFFF" opacity=".2" />
        {labelBlock(150, 158, 60, 64, 14, 5.6)}
      </g>
    ),
    tube: (
      <g transform="rotate(-14 180 176)">
        <rect x={120} y={150} width={120} height={56} rx={10} fill={`url(#g${uid})`} stroke={m.ink} strokeOpacity=".3" />
        <rect x={240} y={156} width={18} height={44} rx={4} fill="#2E2A24" />
        <path d={`M120 150 q-12 28 0 56`} fill={m.c2} opacity=".7" />
        {labelBlock(140, 160, 84, 36, 13, 6)}
      </g>
    ),
    tin: (
      <g>
        <ellipse cx={180} cy={236} rx={86} ry={16} fill={m.ink} opacity=".14" />
        <rect x={100} y={172} width={160} height={62} rx={12} fill={`url(#g${uid})`} stroke={m.ink} strokeOpacity=".3" />
        <ellipse cx={180} cy={172} rx={80} ry={18} fill={m.c1} stroke={m.ink} strokeOpacity=".3" />
        <ellipse cx={180} cy={172} rx={58} ry={12} fill="#FBF8F0" stroke={m.ink} strokeOpacity=".2" />
        <text x={180} y={176} textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontWeight="700" fontSize={13} fill={m.ink}>N·B·L</text>
        {labelBlock(132, 192, 96, 32, 12, 6)}
      </g>
    ),
    pot: (
      <g>
        <rect x={128} y={112} width={104} height={26} rx={10} fill={m.ink} opacity=".85" />
        <path d="M120 138 h120 v88 a20 20 0 0 1 -20 20 h-80 a20 20 0 0 1 -20 -20 z" fill={`url(#g${uid})`} stroke={m.ink} strokeOpacity=".3" />
        {labelBlock(140, 162, 80, 52, 15, 6.4)}
      </g>
    ),
  };

  const vessel = vesselMap[product.vessel] || vesselMap.jar;

  return (
    <svg viewBox="0 0 360 300" role="img" aria-label={product.name} className="w-full h-full">
      <defs>
        <radialGradient id={`bg${uid}`} cx="50%" cy="34%" r="80%">
          <stop offset="0%" stopColor={m.c1} />
          <stop offset="100%" stopColor={m.c1} stopOpacity=".55" />
        </radialGradient>
        <linearGradient id={`g${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={m.c1} />
          <stop offset="100%" stopColor={m.c2} />
        </linearGradient>
      </defs>
      <rect width="360" height="300" fill={`url(#bg${uid})`} />
      <circle cx="180" cy="150" r="118" fill="#FFFFFF" opacity=".16" />
      <ellipse cx="180" cy="252" rx="98" ry="13" fill={m.ink} opacity=".12" />
      <g transform="translate(258,64) rotate(18)" opacity=".9">
        <path d="M0 0 C 14 -20 34 -26 54 -22 C 50 -2 34 12 12 12 Z" fill={m.c2} opacity=".55" />
        <path d="M0 0 C 54 -22 54 -22 54 -22" stroke={m.ink} strokeWidth="1.4" fill="none" opacity=".5" />
        <path d="M10 -4 L16 -14 M22 -8 L30 -18 M34 -12 L42 -20" stroke={m.ink} strokeWidth="1.2" opacity=".4" />
      </g>
      {vessel}
    </svg>
  );
}
