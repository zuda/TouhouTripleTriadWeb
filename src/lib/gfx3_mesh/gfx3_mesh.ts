import { gfx3MeshRenderer } from './gfx3_mesh_renderer';
import { UT } from '../core/utils';
import { Gfx3Drawable } from '../gfx3/gfx3_drawable';
import { Gfx3Material } from './gfx3_mesh_material';
import { SHADER_VERTEX_ATTR_COUNT } from './gfx3_mesh_shader';

export interface Group {
  id: number,
  indices: Array<number>,
  vertexCount: number,
  smooth: boolean
};

/**
 * The `Gfx3Mesh` class is a subclass of `Gfx3Drawable` and represents a mesh object in a 3D graphics engine, with methods for building
 * vertices, updating and drawing the mesh, and managing its layer and material.
 */
class Gfx3Mesh extends Gfx3Drawable {
  layer: number;
  material: Gfx3Material;

  /**
   * The constructor.
   */
  constructor() {
    super(SHADER_VERTEX_ATTR_COUNT);
    this.layer = 0;
    this.material = new Gfx3Material({});
  }

  /**
   * The "buildVertices" function takes various vertex data and returns an array
   * of vertices with calculated normals, tangents, and binormals in the engine format.
   * @param {number} vertexCount - The total number of vertices in the mesh.
   * @param coords - An array of vertex coordinates.
   * @param [texcoords] - An optional array of vertex texture coordinates.
   * @param [colors] - An optional array of vertex color.
   * @param [normals] - An optional array of vertex normal.
   * @param [groups] - An optional array of vertex group.
   * A vertex group contains an array of vertex indices.
   * @returns The array of vertices in the engine ready-to-used format.
   */
  static buildVertices(vertexCount: number, coords: Array<number>, texcoords?: Array<number>, colors?: Array<number>, normals?: Array<number>, groups?: Array<Group>): Array<number> {
    const vertices = new Array<number>();
    const finalCoords = new Array<vec3>();
    const finalUVs = new Array<vec2>();
    const finalColors = new Array<vec3>();
    const finalNorms = new Array<vec3>();
    const finalTangs = new Array<vec3>();
    const finalFlips = new Array<number>();
    const finalBinorms = new Array<vec3>();
    const finalNormsByGroup = new Array<Array<vec3>>();
    const finalTangsByGroup = new Array<Array<vec3>>();
    const indexStride = normals ? 3 : 2;

    if (!groups) {
      const indices = [];
      for (let i = 0; i < vertexCount; i++) {
        if (normals) {
          indices.push(i, i, i);
        }
        else {
          indices.push(i, i);
        }        
      }

      groups = [{ id: 0, indices: indices, vertexCount: vertexCount, smooth: false }];
    }

    for (let i = 0, n = 0; i < groups.length; i++) {
      const group = groups[i];
      finalNormsByGroup[group.id] = [];
      finalTangsByGroup[group.id] = [];

      for (let j = 0; j < group.vertexCount; j += 3, n += 3) {
        const cid0 = group.indices[(j + 0) * indexStride + 0];
        const cid1 = group.indices[(j + 1) * indexStride + 0];
        const cid2 = group.indices[(j + 2) * indexStride + 0];

        finalCoords[n + 0] = [coords[cid0 * 3 + 0], coords[cid0 * 3 + 1], coords[cid0 * 3 + 2]];
        finalCoords[n + 1] = [coords[cid1 * 3 + 0], coords[cid1 * 3 + 1], coords[cid1 * 3 + 2]];
        finalCoords[n + 2] = [coords[cid2 * 3 + 0], coords[cid2 * 3 + 1], coords[cid2 * 3 + 2]];

        const tid0 = group.indices[(j + 0) * indexStride + 1];
        const tid1 = group.indices[(j + 1) * indexStride + 1];
        const tid2 = group.indices[(j + 2) * indexStride + 1];

        if (texcoords) {
          finalUVs[n + 0] = [texcoords[tid0 * 2 + 0], texcoords[tid0 * 2 + 1]];
          finalUVs[n + 1] = [texcoords[tid1 * 2 + 0], texcoords[tid1 * 2 + 1]];
          finalUVs[n + 2] = [texcoords[tid2 * 2 + 0], texcoords[tid2 * 2 + 1]];  
        }
        else {
          finalUVs[n + 0] = [0.0, 0.0];
          finalUVs[n + 1] = [0.0, 0.0];
          finalUVs[n + 2] = [0.0, 0.0];  
        }

        if (colors) {
          finalColors[n + 0] = [colors[cid0 * 3 + 0], colors[cid0 * 3 + 1], colors[cid0 * 3 + 2]];
          finalColors[n + 1] = [colors[cid1 * 3 + 0], colors[cid1 * 3 + 1], colors[cid1 * 3 + 2]];
          finalColors[n + 2] = [colors[cid2 * 3 + 0], colors[cid2 * 3 + 1], colors[cid2 * 3 + 2]];
        }
        else {
          finalColors[n + 0] = [1.0, 1.0, 1.0];
          finalColors[n + 1] = [1.0, 1.0, 1.0];
          finalColors[n + 2] = [1.0, 1.0, 1.0];
        }

        const c01 = UT.VEC3_SUBSTRACT(finalCoords[n + 1], finalCoords[n + 0]);
        const c02 = UT.VEC3_SUBSTRACT(finalCoords[n + 2], finalCoords[n + 0]);
        const uv01 = UT.VEC2_SUBSTRACT(finalUVs[n + 1], finalUVs[n + 0]);
        const uv02 = UT.VEC2_SUBSTRACT(finalUVs[n + 2], finalUVs[n + 0]);

        if (normals) {
          const nid0 = group.indices[(j + 0) * indexStride + 2];
          const nid1 = group.indices[(j + 1) * indexStride + 2];
          const nid2 = group.indices[(j + 2) * indexStride + 2];
          finalNorms[n + 0] = [normals[nid0 * 3 + 0], normals[nid0 * 3 + 1], normals[nid0 * 3 + 2]];
          finalNorms[n + 1] = [normals[nid1 * 3 + 0], normals[nid1 * 3 + 1], normals[nid1 * 3 + 2]];
          finalNorms[n + 2] = [normals[nid2 * 3 + 0], normals[nid2 * 3 + 1], normals[nid2 * 3 + 2]];
        }
        else {
          const fnorm = UT.VEC3_NORMALIZE(UT.VEC3_CROSS(c01, c02));
          finalNorms[n + 0] = fnorm;
          finalNorms[n + 1] = fnorm;
          finalNorms[n + 2] = fnorm;
        }

        const ftang: vec3 = [0, 0, 0];
        const fflip = COMPUTE_FACE_TANGENT(c01, c02, uv01, uv02, ftang);
        finalFlips[n + 0] = fflip;
        finalFlips[n + 1] = fflip;
        finalFlips[n + 2] = fflip;
        finalTangs[n + 0] = ftang;
        finalTangs[n + 1] = ftang;
        finalTangs[n + 2] = ftang;

        if (group.smooth) {
          finalNormsByGroup[group.id][cid0] = finalNormsByGroup[group.id][cid0] ? UT.VEC3_ADD(finalNormsByGroup[group.id][cid0], finalNorms[n + 0]) : finalNorms[n + 0];
          finalNormsByGroup[group.id][cid1] = finalNormsByGroup[group.id][cid1] ? UT.VEC3_ADD(finalNormsByGroup[group.id][cid1], finalNorms[n + 1]) : finalNorms[n + 1];
          finalNormsByGroup[group.id][cid2] = finalNormsByGroup[group.id][cid2] ? UT.VEC3_ADD(finalNormsByGroup[group.id][cid2], finalNorms[n + 2]) : finalNorms[n + 2];
          finalTangsByGroup[group.id][cid0] = finalTangsByGroup[group.id][cid0] ? UT.VEC3_ADD(finalTangsByGroup[group.id][cid0], ftang) : ftang;
          finalTangsByGroup[group.id][cid1] = finalTangsByGroup[group.id][cid1] ? UT.VEC3_ADD(finalTangsByGroup[group.id][cid1], ftang) : ftang;
          finalTangsByGroup[group.id][cid2] = finalTangsByGroup[group.id][cid2] ? UT.VEC3_ADD(finalTangsByGroup[group.id][cid2], ftang) : ftang;
        }
      }
    }

    for (let i = 0, n = 0; i < groups.length; i++) {
      for (let j = 0; j < groups[i].vertexCount; j++, n++) {
        const cid = groups[i].indices[j * indexStride + 0];
        if (groups[i].smooth) {
          finalNorms[n] = UT.VEC3_NORMALIZE(finalNormsByGroup[groups[i].id][cid]);
          finalTangs[n] = UT.VEC3_NORMALIZE(finalTangsByGroup[groups[i].id][cid]);
        }

        finalBinorms[n] = UT.VEC3_SCALE(UT.VEC3_CROSS(finalNorms[n], finalTangs[n]), finalFlips[n]);
        vertices.push(finalCoords[n][0], finalCoords[n][1], finalCoords[n][2], finalUVs[n][0], finalUVs[n][1], finalColors[n][0], finalColors[n][1], finalColors[n][2], finalNorms[n][0], finalNorms[n][1], finalNorms[n][2], finalTangs[n][0], finalTangs[n][1], finalTangs[n][2], finalBinorms[n][0], finalBinorms[n][1], finalBinorms[n][2]);
      }
    }

    return vertices;
  }

