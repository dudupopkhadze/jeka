import { BONE_SIZE, BoneSVG } from "../config";

interface Config {
  onLoad?: () => void;
  onError?: () => void;
  providedLocations?: { row: number; column: number; count: number }[];
}

export class Bone {
  svg: HTMLImageElement;
  boneSvgIsLoaded = false;
  boardLocations = new Map<string, number>();
  liveLocations = new Map<string, number>();
  providedLocations?: { row: number; column: number; count: number }[];
  size = BONE_SIZE;

  constructor(config: Config) {
    this.svg = new Image();

    const svg64 = btoa(BoneSVG);
    const b64Start = "data:image/svg+xml;base64,";
    const image64 = b64Start + svg64;

    this.svg.src = image64;
    this.svg.onerror = () => {
      if (config.onError) {
        config.onError();
      }
    };
    this.svg.onload = () => {
      this.boneSvgIsLoaded = true;
      if (config.onLoad) {
        config.onLoad();
      }
    };

    this.providedLocations = config.providedLocations;
    this.initLocations();
  }

  private initLocations() {
    if (this.providedLocations) {
      this.providedLocations.forEach((location) => {
        this.boardLocations.set(
          `${location.row}:${location.column}`,
          location.count
        );
        this.liveLocations.set(
          `${location.row}:${location.column}`,
          location.count
        );
      });
    }
  }
}
