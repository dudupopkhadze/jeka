import { BoneSVG, BONE_SIZE } from "../config";

interface Config {
  onLoad?: () => void;
  onError?: () => void;
  providedLocations?: { row: number; column: number; count: number }[];
}

export class BoneManager {
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

  canPickBone(row: number, column: number): boolean {
    const boneCount = this.boardLocations.get(`${row}:${column}`);
    return boneCount ? boneCount > 0 : false;
  }

  canPickBoneLive(row: number, column: number): boolean {
    const boneCount = this.liveLocations.get(`${row}:${column}`);
    return boneCount ? boneCount > 0 : false;
  }

  putBone(row: number, column: number): void {
    const boneCount = this.boardLocations.get(`${row}:${column}`);
    if (boneCount) {
      this.boardLocations.set(`${row}:${column}`, boneCount + 1);
    } else {
      this.boardLocations.set(`${row}:${column}`, 1);
    }
  }

  putBoneLive(row: number, column: number): void {
    const boneCount = this.liveLocations.get(`${row}:${column}`);
    if (boneCount) {
      this.liveLocations.set(`${row}:${column}`, boneCount + 1);
    } else {
      this.liveLocations.set(`${row}:${column}`, 1);
    }
  }

  updateProvidedLocations(
    providedLocations: { row: number; column: number; count: number }[]
  ) {
    this.providedLocations = providedLocations;
    this.initLocations();
  }

  private initLocations() {
    if (this.providedLocations) {
      this.boardLocations.clear();
      this.liveLocations.clear();
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
