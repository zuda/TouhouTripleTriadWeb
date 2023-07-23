import { TreePartition, TreePartitionNode, ITreePartitionMethod, SplitResult } from '../core/tree_partition';
import { Gfx3BoundingBox } from './gfx3_bounding_box';

class Gfx3TreePartition extends TreePartition<Gfx3BoundingBox> {
  constructor(maxChildren: number, maxDepth: number, aabb: Gfx3BoundingBox = new Gfx3BoundingBox([0, 0, 0], [0, 0, 0])) {
    super(maxChildren, maxDepth, new Gfx3TreePartitionMethod(aabb, 'x'));
  }
}

class Gfx3TreePartitionMethod implements ITreePartitionMethod<Gfx3BoundingBox> {
  box: Gfx3BoundingBox;
  axis: 'x' | 'y' | 'z';

  constructor(box: Gfx3BoundingBox, axis: 'x' | 'y' | 'z') {
    this.box = box;
    this.axis = axis;
  }

  search(node: TreePartitionNode<Gfx3BoundingBox>, target: Gfx3BoundingBox, results: Array<Gfx3BoundingBox> = []): Array<Gfx3BoundingBox> {
    const method = node.getMethod() as Gfx3TreePartitionMethod;
    const nodeBox = method.box;
    if (!nodeBox.intersectBoundingBox(target)) {
      return [];
    }

    const left = node.getLeft();
    const right = node.getRight();

    if (left && right) {
      left.search(target, results)
      right.search(target, results)
    }
    else {
      const children = node.getChildren();
      for (let i = 0; i < children.length; i++) {
        if (children[i].intersectBoundingBox(target)) {
          results.push(children[i]);
        }
      }
    }

    return results;
  }

  split(objects: Array<Gfx3BoundingBox>): SplitResult<Gfx3BoundingBox> {
    const left = [];
    const right = [];
    const center = this.box.getCenter();

    for (const object of objects) {
      if (this.axis === 'x') {
        if (object.min[0] >= center[0]) {
          right.push(object);
        }
        else {
          left.push(object);
        }
      }
      else if (this.axis === 'y') {
        if (object.min[1] >= center[1]) {
          right.push(object);
        }
        else {
          left.push(object);
        }
      }
      else {
        if (object.min[2] >= center[2]) {
          right.push(object);
        }
        else {
          left.push(object);
        }
      }
    }

    let boxes: Array<Gfx3BoundingBox> = [];
    let newAxis: 'x' | 'y' | 'z' = 'x';

    if (this.axis === 'x') {
      boxes = SPLIT_VERTICAL(this.box);
      newAxis = 'y';
    }
    else if (this.axis === 'y') {
      boxes = SPLIT_HORIZONTAL(this.box);
      newAxis = 'z';
    }
    else {
      boxes = SPLIT_DEPTH(this.box);
      newAxis = 'x';
    }

    const leftMethod = new Gfx3TreePartitionMethod(boxes[0], newAxis);
    const rightMethod = new Gfx3TreePartitionMethod(boxes[1], newAxis);

    return { left, right, leftMethod, rightMethod };
  }
}

export { Gfx3TreePartition };

// -------------------------------------------------------------------------------------------
// HELPFUL
// -------------------------------------------------------------------------------------------

function SPLIT_VERTICAL(aabb: Gfx3BoundingBox): Array<Gfx3BoundingBox> {
  const size = aabb.getSize();
  const center = aabb.getCenter();

  return [
    Gfx3BoundingBox.createFromCoord(aabb.min[0], aabb.min[1], aabb.min[2], size[0] * 0.5, size[1], size[2]),
    Gfx3BoundingBox.createFromCoord(center[0], aabb.min[1], aabb.min[2], size[0] * 0.5, size[1], size[2])
  ];
}

function SPLIT_HORIZONTAL(aabb: Gfx3BoundingBox): Array<Gfx3BoundingBox> {
  const size = aabb.getSize();
  const center = aabb.getCenter();

  return [
    Gfx3BoundingBox.createFromCoord(aabb.min[0], aabb.min[1], aabb.min[2], size[0], size[1] * 0.5, size[2]),
    Gfx3BoundingBox.createFromCoord(aabb.min[0], center[1], aabb.min[2], size[0], size[1] * 0.5, size[2])
  ];
}

function SPLIT_DEPTH(aabb: Gfx3BoundingBox): Array<Gfx3BoundingBox> {
  const size = aabb.getSize();
  const center = aabb.getCenter();

  return [
    Gfx3BoundingBox.createFromCoord(aabb.min[0], aabb.min[1], aabb.min[2], size[0], size[1], size[2] * 0.5),
    Gfx3BoundingBox.createFromCoord(aabb.min[0], aabb.min[1], center[2], size[0], size[1], size[2] * 0.5)
  ];
}