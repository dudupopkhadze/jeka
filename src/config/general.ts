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

export const EditorStartingCode = `// available commands
// moveForward - jeka goes forward
// turnLeft - jeka turns left
// woof - jeka barks back at you (because he's a dog ofc)
// also available are: if/else branching, while/for loops, functions and variables
// e.g moveForward(); or turnLeft(); woof();
// function turnRight(){
//   turnLeft();
//   turnLeft();
//}
// while(frontIsClear()){
// moveForward();
// turnRight();
//}
moveForward();
turnLeft();
moveForward();
while(hasBones()){
 pickBone();
}
moveForward();
\n`;
