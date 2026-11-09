/**
 * Спільні значення прогресу прокрутки (0..1) для 3D-сцен.
 * GSAP (ScrollTrigger onUpdate) пише сюди, сцени читають у useFrame — без ре-рендерів React.
 */
export const aboutProgress = { current: 0 };
