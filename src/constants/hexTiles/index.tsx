import { Tile, TileSectionType } from "../../models/Tile";

const Tile_FFFCCC = new Tile([
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.City,
]);

const Tile_FFFFFF = new Tile([
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.Forest,
]);

const Tile_CCCCCC = new Tile([
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.City,
]);

const Tile_MMMCCC = new Tile([
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.City,
]);

export { Tile_FFFCCC, Tile_FFFFFF, Tile_CCCCCC, Tile_MMMCCC };
