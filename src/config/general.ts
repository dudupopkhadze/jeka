import { AvailableAudio } from "../types";

export enum Delay {
  MIN = 10,
  MAX = 1000,
  DEFAULT = 500,
}

export const AudioLocations = [
  {
    name: "woof",
    value: AvailableAudio.WOOF,
    location: "assets/woof/sound.mp3",
  },
];

export const MAX_WHILE_LOOP = 10000;

export const EditorStartingCode = `// click documentation button above for the api docs\n`;
