import { JekaSVG, JEKA_SIZE } from "../config";
import { JekaFacing } from "../types";

interface Config {
  onLoad?: () => void;
  onError?: () => void;
  startAt?: {
    row: number;
    column: number;
  };
}

interface jekaCoordinates {
  x: number;
  y: number;
  row: number;
  column: number;
  facing: JekaFacing;
}

const defaultCoordinates: jekaCoordinates = {
  x: 0,
  y: 0,
  row: 0,
  column: 0,
  facing: JekaFacing.EAST,
};

export class Jeka {
  svg: HTMLImageElement;
  jekaSvgIsLoaded = false;
  boardCoordinates: jekaCoordinates = defaultCoordinates;
  liveCoordinates: jekaCoordinates = defaultCoordinates;
  boardSpecificDefault = defaultCoordinates;
  size = JEKA_SIZE;

  constructor(config: Config) {
    this.svg = new Image();

    if (config.startAt) {
      this.boardCoordinates = {
        ...this.boardCoordinates,
        ...config.startAt,
      };
      this.liveCoordinates = {
        ...this.liveCoordinates,
        ...config.startAt,
      };
      this.boardSpecificDefault = {
        ...this.boardSpecificDefault,
        ...config.startAt,
      };
    }

    const svg64 = btoa(JekaSVG);
    const b64Start = "data:image/svg+xml;base64,";
    const image64 = b64Start + svg64;

    this.svg.src = image64;
    this.svg.onerror = () => {
      if (config.onError) {
        config.onError();
      }
    };
    this.svg.onload = () => {
      this.jekaSvgIsLoaded = true;
      if (config.onLoad) {
        config.onLoad();
      }
    };
  }

  setStartAt(row: number, column: number) {
    this.boardSpecificDefault = {
      ...this.boardSpecificDefault,
      row,
      column,
    };
  }

  resetCoordinates() {
    this.boardCoordinates = this.boardSpecificDefault;
    this.liveCoordinates = this.boardSpecificDefault;
  }
}
