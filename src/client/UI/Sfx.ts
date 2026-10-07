type Player = (cue: string) => void;

let player: Player | undefined;

/**
 * UI components call `Sfx.play(cue)`. The game binds real playback at runtime; while
 * unbound (UI Labs stories, offline tests) it is a silent no-op, so components stay
 * presentation-only.
 */
export const Sfx = {
  /** Sets the function that plays a cue, or clears it with `undefined`. */
  bind: (callback: Player | undefined) => {
    player = callback;
  },

  play: (cue: string) => {
    if (player) player(cue);
  },
};
