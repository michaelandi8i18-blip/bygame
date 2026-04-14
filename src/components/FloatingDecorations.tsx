'use client';

export default function FloatingDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Stars */}
      <span className="absolute top-[15%] left-[5%] text-xl animate-twinkle opacity-20 hidden lg:block">⭐</span>
      <span className="absolute top-[25%] right-[8%] text-lg animate-twinkle [animation-delay:1s] opacity-15 hidden lg:block">✨</span>
      <span className="absolute top-[50%] left-[3%] text-sm animate-float [animation-delay:2s] opacity-15 hidden lg:block">💕</span>

      {/* Hearts - bottom corners */}
      <span className="absolute bottom-[20%] right-[4%] text-2xl animate-float opacity-10 hidden lg:block">💗</span>
      <span className="absolute bottom-[35%] left-[6%] text-xl animate-twinkle [animation-delay:0.5s] opacity-10 hidden lg:block">💎</span>

      {/* Mobile: minimal decorations */}
      <span className="absolute top-[40%] right-[2%] text-sm animate-twinkle opacity-10 lg:hidden">⭐</span>
      <span className="absolute bottom-[60%] left-[2%] text-sm animate-float opacity-10 lg:hidden">💕</span>
    </div>
  );
}
