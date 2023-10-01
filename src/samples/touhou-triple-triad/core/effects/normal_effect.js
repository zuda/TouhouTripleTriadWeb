import { Effect, priorityEffect, typeEffect } from "../effect";
import { Direction } from "../type";
import { GameState } from "../gameState";

 
class NormalEffect extends Effect{
    constructor() {
        super( priorityEffect.Normal, typeEffect.InBattle);
    }

    //applique l'effet de la carte situé sur les coordonnees pos_i, pos_j sur le damier
    apply_effect(gameState, pos_i, pos_j){
        let board = gameState.getBoard()
        // let cur_card = gameState.getCardFromBoard(pos_i, pos_j)
        // for(let dir = Direction.W; dir<Direction.S+1; dir+=1) {
        //     gameState.getNeighbourCardFromBoard(pos_i, pos_j)
        // }
    }
}
export { NormalEffect };