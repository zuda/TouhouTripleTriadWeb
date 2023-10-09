import { eventManager } from '../core/event_manager';
import { UIWidget } from '../ui/ui_widget';

interface JASFrame {
  x: number;
  y: number;
  width: number;
  height: number;
};

interface JASAnimation {
  name: string;
  frames: Array<JASFrame>;
  frameDuration: number;
};

/**
 * The `UISprite` is a subclass of `UIWidget` that represents a sprite with animations in the
 * user-interface system context.
 */
class UISprite extends UIWidget {
  animations: Array<JASAnimation>;
  currentAnimation: JASAnimation | null;
  currentAnimationFrameIndex: number;
  isLooped: boolean;
  timeElapsed: number;

  /**
   * The constructor.
   * @param options - An object containing optionnal className override.
   */
  constructor(options: { className?: string } = {}) {
    super({
      className: options.className ?? 'UISprite'
    });

    this.animations = [];
    this.currentAnimation = null;
    this.currentAnimationFrameIndex = 0;
    this.isLooped = false;
    this.timeElapsed = 0;
  }

  /**
   * The "update" function.
   * @param {number} ts - The `ts` parameter stands for "timestep".
   */
  update(ts: number): void {
    if (!this.currentAnimation) {
      return;
    }

    const currentFrame = this.currentAnimation.frames[this.currentAnimationFrameIndex];
    this.node.style.backgroundPositionX = -currentFrame.x + 'px';
    this.node.style.backgroundPositionY = -currentFrame.y + 'px';
    this.node.style.width = currentFrame.width + 'px';
    this.node.style.height = currentFrame.height + 'px';

    if (this.timeElapsed >= this.currentAnimation.frameDuration) {
      if (this.currentAnimationFrameIndex == this.currentAnimation.frames.length - 1) {
        eventManager.emit(this, 'E_FINISHED');
        this.currentAnimationFrameIndex = this.isLooped ? 0 : this.currentAnimation.frames.length - 1;
        this.timeElapsed = 0;
      }
      else {
        this.currentAnimationFrameIndex = this.currentAnimationFrameIndex + 1;
        this.timeElapsed = 0;
      }
    }
    else {
      this.timeElapsed += ts;
    }
  }

  /**
   * The "loadTexture" function asynchronously loads an spritesheet image file.
   * @param {string} imageFile - The `imageFile` parameter is a string that represents the file path or
   * URL of the image that you want to load as a texture.
   */
  async loadTexture(imageFile: string): Promise<void> {
    return new Promise(resolve => {
      const img = new Image();
      img.src = imageFile;
      img.onload = () => {
        this.node.style.backgroundImage = 'url("' + img.src + '")';
        resolve();
      };
    });
  }

  /**
   * The "loadFromFile" function asynchronously loads sprite data from a json file (jas).
   * @param {string} path - The `path` parameter is the file path.
   */
  async loadFromFile(path: string): Promise<void> {
    const response = await fetch(path);
    const json = await response.json();

    this.animations = [];
    for (const obj of json['Animations']) {
      const animation: JASAnimation = { name: obj['Name'], frames: [], frameDuration: parseInt(obj['FrameDuration']) };
      for (const objFrame of obj['Frames']) {
        animation.frames.push({
          x: objFrame['X'],
          y: objFrame['Y'],
          width: objFrame['Width'],
          height: objFrame['Height']
        });
      }

      this.animations.push(animation);
    }

    this.currentAnimation = null;
    this.currentAnimationFrameIndex = 0;
    this.timeElapsed = 0;
  }

  /**
   * The "play" function is used to start playing a specific animation, with options for looping and
   * preventing the same animation from being played again.
   * @param {string} animationName - The name of the animation to be played.
   * @param {boolean} [looped=false] - The `looped` parameter is a boolean that determines whether
   * the animation should loop or not.
   * @param {boolean} [preventSameAnimation=false] - The `preventSameAnimation` parameter is a boolean
   * flag that determines whether the same animation should be prevented from playing again.
   */
  play(animationName: string, isLooped: boolean = false, preventSameAnimation: boolean = false): void {
    if (preventSameAnimation && this.currentAnimation && animationName == this.currentAnimation.name) {
      return;
    }

    const animation = this.animations.find(animation => animation.name == animationName);
    if (!animation) {
      throw new Error('UISprite::play: animation not found.');
    }

    this.currentAnimation = animation;
    this.currentAnimationFrameIndex = 0;
    this.isLooped = isLooped;
    this.timeElapsed = 0;
  }

  /**
   * The "getAnimations" function returns an array of animation descriptors.
   * @returns An array of animation descriptors.
   */
  getAnimations(): Array<JASAnimation> {
    return this.animations;
  }

  /**
   * The "setAnimations" function sets the animations property.
   * @param animations - The `animations` parameter is an array of animation descriptors.
   */
  setAnimations(animations: Array<JASAnimation>): void {
    this.animations = animations;
  }

  /**
   * The "getCurrentAnimation" function returns the current animation or null if there is no current
   * animation.
   * @returns The current animation or null.
   */
  getCurrentAnimation(): JASAnimation | null {
    return this.currentAnimation;
  }

  /**
   * The "getCurrentAnimationFrameIndex" function returns the current animation frame index.
   * @returns The current animation frame index.
   */
  getCurrentAnimationFrameIndex(): number {
    return this.currentAnimationFrameIndex;
  }
}

export { UISprite };