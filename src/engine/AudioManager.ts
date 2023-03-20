import { AudioLocations } from "../config";
import { AvailableAudio } from "../types";

export class AudioManager {
  private resources: { value: AvailableAudio; audio: HTMLAudioElement }[] = [];
  constructor() {
    this.resources = AudioLocations.map((audio) => ({
      value: audio.value,
      audio: new Audio(audio.location),
    }));
  }

  public play(value: AvailableAudio) {
    const resource = this.resources.find(
      (resource) => resource.value === value
    );

    if (resource) {
      resource.audio.play();
      return true;
    }

    return false;
  }
}
