import { eventManager } from '../../../lib/core/event_manager';
import { UIWidget } from '../../../lib/ui/ui_widget';
// ---------------------------------------------------------------------------------------
const path_card_avatar = 'samples/touhou-triple-triad/card_img/';
const path_card = 'samples/touhou-triple-triad/';
class UICardHand extends UIWidget {
  constructor() {
    super({
      className: 'UICardHand',
      template: `
      <img class="UICardHand-picture js-background"/>
      <img class="UICardHand-picture js-picture"/>
      <img class="UICardHand-picture js-border"/>
      <div class="UICardHand-points">
        <div class="UICardHand-points-t js-top"></div>
        <div class="UICardHand-points-r js-right"></div>
        <div class="UICardHand-points-l js-left"></div>
        <div class="UICardHand-points-b js-bottom"></div>
      </div>
      `
    });
    this.node.querySelector('.js-border').src = path_card + 'card.png';
  }

  setCharacter(charaName) {
    this.node.querySelector('.js-picture').src = path_card_avatar + charaName + ".png";
    console.log(path_card_avatar + charaName)
  }

  setPlayerOwner(p) {
    if(p)
      this.node.querySelector('.js-background').src = path_card + 'blue.png'
    else
      this.node.querySelector('.js-background').src = path_card + 'red.png'
  }

  setPoints(top, right, bottom, left) {
    this.node.querySelector('.js-top').textContent = top;
    this.node.querySelector('.js-right').textContent = right;
    this.node.querySelector('.js-bottom').textContent = bottom;
    this.node.querySelector('.js-left').textContent = left;
  }
}

export { UICardHand };