export type Theme = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'ls-theme';
export const THEME_COLORS: Record<Theme, string> = { dark: '#0b0a09', light: '#f4f1ea' };

/** Runs in <head> before first paint so the stored theme never flashes. */
export const themeBootScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='light'&&t!=='dark')t='dark';var d=document.documentElement;d.dataset.theme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',t==='light'?'${THEME_COLORS.light}':'${THEME_COLORS.dark}');}catch(e){}})();`;

export function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* private mode */
  }
}

/** Swaps the theme with a circular reveal from (x, y) where View Transitions are available. */
export function switchTheme(next: Theme, origin?: { x: number; y: number }) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || reduce) {
    applyTheme(next);
    return;
  }
  const x = origin?.x ?? window.innerWidth - 40;
  const y = origin?.y ?? 40;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const transition = document.startViewTransition(() => applyTheme(next));
  transition.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'cubic-bezier(0.76, 0, 0.24, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    })
    .catch(() => undefined);
}
