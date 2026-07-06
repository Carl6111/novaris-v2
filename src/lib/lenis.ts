import type Lenis from "lenis";

// module singleton so route changes can reset scroll on the active Lenis instance
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis() {
  return instance;
}

export function scrollTop() {
  if (instance) instance.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}
