import { AStarGraph, AStarNode } from './astar_graph';

class PathfinderGraph<T extends vec2 | vec3> {
  solve(graph: AStarGraph<T>, startNode: AStarNode<T>, endNode: AStarNode<T>) {
    const openList = new Array<AStarNode<T>>();
    const closeList = new Array<AStarNode<T>>();
    let currentNode: AStarNode<T> | null = null;

    graph.reset();
    startNode.g = 0;
    startNode.h = this.heuristic(graph, startNode, endNode);
    startNode.f = startNode.g + startNode.h;

    openList.push(startNode);
    currentNode = startNode;

    while (openList.length > 0) {
      if (currentNode == endNode) {
        break;
      }

      for (let nid of currentNode.children) {
        const childNode = graph.getNode(nid);
        if (!childNode.walkable) {
          continue;
        }

        const isInCloseList = closeList.indexOf(childNode) != -1;
        if (isInCloseList) {
          continue;
        }

        const isInOpenList = openList.indexOf(childNode) != -1;
        const g = currentNode.g + this.heuristic(graph, currentNode, childNode);

        if (isInOpenList && g < childNode.g) {
          childNode.parent = currentNode;
          childNode.g = g;
          childNode.f = childNode.g + childNode.h;
          continue;
        }

        if (!isInOpenList) {
          childNode.parent = currentNode;
          childNode.g = g;
          childNode.h = this.heuristic(graph, childNode, endNode);
          childNode.f = childNode.g + childNode.h;
          openList.push(childNode);
        }
      }

      openList.splice(openList.indexOf(currentNode), 1);
      closeList.push(currentNode);

      const openListSorted = openList.sort((a, b) => a.f - b.f);
      currentNode = openListSorted[0];
    }

    if (currentNode != endNode) {
      return [];
    }

    const path: Array<AStarNode<T>> = [];
    let node = endNode;

    while (node) {
      path.unshift(node);
      node = node.parent!;
    }

    return path;
  }

  heuristic(graph: AStarGraph<T>, nodeA: AStarNode<T>, nodeB: AStarNode<T>): number {
    return graph.getDistance(nodeA, nodeB);
  }
}

export { PathfinderGraph };