import { eventManager } from '../../lib/core/event_manager';
import { uiManager } from '../../lib/ui/ui_manager';
import { Screen } from '../../lib/screen/screen';
import { UIMenuText } from '../../lib/ui_menu_text/ui_menu_text';
import { UIText } from '../../lib/ui_text/ui_text';
import { CoreManager } from '../../lib/core/core_manager';
import { coreManager, SizeMode } from '../../lib/core/core_manager';
import { UICardHand } from './ui/ui_card_hand';
import { Background } from './ui/ui_background';
import { UIMenu } from '../../lib/ui_menu/ui_menu';
// ---------------------------------------------------------------------------------------

class TouhouTripleTriadScreen extends Screen {
  constructor() {
    super();
    const path_card = 'samples/touhou-triple-triad/';
    
    this.background = new Background();
    uiManager.addWidget(this.background, 'position: absolute; top: -100px; left: -100px; width: 130%;');
    this.curseur = new Background();
    this.curseur.node.querySelector('.js-background').src = path_card + 'curseur.png';
    uiManager.addWidget(this.curseur, 'position: absolute; top: 240px; left: 240px; width: 2%;');
    this.card = [];
    const name = ["Alice","Patchouli","Cirno", "Reimu", "Sakuya", "Remilia", "Meiling", "Reisen"];
    const name2 = ["Mokou","Iku", "Kisume", "Kogasa", "Komachi", "Marisa", "Konngara", "Momiji"];
    let size_i = 175
    let size_j = 130
    let offset_i = 15
    let offset_j = 475
    let scale = 9
    // this.card[0] = new UICardHand();
    // this.card[0].setCharacter(name[0]);
    // uiManager.addWidget(this.card[0], 'position: absolute; top: 0px; left: 0px; width: 30%;');

    // this.card[0] = new UICardHand();
    // this.card[0].setCharacter(name[0]);
    // this.card[0].setPoints(1, 5, 8, 4);
    // this.card[0].setPlayerOwner(true);
    // uiManager.addWidget(this.card[0], 'position: absolute; top: 30px; left: 30px; width: 20%;');
    this.case = [];
    for (let i = 0; i < 4; i++) {
      this.case[i] = []
      for(let j = 0; j < 4; j++) {
        this.case[i][j] = new Background();
        this.case[i][j].node.querySelector('.js-background').src = path_card + 'plateau.png';
        this.addCard(this.case[i][j], i*size_i+offset_i, j*size_j + offset_j, scale)
      }
    }
    

    size_i = 70
    size_j = 130
    offset_i = 35
    offset_j = 30
    scale = 9
    for (let i = 0; i < 8; i++) {
      this.card[i] = new UICardHand();
      this.card[i].setCharacter(name[i]);
      this.card[i].setPoints(1, 5, 8, 4);
      this.card[i].setPlayerOwner(true);
      this.addCard(this.card[i], i*size_i+offset_i, offset_j, scale)
    }
    offset_j = 1330
    for (let i = 0; i < 8; i++) {
      this.card[i+8] = new UICardHand();
      this.card[i+8].setCharacter(name2[i]);
      this.card[i+8].setPoints(1, 5, 8, 4);
      this.card[i+8].setPlayerOwner(false);
      this.addCard(this.card[i+8], i*size_i+offset_i, offset_j, scale)
    } 
    this.placeCard(this.card[3], 2, 1);
    this.selectCard(0, 4);
  
    coreManager.setSize(1500, 730, SizeMode.FULL);
    // uiManager.addWidget(this.card[1], 'position: absolute; top: 200px; left: 30px; width: 20%;');
  }

  placeCard(c, i, j){
    let size_i = 175
    let size_j = 130
    let offset_i = 15
    let offset_j = 475
    let scale = 9

    c.node.style.left = j*size_j+offset_j + 'px'
    c.node.style.top = i*size_i+offset_i + 'px'
  }

  selectCard(numPlayer, i_cards){
    let size_i = 70
    let size_j = 130
    let offset_i = 35
    let offset_j = 60
    let scale = 9
    let offset_curseur = size_j+20
    let c = this.card[numPlayer*8+i_cards]
    if (numPlayer == 1){
      offset_j = 1300 
      offset_curseur = -40
    }
    c.node.style.left = offset_j + 'px'
    this.curseur.node.style.left = offset_j + offset_curseur + 'px' 
    this.curseur.node.style.top = (i_cards+0.5)*size_i+offset_i + 'px' 
    // c.node.style.top = i_cards*size_i+offset_i+offset_j + 'px' 
  }
  
  addCard(c, posx, posy, percent_scale){
    uiManager.addWidget(c, 'position: absolute; top: ' + posx + 'px; left: '  + posy + 'px; width: '  + percent_scale + '%;');
  }

  


  onExit() {
    uiManager.removeWidget(this.card);
  }
}

export { TouhouTripleTriadScreen };