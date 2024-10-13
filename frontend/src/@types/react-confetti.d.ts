declare module "react-confetti" {
  import React from "react";

  interface ConfettiProps {
    width?: number;
    height?: number;
    numberOfPieces?: number;
    recycle?: boolean;
    wind?: number;
    gravity?: number;
    run?: boolean;
    colors?: string[];
  }

  const Confetti: React.FC<ConfettiProps>;
  export default Confetti;
}
