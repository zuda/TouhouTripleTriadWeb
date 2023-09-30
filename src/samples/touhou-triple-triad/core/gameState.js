import { Card } from "./card";

const SIZE_HAND = 8
const SIZE_BOARD = 4

class GameState {
    constructor(){
        this.hands = [new Array(SIZE_HAND), new Array(SIZE_HAND)]
        this.board = new Array(SIZE_BOARD)
        for (let i = 0; i < SIZE_BOARD; i++){
            this.board[i] = new Array(SIZE_BOARD)
        }
    }

    setHandCard(player_num, card, i){
        this.hands[player_num][i] =  card
    }

    setHand(player_num, array_cards){
        for (let i = 0; i<size_hand; i++){
            this.hands[player_num][i] =  array_cards[i]
        }
    }

    clearBoard(){
        for (let i = 0; i < size_board; i++){
            for (let j = 0; j < size_board; j++){
                this.board[i][j] = null
            }
        }
    }

    placeHandCardOnBoard(player_num, num_card, i, j){
        this.board[i][j] = this.hands[player_num][num_card]
        for (let i = num_card; i < size_board-1; i++){
            this.hands[player_num][num_card] = this.hands[player_num][num_card+1]
        }
    }

    getCardFromBoard(i, j)
    {
        return this.board[i][j];
    }

    getNeighbourCardFromBoard(i, j, dir)
    {
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
        return this.board[i_neighbour][j_neighbour];
    }
}
export { GameState };
export { SIZE_HAND, SIZE_BOARD };