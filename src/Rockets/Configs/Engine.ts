export type EngineConfig = {
  name: string;
  mass: number;

  thrust: {
    sl: number;
    vac: number;
  };

  throttle: {
    min: number;
    max: number;
  };

  massFlow: {
    sl: number;
    vac: number;
  };

  gimbleRange: number;
};
