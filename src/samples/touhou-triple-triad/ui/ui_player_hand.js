import { UICardHand } from "./ui_card_hand";
import { uiManager } from "../../../lib/ui/ui_manager";
import { SIZE_HAND } from "../core/gameState";

class UIPlayerHands {
    constructor(p_cursor) {
        this.cursor = p_cursor
        this.offset_cursor = [30, -30];
        this.size_i = 70;
        this.size_j = 130;
        this.offset_i = 35;
        this.offset_j = [30,1330];
        this.offset_select = 30;
        this.scale = 9;
        this.nb_cards_in_hand = [0,0];
        this.player_hands = new Array(2)
        this.i_selected = 0
        for (let i = 0; i < 2; i++){
            this.player_hands[i] = new Array(SIZE_HAND)
        }
    }

    addCard(player_num, card){
        if (this.nb_cards_in_hand[player_num] < SIZE_HAND){
            this.player_hands[player_num][this.nb_cards_in_hand[player_num]] = card
            this.nb_cards_in_hand[player_num] += 1
        }
    }

    // supprime la derniere cartes dans la main de #player_num
    removeLastCard(player_num){
        let card = null
        if (this.nb_cards_in_hand[player_num] > 0){
            card = this.player_hands[player_num][this.nb_cards_in_hand[player_num]]
            this.player_hands[player_num][this.nb_cards_in_hand[player_num]] = null
            this.nb_cards_in_hand[player_num] -= 1
        }
        return card
    }

    // supprime la derniere cartes dans la main de #player_num
    removeCurCardAndRearrangeHand(player_num){
        for(let i = this.i_selected; i < this.nb_cards_in_hand[player_num]-1; i++){ 
            this.player_hands[player_num][i] = this.player_hands[player_num][i+1]
            this.player_hands[player_num][i].ui.node.style.top = this.size_i*i+this.offset_i + "px";
        }
        this.nb_cards_in_hand[player_num] -= 1; 
    }
    

    addAllWidjetCards(){
        for(let i = 0; i < 2; i++){
            for(let j = 0; j < SIZE_HAND; j++){
                uiManager.addWidget(this.player_hands[i][j].ui, 'position: absolute; top: ' + (j*this.size_i+this.offset_i) + 'px; left: '  + this.offset_j[i] + 'px; width: '  + this.scale + '%;');
            }
        }
    }

    getCard(player_num, i_card)
    {
        return this.player_hands[player_num][i_card];
    }

    getSelectedCard(player_num)
    {
        return this.player_hands[player_num][this.i_selected];
    }

    getIndexNeighbourCard(player_num, flag_get_next_card)
    {
        let i_neighbour = this.i_selected
        if (flag_get_next_card)
            i_neighbour = (i_neighbour+1) % this.nb_cards_in_hand[player_num]
        else
            i_neighbour = (i_neighbour+this.nb_cards_in_hand[player_num]-1) % this.nb_cards_in_hand[player_num]
        return i_neighbour;
    }

    // sélectionne la carte suivante ou précédente selon #flag_get_next_card, et déselectionne la carte courante sélectionnée
    selectNeighbourCard(player_num, flag_get_next_card){
        let new_i_selected = this.getIndexNeighbourCard(player_num, flag_get_next_card)
        this.unselectCard(player_num)
        this.i_selected = new_i_selected
        this.selectCard(player_num)
    }

    selectCard(player_num){
        let card = this.player_hands[player_num][this.i_selected]
        card.ui.node.style.left = this.offset_select+this.offset_j[player_num] + "px";
        this.cursor.node.style.left = this.offset_cursor[player_num]+this.offset_j[player_num] + "px";
        this.cursor.node.style.top = (this.i_selected+0.5)*this.size_i +this.offset_i + "px";
        card.ui.animate("clignoter 1.5s infinite");
    }

    unselectCard(player_num){
        let card = this.player_hands[player_num][this.i_selected]
        card.ui.node.style.left = this.offset_j[player_num] + "px";
        card.ui.animate("");
    }

    stopAnimation(player_num){
        this.player_hands[player_num][this.i_selected].ui.animate("");
    }

    removeAllWidjet(){
        for(let i = 0; i < 2; i++){
            for(let j = 0; j < this.nb_cards_in_hand[i]; j++){
                uiManager.removeWidget(this.player_hands[i][j].ui);
            }
        }
    }
}

export { UIPlayerHands };