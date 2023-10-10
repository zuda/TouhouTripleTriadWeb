import { UIWidget } from '../../lib/ui/ui_widget';

class UICardMenuItem extends UIWidget {
  name: string;
  quantity: number;

  constructor(name: string, quantity: number) {
    super({
      className: 'UICardMenuItem',
      template: `
        <div class="UICardMenuItem-name js-name">${name}</div>
        <div class="UICardMenuItem-quantity js-quantity">${quantity}</div>`
    });

    this.name = name;
    this.quantity = quantity;
  }

  increaseQuantity(): void {
    this.quantity++;
    this.node.querySelector<HTMLElement>('.js-quantity')!.textContent = this.quantity.toString();
  }

  decreaseQuantity(): void {
    this.quantity--;
    this.node.querySelector<HTMLElement>('.js-quantity')!.textContent = this.quantity.toString();
  }

  flashAdded(): void {
    this.node.classList.remove('u-added');
    this.node.offsetWidth;
    this.node.classList.add('u-added');
  }

  flashRemoved(): void {
    this.node.classList.remove('u-removed');
    this.node.offsetWidth;
    this.node.classList.add('u-removed');
  }

  setAdded(added: boolean): void {
    this.node.classList.toggle('u-added', added);
  }

  setName(name: string): void {
    this.node.querySelector<HTMLElement>('.js-name')!.textContent = name;
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  setQuantity(quantity: number): void {
    this.node.querySelector<HTMLElement>('.js-quantity')!.textContent = quantity.toString();
    this.quantity = quantity;
  }

  getQuantity(): number {
    return this.quantity;
  }
}

export { UICardMenuItem };