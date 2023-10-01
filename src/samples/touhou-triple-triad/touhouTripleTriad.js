import { eventManager } from '../../lib/core/event_manager';
import { uiManager } from '../../lib/ui/ui_manager';
import { Screen } from '../../lib/screen/screen';
import { coreManager, SizeMode } from '../../lib/core/core_manager';
import { Background } from './ui/ui_background';
import { inputManager, InputManager } from '../../lib/input/input_manager';
// ---------------------------------------------------------------------------------------
import { UIPlayerHands } from './ui/ui_player_hand';
import { Card } from './core/card';
import { Direction } from './core/type.ts';
import { UIDamier } from './ui/ui_damier';
import { GameState, SIZE_HAND } from './core/gameState';
import { UICardHand } from './ui/ui_card_hand';

const path_card = 'samples/touhou-triple-triad/';

const FocusMode = {
    Damier : 0,
    Player : 1
}

const key_to_dir_dict = {
    "LEFT": Direction.W,
    "UP": Direction.N,
    "RIGHT": Direction.E,
    "DOWN": Direction.S
};

class TouhouTripleTriadScreen extends Screen 
{
    constructor() {
        super();    
    }

    async onEnter()
    {
        this.gameState = new GameState();
        this.background = new Background();
        uiManager.addWidget(this.background, 'position: absolute; top: -100px; left: -100px; width: 130%;');

        this.curseur = new Background();
        this.curseur.node.querySelector('.js-background').src = path_card + 'curseur.png';
        this.players_hand = new UIPlayerHands(this.curseur);

        this.player_turn = 0;
        this.FocusMode = FocusMode.Player;

        eventManager.subscribe(inputManager, 'E_ACTION', this, this.onAction);
        this.background.focus();

        this.damier = new UIDamier(this.curseur);
        this.initPlayersHand();
        uiManager.addWidget(this.curseur, 'position: absolute; top: 240px; left: 240px; width: 2%;');
        this.players_hand.selectCard(this.player_turn)
        coreManager.setSize(1500, 730, SizeMode.FULL);
    }


    initPlayersHand(){
        const player_cards_name = [["Alice","Patchouli","Cirno", "Reimu", "Sakuya", "Remilia", "Meiling", "Reisen"], ["Mokou","Iku", "Kisume", "Kogasa", "Komachi", "Marisa", "Konngara", "Momiji"]];
        const valData = [[10,4,5,8], [8,1,10,9], [4,3,8,4], [9,3,2,5]];
    
        for(let i = 0; i < 2; i++){
            for(let j = 0; j < SIZE_HAND; j++){
                let card = new Card()
                card.setPoints(Math.floor(Math.random() * 10  + 1), Math.floor(Math.random() * 10  + 1), Math.floor(Math.random() * 10  + 1), Math.floor(Math.random() * 10  + 1));
                // card.setPoints(valData[(i*8+j)%4][0], valData[(i*8+j)%4][1], valData[(i*8+j)%4][2], valData[(i*8+j)%4][3])
                card.setCharacterName(player_cards_name[i][j])
                if( i==1 )
                    card.flipPlayerOwner()
                this.gameState.setHandCard(i, card, j)       
                let ui_card = new UICardHand();
                ui_card.setFromCard(card)
                this.players_hand.addCard(i, ui_card)
            }
        }
        this.players_hand.addAllWidjetCards()
    }
 
    // addCard(c, posx, posy, percent_scale){
    //     uiManager.addWidget(c, 'position: absolute; top: ' + posx + 'px; left: '  + posy + 'px; width: '  + percent_scale + '%;');
    // }

    onAction(actionId){       
        actionId = actionId.actionId;
        if(this.FocusMode == FocusMode.Player){   
            switch(actionId){ 
                case "UP":
                case "DOWN":
                    this.players_hand.selectNeighbourCard(this.player_turn, actionId=="DOWN");
                    break;
                case "OK":
                    this.damier.selectFirstEmptyCase()
                    this.players_hand.stopAnimation(this.player_turn)
                    this.FocusMode = FocusMode.Damier;
                    break;
                default:
                    break;
            }  
        }
        else if(this.FocusMode == FocusMode.Damier){   
            switch(actionId){ 
                case "UP":
                case "RIGHT":
                case "DOWN":
                case "LEFT":
                    this.damier.moveSelectedCase(key_to_dir_dict[actionId])
                    break;
                case "OK":
                    if (this.damier.selectedCaseIsEmpty()){
                        let coordinate = this.damier.getSelectedCoordinate()
                        this.damier.setCardInSelectedCase(this.players_hand.getSelectedCard(this.player_turn))
                        this.gameState.placeHandCardOnBoard(this.player_turn, this.players_hand.get_i_selected(), coordinate[0],coordinate[1])
                        this.gameState.removeCardAndRearrangeHand(this.player_turn, this.players_hand.get_i_selected())
                        this.players_hand.removeCurCardAndRearrangeHand(this.player_turn)
                        
                        let coord_cardToUpdate = this.gameState.performBattle(coordinate[0],coordinate[1]);
                        for (let i = 0; i<coord_cardToUpdate.length; i+=1){
                            let coord = coord_cardToUpdate[i]
                            let cardToUpdate = this.damier.getUICard(coord[0], coord[1]);
                            // console.log("name charaloss : " + this.gameState.getCardFromBoard(coord[0], coord[1]).name)
                            cardToUpdate.setFromCard(this.gameState.getCardFromBoard(coord[0], coord[1]))
                            // console.log("owner " +  this.gameState.getCardFromBoard(coord[0], coord[1]).flag_belongToPlayer1)
                        }  
                        
                        if(this.damier.isFull()){
                            console.log("victory");
                        }
                        else{
                            this.player_turn = (this.player_turn+1)%2
                            this.FocusMode = FocusMode.Player;
                            this.players_hand.set_i_selected(0);
                            this.players_hand.selectCard(this.player_turn)
                        }
                        // console.log("name chara pose : " + this.gameState.getCardFromBoard(coordinate[0], coordinate[1]).name)
                    }
                    break;
                case "BACK":
                    this.FocusMode = FocusMode.Player
                    this.players_hand.selectCard(this.player_turn)
                    this.damier.unselectCurrentCase()
                default:
                    break;
            }  
        }
    }

    onExit(){
        uiManager.removeWidget(this.background);
        uiManager.removeWidget(this.curseur);
        this.players_hand.removeAllWidjet();
        this.damier.removeAllWidjet()
        for(let i = 0; i < SIZE_HAND; i++)
            uiManager.removeWidget(this.player1_hand.getCard(i));
        for(let i = 0; i < SIZE_HAND; i++)
            uiManager.removeWidget(this.player2_hand.getCard(i));
    }
}

export { TouhouTripleTriadScreen };