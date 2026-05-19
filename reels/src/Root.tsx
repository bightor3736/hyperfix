import "./index.css";
import { Composition } from "remotion";
import { Day47 } from "./Day47";
import { Launch } from "./Launch";
import { ComingSoon } from "./ComingSoon";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
