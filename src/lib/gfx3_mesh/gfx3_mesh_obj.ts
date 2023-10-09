import { Gfx3Material } from './gfx3_mesh_material';
import { gfx3TextureManager } from '../gfx3/gfx3_texture_manager';
import { Gfx3Mesh, Group } from './gfx3_mesh';
import { Gfx3BoundingBox } from '../gfx3/gfx3_bounding_box';

class OBJObject {
  name: string;
  coords: Array<number>;
  colors: Array<number>;
  texcoords: Array<number>;
  normals: Array<number>;
  lines: Array<number>;
  groups: Array<Group>;
  materialName: string;
  vertexCount: number;

  constructor() {
    this.name = '';
    this.coords = new Array<number>();
    this.colors = new Array<number>();
    this.texcoords = new Array<number>();
    this.normals = new Array<number>();
    this.lines = new Array<number>();
    this.groups = new Array<Group>();
    this.materialName = '';
    this.vertexCount = 0;
  }
}

/**
 * The `Gfx3MeshOBJ` class is a subclass of Gfx3Mesh that represents a 3D mesh object loaded from an OBJ wavefront file.
 *
 * OBJ Options:
 * - Multiple meshes.
 * - Optionnal Vertex Normals
 * - Optionnal Vertex Colors
 * - Smooth Groups
 *
 * MTL Options:
 * - Kd => Diffuse
 * - Ks => Specular
 * - Ns => Specularity
 * - Ke => Emissive
 * - d  => Opacity
 * - map_Kd => Albedo map
 * - map_Ns => Specularity map
 * - map_Bump => Normal map
 */
class Gfx3MeshOBJ extends Gfx3Mesh {
  coords: Array<number>;
  colors: Array<number>;
  texcoords: Array<number>;
  normals: Array<number>;
  objects: Map<string, OBJObject>;
  materials: Map<string, Gfx3Material>;
  meshes: Map<string, Gfx3Mesh>;

  /**
   * The constructor.
   */
  constructor() {
    super();
    this.coords = new Array<number>();
    this.colors = new Array<number>();
    this.texcoords = new Array<number>();
    this.normals = new Array<number>();
    this.objects = new Map<string, OBJObject>();
    this.materials = new Map<string, Gfx3Material>();
    this.meshes = new Map<string, Gfx3Mesh>();
  }

  /**
   * The "delete" function free all resources.
   * Warning: you need to call this method to free allocation for this object.
   */
  delete() {
    for (const mesh of this.meshes.values()) {
      mesh.delete(true);
    }

    for (const material of this.materials.values()) {
      material.delete();
    }

    super.delete();
  }

  /**
   * The "update" function.
   * @param {number} ts - The `ts` parameter stands for "timestep".
   */
  update(ts: number): void {
    for (const mesh of this.meshes.values()) {
      mesh.update(ts);
    }
  }

  /**
   * The "draw" function.
   */
  draw(): void {
    for (const mesh of this.meshes.values()) {
      mesh.draw();
    }
  }

  /**
   * The "loadFromFile" function asynchronously loads `obj` and `mtl` files.
   * @param {string} objPath - The `obj` file path.
   * @param {string} mtlPath - The `mtl` file path.
   */
  async loadFromFile(objPath: string, mtlPath: string) {
    await this.$loadMaterials(mtlPath);
    await this.$loadObjects(objPath);
  }

  /**
   * The "getVertexCount" function override `getVertexCount` from `Gfx3Mesh`.
   */
  getVertexCount(): number {
    let vertexCount = 0;
    for (const mesh of this.meshes.values()) {
      vertexCount += mesh.getVertexCount();
    }

    return vertexCount;
  }

  /**
   * The "getVertices" function override `getVertices` from `Gfx3Mesh`.
   */
  getVertices(): Array<number> {
    let vertices = new Array<number>();
    for (const mesh of this.meshes.values()) {
      vertices.concat(mesh.getVertices());
    }

    return vertices;
  }

