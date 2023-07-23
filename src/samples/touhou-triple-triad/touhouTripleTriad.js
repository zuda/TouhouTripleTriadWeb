import { eventManager } from '../../lib/core/event_manager';
import { uiManager } from '../../lib/ui/ui_manager';
import { Screen } from '../../lib/screen/screen';
import { UIMenuText } from '../../lib/ui_menu_text/ui_menu_text';
import { UIText } from '../../lib/ui_text/ui_text';
import { UICardHand } from './ui/ui_card_hand';
// ---------------------------------------------------------------------------------------

class TouhouTripleTriadScreen extends Screen {
  constructor() {
    super();
    this.card = [];
    const name = ["Alice","Patchouli","Cirno", "Reimu", "Sakuya", "Remilia", "Meiling", "Reisen"];
    const name2 = ["Mokou","Iku", "Kisume", "Kogasa", "Komachi", "Marisa", "Konngara", "Momiji"];
    // this.card[0] = new UICardHand();
    // this.card[0].setCharacter(name[0]);
    // this.card[0].setPoints(1, 5, 8, 4);
    // this.card[0].setPlayerOwner(true);
    // uiManager.addWidget(this.card[0], 'position: absolute; top: 30px; left: 30px; width: 20%;');
    for (let i = 0; i < 8; i++) {
      this.card[i] = new UICardHand();
      this.card[i].setCharacter(name[i]);
      this.card[i].setPoints(1, 5, 8, 4);
      this.card[i].setPlayerOwner(true);
      this.addCard(this.card[i], i*70, 30, 5)
    }
    for (let i = 0; i < 8; i++) {
      this.card[i+8] = new UICardHand();
      this.card[i+8].setCharacter(name2[i]);
      this.card[i+8].setPoints(1, 5, 8, 4);
      this.card[i+8].setPlayerOwner(false);
      this.addCard(this.card[i+8], i*70, 450, 20)
    } 
    
    
    // uiManager.addWidget(this.card[1], 'position: absolute; top: 200px; left: 30px; width: 20%;');
  }
  
  addCard(c, posx, posy, percent_scale){
    uiManager.addWidget(c, 'position: absolute; top: ' + posx + 'px; left: '  + posy + 'px; width: '  + percent_scale + '%;');
  }
  // async onEnter() {
  //   uiManager.addWidget(this.card[0], 'position: absolute; top: 30px; left: 30px; width: 15%;');
  //   uiManager.addWidget(this.card[1], 'position: absolute; top: 200px; left: 30px; width: 15%;');

  // }

  onExit() {
    uiManager.removeWidget(this.card);
  }
}

export { TouhouTripleTriadScreen };