  /**
   * The "delete" function free all resources.
   * Warning: you need to call this method to free allocation for this object.
   */
  delete(keepMat: boolean = false): void {
    if (!keepMat) {
      this.material.delete();
    }

    super.delete();
  }

  /**
   * The "update" function.
   * @param {number} ts - The `ts` parameter stands for "timestep".
   */
  update(ts: number): void {
    this.material.update(ts);
  }

  /**
   * The "draw" function.
   */
  draw(): void {
    gfx3MeshRenderer.drawMesh(this);
  }

  /**
   * The "setLayer" function sets the layer property.
   * @param {number} layer - The "layer" parameter is a number that represents the layer identifier.
   * It is used to easily categorized and identified group of drawables.
   * Ex: allow decals for wall only, for character only, etc...
   */
  setLayer(layer: number): void {
    this.layer = layer;
  }

  /**
   * The "getLayer" function returns the layer number.
   * @returns The layer number is being returned.
   */
  getLayer(): number {
    return this.layer;
  }

  /**
   * The "setMaterial" function sets a new material.
   * @param {Gfx3Material} material - The new material.
   * @param {boolean} [keepMat=true] - The `keepMat` parameter is a boolean flag that determines whether
   * to keep the current material or delete it before assigning the new material.
   * Warning: If keepMat is to `false` then the current material is definitly destroy (included if others
   * drawables potentially used it).
   */
  setMaterial(material: Gfx3Material, keepMat: boolean = true): void {
    if (!keepMat) {
      this.material.delete();
    }

    this.material = material;
  }

