import { UIWidget } from '../../../lib/ui/ui_widget';
// ---------------------------------------------------------------------------------------
const path_card = 'samples/touhou-triple-triad/';
class Background extends UIWidget {
    constructor() {
        super({
          className: 'UIBackgroundTTT',
          template: `
          <img class="UIBackgroundTTT-picture js-background"/>
          `
        });
        this.node.querySelector('.js-background').src = path_card + 'background.png';
      }
    
}
export { Background };