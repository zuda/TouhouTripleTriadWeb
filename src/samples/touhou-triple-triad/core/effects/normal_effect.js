import { Effect } from "../effects";
import { Direction, typeEffect, priorityEffect } from "../type";
import { GameState } from "../gameState";

 
class NormalEffect extends Effect{
    constructor() {
        super( priorityEffect.Normal, typeEffect.InBattle);
    }

    //applique l'effet de la carte situé sur les coordonnees pos_i, pos_j sur le damier
    //coord_cardToUpdate : parametre en mode inout, contenant la liste des carte dont il faudra mettre à jour l'ui
    apply_effect(gameState, pos_i, pos_j, coord_cardToUpdate){
        let cpt_p1_gain = 0;
        let cur_card = gameState.getCardFromBoard(pos_i, pos_j)
        for(let dir = Direction.W; dir<Direction.S+1; dir+=1) {
            let coord_neighbour = gameState.getCoordinateNeighbourCardFromBoard(pos_i, pos_j, dir);
            if(coord_neighbour!=null){
                let neighbour_card = gameState.getCardFromBoard(coord_neighbour[0], coord_neighbour[1]);
                if ( neighbour_card != null 
                    && neighbour_card.getOwner() != cur_card.getOwner() 
                    && cur_card.getVal(dir) > neighbour_card.getVal((dir+2)%4)
                ){
                    // console.log("normal attack vs " + neighbour_card.name)
                    neighbour_card.flipPlayerOwner();
                    coord_cardToUpdate.push(coord_neighbour);
                    if(neighbour_card.getOwner()) 
                        cpt_p1_gain+=1;
                    else
                        cpt_p1_gain-=1;
                }
            }
        }
        return cpt_p1_gain;
    }
}
export { NormalEffect };