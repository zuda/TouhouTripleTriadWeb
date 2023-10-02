import { UIWidget } from '../../../lib/ui/ui_widget';
// ---------------------------------------------------------------------------------------
const path_card = 'samples/touhou-triple-triad/';
class UIScore extends UIWidget {
    constructor() {
      super({
        className: 'UIScore',
        template: `
        <div class="UIScore-points">
        <div class="UIScore-points-p1 js-p1"></div>
        <div class="UIScore-points-p2 js-p2"></div>
        </div>)
        `
      });
      this.node.querySelector('.js-p1').textContent = "8";
      this.node.querySelector('.js-p2').textContent = "8";
    }


    setScore(score_p1) {
      this.node.querySelector('.js-p1').textContent = score_p1.toString();
      this.node.querySelector('.js-p2').textContent = (16-score_p1).toString();
  }
    
}
export { UIScore };