import { Effect } from "../effects";
import { Direction, typeEffect, priorityEffect } from "../type";
import { GameState } from "../gameState";

 
class IdentiqueEffect extends Effect{
    constructor() {
        super( priorityEffect.Identique, typeEffect.InBattle);
    }

    //applique l'effet de la carte situé sur les coordonnees pos_i, pos_j sur le damier
    //coord_cardToUpdate : parametre en mode inout, contenant la liste des carte dont il faudra mettre à jour l'ui
    apply_effect(gameState, pos_i, pos_j, coord_cardToUpdate){
        let cpt_p1_gain = 0;
        let cur_card = gameState.getCardFromBoard(pos_i, pos_j)
        let list_coord = []
        // on vérifie si le nombre de fois que la valeur de la carte posée est identique à celle de son voisin est supérieur a 2
        let cpt = 0;
        let flag_identique = false;
        for(let dir = Direction.W; dir<Direction.S+1; dir+=1) {
            let coord_neighbour = gameState.getCoordinateNeighbourCardFromBoard(pos_i, pos_j, dir);
            let neighbour_card = gameState.getCardFromBoard(coord_neighbour[0], coord_neighbour[1]);
            if ( neighbour_card != null 
                && cur_card.getVal(dir) == neighbour_card.getVal((dir+2)%4)){
                cpt += 1
                if(cpt == 2){
                    flag_identique = true
                }
                list_coord.push(coord_neighbour)
            }
        }

        //si il y a des sommes identiques, toutes les cartes sont vaincu
        for (let i = 0; i<list_coord.length; i+=1){
            let neighbour_card = gameState.getCardFromBoard(list_coord[i][0], list_coord[i][1]);
            // si la carte voisine est une carte ennemi, elle devient une carte allié
            if ( neighbour_card.getOwner() != cur_card.getOwner() ){
                neighbour_card.flipPlayerOwner();
                coord_cardToUpdate.push(coord_neighbour);
                if(neighbour_card.getOwner()) 
                    cpt_p1_gain+=1;
                else
                    cpt_p1_gain-=1;
            }
        }
        return cpt_p1_gain;
    }
}
export { IdentiqueEffect };