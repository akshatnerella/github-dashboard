export const tileStyles = {
  base: [
    'relative isolate w-full h-full overflow-hidden',
    'rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl',
    'shadow-[0_12px_40px_rgba(13,16,27,.25)]',
    'px-4 py-3',
  ].join(' '),
  header: 'text-[17px] font-semibold leading-none text-slate-900',
  rail: 'pointer-events-none absolute left-[12px] top-2 bottom-2 w-[2px] rounded-full z-0 bg-gradient-to-b from-[#7CB8FF]/85 via-[#8B7CFF]/75 to-[#F59BCB]/65',
  fade: 'pointer-events-none absolute inset-x-0 bottom-0 h-16 z-20 bg-gradient-to-b from-transparent to-[rgba(255,255,255,0.9)]',
  rounding: 'rounded-3xl',
  shadow: 'shadow-[0_12px_40px_rgba(13,16,27,.25)]',
  glossiness: 'bg-[linear-gradient(180deg,rgba(255,255,255,.07),transparent_45%)]',
  glassmorphism: 'backdrop-blur-xl bg-white/10',
  frosting: 'ring-1 ring-white/10',
  titleText: 'text-2xl font-bold text-black',
  subtitleText: 'text-lg text-gray-800',
  bodyText: 'text-sm text-[#6B7280]',
  inlineDotStyle: {
    background:
      'radial-gradient(circle at 30% 30%, rgba(255,255,255,.95), rgba(255,255,255,.7) 40%, transparent 41%), linear-gradient(135deg, #7CB8FF, #8B7CFF)',
    boxShadow: '0 0 8px rgba(255,255,255,.35)',
  },
  glassTileBase: ['glass-tile', 'glass-decor', 'p-5'].join(' '),
};
