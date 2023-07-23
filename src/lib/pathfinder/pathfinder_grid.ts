import { AStarGrid } from './astar_grid';

interface Visited<T> {
  pos: T;
  origin: T | null;
};

class PathfinderGrid<T extends vec2 | vec3> {
  solve(grid: AStarGrid<T>, startCoord: T, endCoord: T): Array<T> | null {
    const visitedMap = new Map<string, Visited<T>>();
    const frontierCoordList: Array<T> = [];
    let find = false;

    frontierCoordList.push(startCoord);
    visitedMap.set(startCoord.join(';'), { pos: startCoord, origin: null });

    while (!find) {
      const frontierCoord = frontierCoordList.shift();
      if (!frontierCoord) {
        return null;
      }

      const dirs = this.heuristic(grid, frontierCoord, endCoord);

      for (const dir of dirs) {
        const nextCoord = dir.map((value, idx) => frontierCoord[idx] + value) as T;
        const strNextCoord = nextCoord.join(';');

        if (!grid.isInside(nextCoord) || grid.getValue(nextCoord) == 1 || visitedMap.get(strNextCoord)) {
          continue;
        }

        frontierCoordList.push(nextCoord);
        visitedMap.set(strNextCoord, { pos: nextCoord, origin: frontierCoord });

        if (grid.isSame(nextCoord, endCoord)) {
          find = true;
          break;
        }
      }
    }

    const path: Array<T> = [];
    let visited = visitedMap.get(endCoord.join(';'));

    while (visited) {
      path.unshift(visited.pos);
      visited = visitedMap.get(visited.origin ? visited.origin.join(';') : '');
    }

    return path;
  }

  heuristic(grid: AStarGrid<T>, a: T, b: T): Array<T> {
    return grid.getDirections(a, b);
  }
}

export { PathfinderGrid };