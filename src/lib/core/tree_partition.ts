export type SplitResult<T> = {
  left: Array<T>,
  right: Array<T>,
  leftMethod: ITreePartitionMethod<T>,
  rightMethod: ITreePartitionMethod<T>,
}

export interface ITreePartitionMethod<T> {
  split(objects: Array<T>): SplitResult<T>;
  search(node: TreePartitionNode<T>, ...params: any[]): Array<T>;
}

class TreePartition<T> {
  maxChildren: number;
  maxDepth: number;
  root: TreePartitionNode<T>;

  constructor(maxChildren: number, maxDepth: number, method: ITreePartitionMethod<T>) {
    this.maxChildren = maxChildren;
    this.maxDepth = maxDepth;
    this.root = new TreePartitionNode<T>(this, 0, method);
  }

  addChild(object: T): void {
    this.root.addChild(object);
  }

  getMaxChildren(): number {
    return this.maxChildren;
  }

  getMaxDepth(): number {
    return this.maxDepth;
  }
}

class TreePartitionNode<T> {
  tree: TreePartition<T>;
  depth: number;
  method: ITreePartitionMethod<T>;
  parent: TreePartitionNode<T> | null = null;
  left: TreePartitionNode<T> | null = null;
  right: TreePartitionNode<T> | null = null;
  children: Array<T> = [];

  constructor(tree: TreePartition<T>, depth: number, method: ITreePartitionMethod<T>) {
    this.reset();
    this.tree = tree;
    this.depth = depth;
    this.method = method;
  }

  search(...params: any[]): Array<T> {
    return this.method.search(this, ...params);
  }

  reset(): void {
    this.children = [];
    this.left = null;
    this.right = null;
  }

  createSubNodes(): void {
    const results = this.method.split(this.children);

    this.left = new TreePartitionNode(
      this.tree,
      this.depth + 1,
      results.leftMethod
    );

    this.right = new TreePartitionNode(
      this.tree,
      this.depth + 1,
      results.rightMethod
    );

    results.left.forEach(this.left.addChild.bind(this.left));
    results.right.forEach(this.right.addChild.bind(this.right));
    this.left.parent = this;
    this.right.parent = this;
    this.children = [];
  }

  getChildren(): Array<T> {
    return this.children;
  }

  addChild(object: T): void {
    if (this.children.length >= this.tree.getMaxChildren() && this.depth < this.tree.getMaxDepth()) {
      this.createSubNodes();
    }

    if (this.left === null && this.right === null) {
      this.children.push(object);
    }
    else {
      const results = this.method.split([object]);
      if (this.left && results.left.length > 0) {
        this.left.addChild(results.left[0]);
      }

      if (this.right && results.right.length > 0) {
        this.right.addChild(results.right[0]);
      }
    }
  }

  getMethod(): ITreePartitionMethod<T> {
    return this.method;
  }

  getLeft(): TreePartitionNode<T> | null {
    return this.left;
  }

  getRight(): TreePartitionNode<T> | null {
    return this.right;
  }

  getDepth(): number {
    return this.depth;
  }

  setDepth(depth: number): void {
    this.depth = depth;
  }
}

export { TreePartition, TreePartitionNode };