  /**
   * The "getMaterial" function returns the material.
   * @returns The material.
   */
  getMaterial(): Gfx3Material {
    return this.material;
  }

  /**
   * The "clone" function creates a new `Gfx3Mesh` object by applying a transformation matrix to each
   * vertex of the original mesh.
   * @param {mat4} transformMatrix - The `transformMatrix` parameter is a 4x4 matrix that represents a
   * transformation. It is used to transform the vertices of the mesh. The default value is the identity
   * matrix, which means no transformation is applied if no matrix is provided.
   * @returns a new instance of the Gfx3Mesh class.
   */
  clone(transformMatrix: mat4 = UT.MAT4_IDENTITY()): Gfx3Mesh {
    const mesh = new Gfx3Mesh();
    mesh.beginVertices(this.vertexCount);

    for (let i = 0; i < this.vertices.length; i += this.vertexStride) {
      const v = UT.MAT4_MULTIPLY_BY_VEC4(transformMatrix, UT.VEC4_CREATE(this.vertices[i + 0], this.vertices[i + 1], this.vertices[i + 2], 1.0));
      mesh.defineVertex(v[0], v[1], v[2], this.vertices[i + 3], this.vertices[i + 4], this.vertices[i + 5], this.vertices[i + 6], this.vertices[i + 7], this.vertices[i + 8], this.vertices[i + 9], this.vertices[i + 10], this.vertices[i + 11], this.vertices[i + 12], this.vertices[i + 13]);
    }

    mesh.endVertices();
    mesh.setLayer(this.layer);
    mesh.setMaterial(this.material);
    return mesh;
  }

  /**
   * The "mat" getter returns the Gfx3Material property named "mat".
   * @returns The material as a shortcut.
   */
  get mat(): Gfx3Material {
    return this.material;
  }
}

export { Gfx3Mesh };

// -------------------------------------------------------------------------------------------
// HELPFUL
// -------------------------------------------------------------------------------------------

function COMPUTE_FACE_TANGENT(v01: vec3, v02: vec3, uv01: vec2, uv02: vec2, out: vec3): number {
  const uv2xArea = ((uv01[0] * uv02[1]) - (uv01[1] * uv02[0]));
  if (Math.abs(uv2xArea) > UT.EPSILON) {
    const r = 1.0 / uv2xArea;
    const flip = uv2xArea > 0 ? 1 : -1;

    const tx = ((v01[0] * uv02[1]) - (v02[0] * uv01[1])) * r;
    const ty = ((v01[1] * uv02[1]) - (v02[1] * uv01[1])) * r;
    const tz = ((v01[2] * uv02[1]) - (v02[2] * uv01[1])) * r;

    const ftang = UT.VEC3_NORMALIZE([tx, ty, tz]);
    out[0] = ftang[0];
    out[1] = ftang[1];
    out[2] = ftang[2];
    return flip;
  }

  return -1;
}