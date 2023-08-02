enum SizeMode {
  FIT = 0, // Fit the page with scale/distortion
  ADJUST = 1, // Fit the page without distortion
  FIXED = 2, // Fixed size without scale/distortion
  FULL = 3 // Full page
};

class CoreManager {
  container: HTMLElement;
  resWidth: number;
  resHeight: number;
  sizeMode: SizeMode;

  constructor() {
    this.container = document.getElementById('APP')!;
    
    if (!this.container) {
      throw new Error('Application::Application: APP element not found !');
    }

    this.resWidth = this.container.clientWidth;
    this.resHeight = this.container.clientHeight;
    this.sizeMode = SizeMode.FIXED;
  }

  setSize(resWidth: number, resHeight: number, sizeMode = SizeMode.FIT): void {
    this.container.style.width = resWidth + 'px';
    this.container.style.height = resHeight + 'px';

    console.log('size changed', this.resWidth);

    if (this.sizeMode == SizeMode.FIT) {
      this.container.style.transform = 'scale(' + window.innerWidth / resWidth + ',' + window.innerHeight / resHeight + ')';
    }
    else if (this.sizeMode == SizeMode.ADJUST) {
      this.container.style.transform = 'scale(' + Math.min(window.innerWidth / resWidth, window.innerHeight / resHeight) + ')';
    }
    else if (this.sizeMode == SizeMode.FIXED) {
      this.container.style.transform = 'none';
      this.container.style.margin = '0 auto';
    }
    else if (this.sizeMode == SizeMode.FULL) {
      this.container.style.width = '100vw';
      this.container.style.height = '100vh';
    }

    this.resWidth = resWidth;
    this.resHeight = resHeight;
    this.sizeMode = sizeMode;
  }
}

const coreManager = new CoreManager();
export { CoreManager };
export { coreManager, SizeMode };