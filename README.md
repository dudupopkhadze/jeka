# Jeka

Jeka is project inspired by Karel.

Karel is an educational programming language for beginners, created by Richard E. Pattis in his book Karel The Robot: A Gentle Introduction to the Art of Programming.

![android-chrome-512x512](https://user-images.githubusercontent.com/48488310/226406995-daf88184-939f-4213-99af-aa2d7140f3ba.png)

## What is Jeka

Jeka is friendly dog that lives in an environment consisting of a grid of streets (left-right) and avenues (up-down). Jeka understands basic instructions:

- `moveForward`: Jeka moves by one square in the direction he is facing
- `turnLeft`: Jeka turns 90 ° left
- `woof`: Jeka barks at you (friendly)
- `frontIsClear`: Jeka tells you if you can move forward in the facing direction
- `hasBones`: Jeka tells you if there is a bone on the current position
- `putBone`: Jeka puts a bone on the square he is standing at
- `pickBone`: Jeka picks a bone from the square he is standing at

## How does Jeka work?

Jeka has 4 main modules:

- **_Mustang_** (custom language interpreter that takes the code you write and translates it to the commands known to Jeka)
- **_BoardController_** (module that takes care of drawing Jeka, Jeka's World and Jeka's moves)
- **_Engine_** (module that is responsible for connecting `Mustang` and `BoardController`
- **_CodeController_** (module that takes care of getting user's input to the `Engine`)

## Demo Code

Valid Jeka code example (success of running directly this code depends in the Jeka's World)

```
moveForward();
turnLeft();

fun turnRight(){
  turnLeft();
  turnLeft();
}

var i = 0;

while(i < 5){
  turnRight();
  i = i + 1;
}

while(frontIsClear()){
  moveForward();
}

while(hasBones()){
  pickBone();
}

putBone();

turnRight();

```

## Running Locally

In the project directory, you can run:

### `npm start`

Runs the app in the development mode on port: 3000.

### `npm run ts`

Typescript check.

### `npm run build`

Builds the app for production to the `build` folder.
