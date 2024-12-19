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

const Tile_MMMMMM = new Tile([
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.Mountains,
]);

const Tile_WWWCCC = new Tile([
  TileSectionType.Water,
  TileSectionType.Water,
  TileSectionType.Water,
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.City,
]);

const Tile_WWWWWW = new Tile([
  TileSectionType.Water,
  TileSectionType.Water,
  TileSectionType.Water,
  TileSectionType.Water,
  TileSectionType.Water,
  TileSectionType.Water,
]);

const Tile_PPPCCC = new Tile([
  TileSectionType.Plains,
  TileSectionType.Plains,
  TileSectionType.Plains,
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.City,
]);

const Tile_PPPPPP = new Tile([
  TileSectionType.Plains,
  TileSectionType.Plains,
  TileSectionType.Plains,
  TileSectionType.Plains,
  TileSectionType.Plains,
  TileSectionType.Plains,
]);

const Tile_CCCMMM = new Tile([
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.Mountains,
]);

const Tile_CCCWWW = new Tile([
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.Water,
  TileSectionType.Water,
  TileSectionType.Water,
]);

const Tile_CCCPPP = new Tile([
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.Plains,
  TileSectionType.Plains,
  TileSectionType.Plains,
]);

const Tile_MMMWWW = new Tile([
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.Water,
  TileSectionType.Water,
  TileSectionType.Water,
]);

const Tile_MMMPPP = new Tile([
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.Plains,
  TileSectionType.Plains,
  TileSectionType.Plains,
]);

const Tile_WWWPPP = new Tile([
  TileSectionType.Water,
  TileSectionType.Water,
  TileSectionType.Water,
  TileSectionType.Plains,
  TileSectionType.Plains,
  TileSectionType.Plains,
]);

const Tile_FFFMMM = new Tile([
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.Mountains,
]);

const Tile_FFFWWW = new Tile([
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.Water,
  TileSectionType.Water,
  TileSectionType.Water,
]);

const Tile_FFFPPP = new Tile([
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.Plains,
  TileSectionType.Plains,
  TileSectionType.Plains,
]);

const Tile_CCCFFF = new Tile([
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.Forest,
]);

const Tile_MMMFFF = new Tile([
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.Forest,
]);

const Tile_WWWFFF = new Tile([
  TileSectionType.Water,
  TileSectionType.Water,
  TileSectionType.Water,
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.Forest,
]);

const Tile_PPPFFF = new Tile([
  TileSectionType.Plains,
  TileSectionType.Plains,
  TileSectionType.Plains,
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.Forest,
]);

const allTiles = [
  Tile_FFFCCC,
  Tile_FFFFFF,
  Tile_CCCCCC,
  Tile_MMMCCC,
  Tile_MMMMMM,
  Tile_WWWCCC,
  Tile_WWWWWW,
  Tile_PPPCCC,
  Tile_PPPPPP,
  Tile_CCCMMM,
  Tile_CCCWWW,
  Tile_CCCPPP,
  Tile_MMMWWW,
  Tile_MMMPPP,
  Tile_WWWPPP,
  Tile_FFFMMM,
  Tile_FFFWWW,
  Tile_FFFPPP,
  Tile_CCCFFF,
  Tile_MMMFFF,
  Tile_WWWFFF,
  Tile_PPPFFF,
];

export {
  allTiles,
  Tile_FFFCCC,
  Tile_FFFFFF,
  Tile_CCCCCC,
  Tile_MMMCCC,
  Tile_MMMMMM,
  Tile_WWWCCC,
  Tile_WWWWWW,
  Tile_PPPCCC,
  Tile_PPPPPP,
  Tile_CCCMMM,
  Tile_CCCWWW,
  Tile_CCCPPP,
  Tile_MMMWWW,
  Tile_MMMPPP,
  Tile_WWWPPP,
  Tile_FFFMMM,
  Tile_FFFWWW,
  Tile_FFFPPP,
  Tile_CCCFFF,
  Tile_MMMFFF,
  Tile_WWWFFF,
  Tile_PPPFFF,
};
