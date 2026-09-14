export const mouse = { x: 0, y: 0 };

let inited = false;

export function initMouse() {
  if (inited || typeof window === 'undefined') return;
  inited = true;
  const update = (x: number, y: number) => {
    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -((y / window.innerHeight) * 2 - 1);
  };
  window.addEventListener('mousemove', (e) => update(e.clientX, e.clientY));
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') update(e.clientX, e.clientY);
  });
}