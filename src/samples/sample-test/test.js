import { eventManager } from '../../lib/core/event_manager';
import { uiManager } from '../../lib/ui/ui_manager';
import { screenManager } from '../../lib/screen/screen_manager';
import { Screen } from '../../lib/screen/screen';
import { UIMenuText } from '../../lib/ui_menu_text/ui_menu_text';
// ---------------------------------------------------------------------------------------

class TestScreen extends Screen 
{
    constructor()
    {
        super();
        this.uiMenu = new UIMenuText();
    }

    async onEnter()
    {
        this.uiMenu.add("0", "New Game");
        this.uiMenu.add("1", "Continue");
        this.uiMenu.add("2", "Quit");
        this.uiMenu.add("3", "Quit");

        uiManager.addWidget(this.uiMenu, 'position:absolute; top:50%; left:50%; width:60%; transform:translate(-50%,-50%);');
        uiManager.focus(this.uiMenu);
    }

    async onExit()
    {
        uiManager.removeWidget(this.uiMenu);
    }
}

export { TestScreen };