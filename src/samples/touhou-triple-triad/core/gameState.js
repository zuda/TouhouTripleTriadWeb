import { Card } from "./card";
import { Direction } from "./type";
import { NormalEffect } from "./effects/normal_effect";
import { IdentiqueEffect } from "./effects/identique";
import { PlusEffect } from "./effects/plus";

const SIZE_HAND = 8
const SIZE_BOARD = 4

class GameState {
    constructor(){
        this.hands = [new Array(SIZE_HAND), new Array(SIZE_HAND)]
        this.nb_cards_in_hand = [SIZE_HAND, SIZE_HAND]
        this.board = new Array(SIZE_BOARD)
        this.rules
        this.standardsEffect = [new PlusEffect(), new IdentiqueEffect(), new NormalEffect()]
        for (let i = 0; i < SIZE_BOARD; i++){
            this.board[i] = new Array(SIZE_BOARD)
            for (let j = 0; j < SIZE_BOARD; j++){
                this.board[i][j] = null
            }
        }
    }

    //getter
    getBoard(){
        return this.board;
    }
    
    getCardFromBoard(i, j){
        return this.board[i][j];
    }

    setHandCard(player_num, card, i){
        this.hands[player_num][i] =  card
    }

    clearBoard(){
        for (let i = 0; i < SIZE_BOARD; i++){
            for (let j = 0; j < SIZE_BOARD; j++){
                this.board[i][j] = null
            }
        }
    }

    placeHandCardOnBoard(player_num, num_card, i, j){
        this.board[i][j] = this.hands[player_num][num_card]
        for (let i = num_card; i < SIZE_BOARD-1; i++){
            this.hands[player_num][num_card] = this.hands[player_num][num_card+1]
        }
    }


    //enleve une carte de la main, et repositionne les cartes suivante pour éviter les trous 
    removeCardAndRearrangeHand(player_num, i_remove){
        for(let i = i_remove; i < this.nb_cards_in_hand[player_num]-1; i++){ 
            this.hands[player_num][i] = this.hands[player_num][i+1]
        }
        this.nb_cards_in_hand[player_num] -= 1; 
    }

    getNeighbourCardFromBoard(i, j, dir){
        let coord_neighbour = getCoordinateNeighbourCardFromBoard()
        return this.board[coord_neighbour[0]][coord_neighbour[1]];
    }

    getCoordinateNeighbourCardFromBoard(i, j, dir){
        let i_neighbour = i;
        let j_neighbour = j;
        switch(dir){                
            case Direction.N:
                (i_neighbour==0) ? i_neighbour=SIZE_BOARD-1 : i_neighbour=i_neighbour-1
                break;
            case Direction.E:
                (j_neighbour==SIZE_BOARD-1) ? j_neighbour=0 : j_neighbour=j_neighbour+1
                break;
            case Direction.S:
                (i_neighbour==SIZE_BOARD-1) ? i_neighbour=0 : i_neighbour=i_neighbour+1
                break;
            case Direction.W:
                (j_neighbour==0) ? j_neighbour=SIZE_BOARD-1 : j_neighbour=j_neighbour-1
                break;
        }
        return [i_neighbour, j_neighbour];
    }

    performBattle(i, j){
        let coord_cardToupdate = new Array(0)
        for(let i_effect = 0; i_effect<this.standardsEffect.length; i_effect+=1){
            this.standardsEffect[i_effect].apply_effect(this, i, j, coord_cardToupdate);
        }
        return coord_cardToupdate
    }
}
export { GameState };
export { SIZE_HAND, SIZE_BOARD };