  /**
   * The "getMesh" function returns a `Gfx3Mesh` object with the specified name, or throws an error if
   * the object doesn't exist.
   * @param {string} name - A string representing the name of the mesh object that you want to retrieve.
   * @returns The mesh.
   */
  getMesh(name: string): Gfx3Mesh {
    if (!this.meshes.has(name)) {
      throw new Error('Gfx3MeshOBJ::getMesh(): The mesh object doesn\'t exist !');
    }

    return this.meshes.get(name)!;
  }

  /**
   * The "getMeshes" function returns all `Gfx3Mesh` objects.
   * @returns An iterable of Gfx3Mesh objects.
   */
  getMeshes(): IterableIterator<Gfx3Mesh> {
    return this.meshes.values();
  }

  /**
   * The "getObject" function returns a `OBJObject` object with the specified name, or throws an error if
   * the object doesn't exist.
   * @param {string} name - A string representing the name of the object that you want to retrieve.
   * @returns The object data.
   */
  getObject(name: string): OBJObject {
    if (!this.objects.has(name)) {
      throw new Error('Gfx3MeshOBJ::getObject(): The object doesn\'t exist !');
    }

    return this.objects.get(name)!;
  }

  /**
   * The "getBoundingBox" function returns the bounding box.
   * @returns The bounding box.
   */
  getBoundingBox(): Gfx3BoundingBox {
    const boxes = new Array<Gfx3BoundingBox>();

    for (const mesh of this.meshes.values()) {
      boxes.push(mesh.getBoundingBox());
    }
  
    return Gfx3BoundingBox.merge(boxes);
  }

  /**
   * The "getWorldBoundingBox" function returns the world bounding box.
   * @returns The world bounding box.
   */
  getWorldBoundingBox(): Gfx3BoundingBox {
    const boxes = new Array<Gfx3BoundingBox>();

    for (const mesh of this.meshes.values()) {
      boxes.push(mesh.getWorldBoundingBox());
    }
  
    return Gfx3BoundingBox.merge(boxes);
  }

  /**
   * The "$loadMaterials" function asynchronously loads materials from a specified file (mtl).
   * @param {string} path - The `path` parameter is the `mtl` file path.
   */
  async $loadMaterials(path: string) {
    const response = await fetch(path);
    const text = await response.text();
    const lines = text.split('\n');

    this.materials.clear();

    let curMat = null;
    let curMatName = null;
    path = path.split('/').slice(0, -1).join('/') + '/';

    for (const line of lines) {
      if (line.startsWith('newmtl ')) {
        curMatName = line.substring(7);
        curMat = new Gfx3Material({ lightning: true });
        this.materials.set(curMatName, curMat);
      }

      if (!curMat) {
        continue;
      }

      if (line.startsWith('Kd ')) {
        const d = line.substring(3).split(' ');
        const r = parseFloat(d[0]);
        const g = parseFloat(d[1]);
        const b = parseFloat(d[2]);
        curMat.setDiffuse(r, g, b);
      }

      if (line.startsWith('Ks ')) {
        const s = line.substring(3).split(' ');
        const r = parseFloat(s[0]);
        const g = parseFloat(s[1]);
        const b = parseFloat(s[2]);
        curMat.setSpecular(r, g, b);
      }

      if (line.startsWith('Ns ')) {
        const s = parseFloat(line.substring(3));
        curMat.setSpecularity(s);
      }

      if (line.startsWith('d')) {
        const s = parseFloat(line.substring(1));
        curMat.setOpacity(s);
      }

      if (line.startsWith('Ke ')) {
        const e = line.substring(3).split(' ');
        const r = parseFloat(e[0]);
        const g = parseFloat(e[1]);
        const b = parseFloat(e[2]);
        curMat.setEmissive(r, g, b);
      }

      if (line.startsWith('map_Kd ')) {
        const infos = line.substring(7);
        curMat.setTexture(await gfx3TextureManager.loadTexture(path + infos));
      }

      if (line.startsWith('map_Ns ')) {
        const infos = line.substring(7);
        curMat.setSpecularityMap(await gfx3TextureManager.loadTexture8bit(path + infos));
      }

      if (line.startsWith('map_Bump ')) {
        const infos = line.split(' ');
        let i = 0;

        while (infos[i][0] == '-') {
          const flag = infos[i].substring(1);
          if (flag == 'bm') {
            curMat.setNormalIntensity(parseFloat(infos[i + 1]));
          }

          i++;
        }

        const url = infos.join(' ');
        curMat.setNormalMap(await gfx3TextureManager.loadTexture(path + url));
      }
    }
  }

