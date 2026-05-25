import { continueRender, delayRender, staticFile } from "remotion";

let _handle: ReturnType<typeof delayRender> | null = null;

export function loadInterFont() {
  _handle = delayRender("Loading Inter font");

  const add = (weight: string, file: string) =>
    new FontFace("Inter", `url('${staticFile(`fonts/${file}`)}')`, { weight, style: "normal" }).load();

  Promise.all([
    add("400", "Inter-400.ttf"),
    add("700", "Inter-700.ttf"),
    add("900", "Inter-900.ttf"),
  ])
    .then((fonts) => {
      fonts.forEach((f) => document.fonts.add(f));
      continueRender(_handle!);
    })
    .catch(() => continueRender(_handle!));
}
