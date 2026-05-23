import "./index.css";
import { Composition } from "remotion";
import { Day47 } from "./Day47";
import { Launch } from "./Launch";
import { ComingSoon } from "./ComingSoon";
import { WhatIs } from "./WhatIs";
import { WhatIsV2 } from "./WhatIsV2";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="WhatIsV2"
        component={WhatIsV2}
        durationInFrames={450}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="WhatIs"
        component={WhatIs}
        durationInFrames={1110}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="Day47"
        component={Day47}
        durationInFrames={FPS * 15}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="Launch"
        component={Launch}
        durationInFrames={FPS * 15}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="ComingSoon"
        component={ComingSoon}
        durationInFrames={FPS * 8}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
