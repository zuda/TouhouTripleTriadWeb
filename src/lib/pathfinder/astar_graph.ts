import { UT } from '../core/utils';

export interface AStarNode<T> {
  pos: T;
  walkable: boolean;
  children: Array<string>;
  parent?: AStarNode<T> | null;
  data?: Object | null;
  g: number;
  h: number;
  f: number;
};

abstract class AStarGraph<T> {  
  nodes: Map<string, AStarNode<T>>;

  constructor(nodes = new Map<string, AStarNode<T>>()) {
    this.nodes = nodes;
  }

  abstract getDistance(a: AStarNode<T>, b: AStarNode<T>): number;

  async loadFromFile(path: string): Promise<void> {
    const response = await fetch(path);
    const json = await response.json();

    if (!json.hasOwnProperty('Ident') || json['Ident'] != 'ASTAR_GRAPH') {
      throw new Error('AStarGraph<T>::loadFromFile(): File not valid !');
    }

    this.nodes.clear();

    for (const nid in json) {
      this.nodes.set(nid, {
        pos: json[nid]['Pos'],
        walkable: json[nid]['Walkable'],
        children: json[nid]['Children'],
        g: 0,
        h: 0,
        f: 0
      });
    }
  }

  getNode(nid: string): AStarNode<T> {
    const node = this.nodes.get(nid);
    if (!node) {
      throw new Error('AStarGraph::getNode(): Node not exist !');
    }

    return node;
  }

  addNode(nid: string, node: AStarNode<T>, biRelations: boolean = true, autoRelations: boolean = false, radius: number = 1): void {
    const found = this.nodes.get(nid);
    if (found) {
      throw new Error('AStarGraph::addNode(): Node already exist !');
    }

    this.nodes.set(nid, node);

    if (autoRelations) {
      for (const [nid, n] of this.nodes.entries()) {
        if (this.getDistance(n, node) <= radius) {
          node.children.push(nid);
        }
      }
    }

    if (biRelations) {
      for (const cnid of node.children) {
        const childNode = this.nodes.get(cnid);
        if (childNode) {
          childNode.children.push(nid);
        }
      }
    }
  }

  removeNode(nid: string): void {
    const node = this.nodes.get(nid);
    if (!node) {
      throw new Error('AStarGraph::removeNode(): Node not found !');
    }

    this.nodes.delete(nid);

    for (const cnid of node.children) {
      const childNode = this.nodes.get(cnid);
      if (!childNode) {
        continue;
      }

      const index = childNode.children.indexOf(nid);
      if (index != -1) {
        childNode.children.splice(index, 1);
      }
    }
  }

  setNodeProperties(nid: string, properties: Partial<AStarNode<T>>): void {
    const node = this.nodes.get(nid);
    if (!node) {
      throw new Error('AStarGraph::setNodeProperties(): Node not found !');
    }

    Object.assign(node, properties);
  }

  removeNodeRelation(nid: string, cnid: string): void {
    const node = this.nodes.get(nid);
    if (!node) {
      throw new Error('AStarGraph::removeNodeRelation(): Node not found !');
    }

    const index = node.children.indexOf(cnid);
    if (index == -1) {
      throw new Error('AStarGraph::removeNodeRelation(): Node children not found !');
    }

    node.children.splice(index, 1);
  }

  findNode(predicateFn: Function): AStarNode<T> | null {
    for (const value of this.nodes.values()) {
      if (predicateFn(value)) {
        return value;
      }
    }

    return null;
  }

  reset(): void {
    for (const node of this.nodes.values()) {
      node.g = 0;
      node.h = 0;
      node.f = 0;
    }
  }
}

class AStarGraph2D extends AStarGraph<vec2> {
  constructor() {
    super();
  }

  getDistance(a: AStarNode<vec2>, b: AStarNode<vec2>): number {
    return UT.VEC2_DISTANCE(a.pos, b.pos);
  }
}

class AStarGraph3D extends AStarGraph<vec3> {
  constructor() {
    super();
  }

  getDistance(a: AStarNode<vec3>, b: AStarNode<vec3>): number {
    return UT.VEC3_DISTANCE(a.pos, b.pos);
  }
}

export { AStarGraph, AStarGraph2D, AStarGraph3D };