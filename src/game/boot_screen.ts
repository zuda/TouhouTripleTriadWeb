// import { eventManager } from '../../../lib/core/event_manager';
// import { uiManager } from '../../../lib/ui/ui_manager';
// import { screenManager } from '../../../lib/screen/screen_manager';
// import { Screen } from '../../../lib/screen/screen';
// import { UIMenuText } from '../../../lib/ui_menu_text/ui_menu_text';
// // ---------------------------------------------------------------------------------------
// import { TouhouTripleTriadScreen } from '../touhouTripleTriad';

// class BootScreen extends Screen {
//   constructor() {
//     super();
//     this.menu = new UIMenuText();
//   }

//   async onEnter() {
//     this.menu.add('0', 'Nouvelle partie');

//     uiManager.addWidget(this.menu, 'position:absolute; top:50%; left:50%; width:60%; transform:translate(-50%,-50%);');
//     eventManager.subscribe(this.menu, 'E_ITEM_SELECTED', this, this.handleMenuItemSelected);
//     uiManager.focus(this.menu);
//   }

//   handleMenuItemSelected(data) {
//     switch (data.id) {
//       case "0":
//         screenManager.requestSetScreen(new TouhouTripleTriadScreen());
//         break;

//       case "1":
//         break;
//     }
//   }

//   onExit() {
//     uiManager.removeWidget(this.menu);
//   }


// }

// export { BootScreen };