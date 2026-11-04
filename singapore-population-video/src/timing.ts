export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Scene lengths in frames. Transitions overlap neighbouring scenes,
// so the total is the sum of scenes minus the sum of transitions.
export const SCENES = {
  title: 100,
  growth: 246,
  drivers: 190,
  outro: 100,
} as const;

export const TRANSITION = 12;

export const TOTAL_DURATION =
  Object.values(SCENES).reduce((a, b) => a + b, 0) -
  TRANSITION * (Object.keys(SCENES).length - 1); // 600 frames = 20 s
