import { UIWidget } from '../../../lib/ui/ui_widget';
// ---------------------------------------------------------------------------------------
const path_card = 'samples/touhou-triple-triad/';
class UIWall extends UIWidget {
    constructor(flag_vertical) {
      super({
        className: 'UIWall',
        template: `
        <img class="UIWall-picture js-wall"/>
        `
      });
      if(flag_vertical)
        this.node.querySelector('.js-wall').src = path_card + 'wall_vertical.png';
      else
        this.node.querySelector('.js-wall').src = path_card + 'wall_horizontal.png';
    }
    
}
export { UIWall };