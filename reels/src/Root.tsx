import "./index.css";
import { Composition } from "remotion";
import { Day47 } from "./Day47";
import { Launch } from "./Launch";
import { ComingSoon } from "./ComingSoon";
import { WhatIs } from "./WhatIs";
import { WhatIsV2 } from "./WhatIsV2";
import { WhatIsV3 } from "./WhatIsV3";
import { Story } from "./Story";
import { AppDemo } from "./AppDemo";
import { Pipeline } from "./Pipeline";
import { Signs } from "./Signs";
import { Reveal } from "./Reveal";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Pipeline"
        component={Pipeline}
        durationInFrames={270}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="Signs"
        component={Signs}
        durationInFrames={380}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="Reveal"
        component={Reveal}
        durationInFrames={360}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="AppDemo"
        component={AppDemo}
        durationInFrames={480}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="Story"
        component={Story}
        durationInFrames={120}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="WhatIsV3"
        component={WhatIsV3}
        durationInFrames={450}
        fps={FPS}
        width={1080}
        height={1920}
      />
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
