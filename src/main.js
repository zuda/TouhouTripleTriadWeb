import { screenManager } from './lib/screen/screen_manager';
import { uiManager } from './lib/ui/ui_manager';
// ---------------------------------------------------------------------------------------
import { GameScreen } from './game/game_screen';
// ---------------------------------------------------------------------------------------

class GameManager {
  constructor() {
    this.then = 0;
  }

  run(timeStamp) {
    const ts = timeStamp - this.then;
    this.then = timeStamp;
    uiManager.update(ts);
    screenManager.update(ts);
    requestAnimationFrame(timeStamp => this.run(timeStamp));
  }
}

export const gameManager = new GameManager();
gameManager.run(0);
screenManager.requestSetScreen(new GameScreen());