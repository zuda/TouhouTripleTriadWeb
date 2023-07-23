import { DNAComponent } from '../../../lib/dna/dna_component';

export class GravityComponent extends DNAComponent {
  constructor(gravityFactor = 1, collider = 0) {
    super('Gravity');
    this.gravityFactor = gravityFactor;
    this.collider = collider;
    this.onFloor = true;
  }
}