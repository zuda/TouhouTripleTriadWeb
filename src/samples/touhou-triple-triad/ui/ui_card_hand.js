import { eventManager } from '../../../lib/core/event_manager';
import { UIWidget } from '../../../lib/ui/ui_widget';
import { Direction } from '../core/type.ts';
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
            </div>)
            `
        });
        this.node.querySelector('.js-border').src = path_card + 'card.png';
    }

    setFromCard(card){
        this.setCharacter(card.name)
        this.setPlayerOwner(card.flag_belongToPlayer1)
        this.setPoints(card.points[0], card.points[1], card.points[2], card.points[3])
    }

    setCharacter(charaName) {
        this.node.querySelector('.js-picture').src = path_card_avatar + charaName + ".png";
    }

    setPlayerOwner(p) {
        if(p)
            this.node.querySelector('.js-background').src = path_card + 'blue.png';   
        else
            this.node.querySelector('.js-background').src = path_card + 'red.png';
    }

    setPoints(left, top, right, bottom) {
        this.node.querySelector('.js-top').textContent = top.toString(16).toUpperCase();
        this.node.querySelector('.js-right').textContent = right.toString(16).toUpperCase();
        this.node.querySelector('.js-bottom').textContent = bottom.toString(16).toUpperCase();
        this.node.querySelector('.js-left').textContent = left.toString(16).toUpperCase();
    }

    setPoint(direction, value)
    {
        let val = value.toString(16).toUpperCase();
        switch(direction)
        {
            case Direction.N:
                this.node.querySelector('.js-top').textContent = val;
                break;
            case Direction.E:
                this.node.querySelector('.js-right').textContent = val;
                break;
            case Direction.S:
                this.node.querySelector('.js-bottom').textContent = val;
                break;
            case Direction.W:
                this.node.querySelector('.js-left').textContent = val;
                break;
        }
    }
}

export { UICardHand };