  /**
   * The "$loadObjects" function asynchronously loads objects from a specified file (obj).
   * @param {string} path - The `path` parameter is the `obj` file path.
   */
  async $loadObjects(path: string): Promise<void> {
    const response = await fetch(path);
    const text = await response.text();
    const lines = text.split('\n');

    this.objects.clear();

    let currentObject = new OBJObject();
    let currentGroup: Group = { id: 0, indices: [], vertexCount: 0, smooth: false };

    for (const line of lines) {
      if (line.startsWith('o ')) {
        const object = new OBJObject();
        object.name = line.substring(2);
        currentObject = object;
        this.objects.set(object.name, object);
      }

      if (line.startsWith('usemtl ')) {
        currentObject.materialName = line.substring(7);
      }

      if (line.startsWith('v ')) {
        const v = line.substring(2).split(' ');
        const x = parseFloat(v[0]);
        const y = parseFloat(v[1]);
        const z = parseFloat(v[2]);
        this.coords.push(x, y, z);
        currentObject.coords.push(x, y, z);

        if (v.length > 3) {
          const r = parseFloat(v[3]);
          const g = parseFloat(v[4]);
          const b = parseFloat(v[5]);
          this.colors.push(r, g, b);
          currentObject.colors.push(r, g, b);
        }
      }

      if (line.startsWith('vt ')) {
        const t = line.substring(3).split(' ');
        const u = parseFloat(t[0]);
        const v = 1 - parseFloat(t[1]);
        this.texcoords.push(u, v);
        currentObject.texcoords.push(u, v);
      }

      if (line.startsWith('vn ')) {
        const n = line.substring(3).split(' ');
        const x = parseFloat(n[0]);
        const y = parseFloat(n[1]);
        const z = parseFloat(n[2]);
        this.normals.push(x, y, z);
        currentObject.normals.push(x, y, z);
      }

      if (line.startsWith('s ')) {
        const arg = parseInt(line.substring(2));
        const group = currentObject.groups.find(g => g.id == arg);

        if (group) {
          currentGroup = group;
        }
        else {
          const newGroup: Group = { id: arg, indices: [], vertexCount: 0, smooth: arg != 0 };
          currentObject.groups.push(newGroup);
          currentGroup = newGroup;
        }
      }

      if (line.startsWith('f ')) {
        const a = line.substring(2).split(' ');
        if (a.length > 3) {
          throw new Error('Gfx3MeshOBJ::loadObjects(): Not support quad faces !');
        }

        for (let i = 0; i < 3; i++) {
          const ids = a[i].split('/');
          ids.forEach(id => currentGroup.indices.push(parseInt(id) - 1));
          currentGroup.vertexCount++;
          currentObject.vertexCount++;
        }
      }

      if (line.startsWith('l ')) {
        const ids = line.substring(2).split(' ');
        ids.forEach(id => currentObject.lines.push(parseInt(id) - 1));
      }
    }

    for (const object of this.objects.values()) {
      const mesh = new Gfx3Mesh();
      const material = this.materials.get(object.materialName);

      if (material) {
        mesh.setMaterial(material);
      }

      const texcoords = object.texcoords.length > 0 ? this.texcoords : undefined; // texcoords are optionnals
      const normals = object.normals.length > 0 ? this.normals : undefined; // normals are optionnals
      const colors = object.colors.length > 0 ? this.colors : undefined; // colors are optionnals

      mesh.beginVertices(object.vertexCount);
      mesh.setVertices(Gfx3Mesh.buildVertices(object.vertexCount, this.coords, texcoords, colors, normals, object.groups));
      mesh.endVertices();

      this.meshes.set(object.name, mesh);
    }
  }
}

export { Gfx3MeshOBJ };