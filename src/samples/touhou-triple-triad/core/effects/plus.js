import { Effect } from "../effects";
import { Direction, typeEffect, priorityEffect } from "../type";
import { GameState } from "../gameState";

 
class PlusEffect extends Effect{
    constructor() {
        super( priorityEffect.Identique, typeEffect.InBattle);
    }

    //applique l'effet de la carte situé sur les coordonnees pos_i, pos_j sur le damier
    //coord_cardToUpdate : parametre en mode inout, contenant la liste des carte dont il faudra mettre à jour l'ui
    apply_effect(gameState, pos_i, pos_j, coord_cardToUpdate){
        let board = gameState.getBoard()
        let cur_card = gameState.getCardFromBoard(pos_i, pos_j)
        let list_sum = []
        let list_coord = []
        // on calcule la somme de la valeur de la carte entrée en jeu avec la valeur vis à vis de son voisin et ceux pour chaque voisin
        for(let dir = Direction.W; dir<Direction.S+1; dir+=1) {
            let coord_neighbour = gameState.getCoordinateNeighbourCardFromBoard(pos_i, pos_j, dir);
            let neighbour_card = gameState.getCardFromBoard(coord_neighbour[0], coord_neighbour[1]);
            if ( neighbour_card != null){
                list_sum.push(cur_card.getVal(dir) + neighbour_card.getVal((dir+2)%4)) 
                list_coord.push(coord_neighbour)
            }
        }

        //on regarde s'il y a deux sommes identique
        let flag_plus = false;
        let i = 0
        for (i = 0; i<list_sum.length-1; i+=1){
            for (let j = i; j<list_sum.length; j+=1){
                if(list_sum[i] == list_sum[j]){
                    flag_plus = true;
                    break;
                }
            }
        }

        //si il y a des sommes identiques, toutes les cartes sont vaincu
        if(flag_plus)
            for (i = 0; i<list_coord.length; i+=1){
                let neighbour_card = gameState.getCardFromBoard(list_coord[i][0], list_coord[i][1]);
                // si la carte voisine est une carte ennemi, elle devient une carte allié
                if ( neighbour_card.getOwner() != cur_card.getOwner() ){
                    neighbour_card.flipPlayerOwner();
                    coord_cardToUpdate.push(list_coord[i]);
                }
            }
    }
}
export { PlusEffect };