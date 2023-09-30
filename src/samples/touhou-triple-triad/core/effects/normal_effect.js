import { Effect, priorityEffect, typeEffect } from "../effect";
import { GameState } from "../gameState";

 
class NormalEffect extends Effect{
    constructor() {
        super( priorityEffect.Normal, typeEffect.InBattle);
    }

    //applique l'effet de la carte situé sur les coordonnees pos_i, pos_j sur le damier
    apply_effect(gameState, pos_i, pos_j){
        
    }
}
export { NormalEffect };