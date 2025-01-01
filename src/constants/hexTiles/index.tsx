import { Tile, TileSectionType } from "../../models/Tile";

const Tile_CASTLE = new Tile([
  TileSectionType.Castle,
  TileSectionType.Castle,
  TileSectionType.Castle,
  TileSectionType.Castle,
  TileSectionType.Castle,
  TileSectionType.Castle,
]);

import CASTLE_r0 from "../../assets/castle/CASTLE_r0.png";

Tile_CASTLE.sides[0].img = CASTLE_r0;
Tile_CASTLE.sides[1].img = CASTLE_r0;
Tile_CASTLE.sides[2].img = CASTLE_r0;
Tile_CASTLE.sides[3].img = CASTLE_r0;
Tile_CASTLE.sides[4].img = CASTLE_r0;
Tile_CASTLE.sides[5].img = CASTLE_r0;

const Tile_TOXIC = new Tile([
  TileSectionType.Toxic,
  TileSectionType.Toxic,
  TileSectionType.Toxic,
  TileSectionType.Toxic,
  TileSectionType.Toxic,
  TileSectionType.Toxic,
]);

import TOXIC_r0 from "../../assets/toxic/TOXIC_r0.png";

Tile_TOXIC.sides[0].img = TOXIC_r0;
Tile_TOXIC.sides[1].img = TOXIC_r0;
Tile_TOXIC.sides[2].img = TOXIC_r0;
Tile_TOXIC.sides[3].img = TOXIC_r0;
Tile_TOXIC.sides[4].img = TOXIC_r0;
Tile_TOXIC.sides[5].img = TOXIC_r0;

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

import FFFFFF_r0 from "../../assets/ffffff/FFFFFF_r0.png";

Tile_FFFFFF.sides[0].img = FFFFFF_r0;
Tile_FFFFFF.sides[1].img = FFFFFF_r0;
Tile_FFFFFF.sides[2].img = FFFFFF_r0;
Tile_FFFFFF.sides[3].img = FFFFFF_r0;
Tile_FFFFFF.sides[4].img = FFFFFF_r0;
Tile_FFFFFF.sides[5].img = FFFFFF_r0;

const Tile_CCCCCC = new Tile([
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.City,
]);

import CCCCCC_r0 from "../../assets/cccccc/CCCCCC_r0.png";

Tile_CCCCCC.sides[0].img = CCCCCC_r0;
Tile_CCCCCC.sides[1].img = CCCCCC_r0;
Tile_CCCCCC.sides[2].img = CCCCCC_r0;
Tile_CCCCCC.sides[3].img = CCCCCC_r0;
Tile_CCCCCC.sides[4].img = CCCCCC_r0;
Tile_CCCCCC.sides[5].img = CCCCCC_r0;

const Tile_CCPPPP = new Tile([
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.Plains,
  TileSectionType.Plains,
  TileSectionType.Plains,
  TileSectionType.Plains,
]);

import CCPPPP_r0 from "../../assets/ccpppp/CCPPPP_r0.png";
import CCPPPP_r1 from "../../assets/ccpppp/CCPPPP_r5.png";
import CCPPPP_r2 from "../../assets/ccpppp/CCPPPP_r4.png";
import CCPPPP_r3 from "../../assets/ccpppp/CCPPPP_r3.png";
import CCPPPP_r4 from "../../assets/ccpppp/CCPPPP_r2.png";
import CCPPPP_r5 from "../../assets/ccpppp/CCPPPP_r1.png";

Tile_CCPPPP.sides[0].img = CCPPPP_r0;
Tile_CCPPPP.sides[1].img = CCPPPP_r1;
Tile_CCPPPP.sides[2].img = CCPPPP_r2;
Tile_CCPPPP.sides[3].img = CCPPPP_r3;
Tile_CCPPPP.sides[4].img = CCPPPP_r4;
Tile_CCPPPP.sides[5].img = CCPPPP_r5;

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

import MMMMMM_r0 from "../../assets/mmmmmm/MMMMMM_r0.png";

Tile_MMMMMM.sides[0].img = MMMMMM_r0;
Tile_MMMMMM.sides[1].img = MMMMMM_r0;
Tile_MMMMMM.sides[2].img = MMMMMM_r0;
Tile_MMMMMM.sides[3].img = MMMMMM_r0;
Tile_MMMMMM.sides[4].img = MMMMMM_r0;
Tile_MMMMMM.sides[5].img = MMMMMM_r0;

const Tile_MMPPPP = new Tile([
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.Plains,
  TileSectionType.Plains,
  TileSectionType.Plains,
  TileSectionType.Plains,
]);

import MMPPPP_r0 from "../../assets/mmpppp/MMPPPP_r0.png";
import MMPPPP_r1 from "../../assets/mmpppp/MMPPPP_r5.png";
import MMPPPP_r2 from "../../assets/mmpppp/MMPPPP_r4.png";
import MMPPPP_r3 from "../../assets/mmpppp/MMPPPP_r3.png";
import MMPPPP_r4 from "../../assets/mmpppp/MMPPPP_r2.png";
import MMPPPP_r5 from "../../assets/mmpppp/MMPPPP_r1.png";

Tile_MMPPPP.sides[0].img = MMPPPP_r0;
Tile_MMPPPP.sides[1].img = MMPPPP_r1;
Tile_MMPPPP.sides[2].img = MMPPPP_r2;
Tile_MMPPPP.sides[3].img = MMPPPP_r3;
Tile_MMPPPP.sides[4].img = MMPPPP_r4;
Tile_MMPPPP.sides[5].img = MMPPPP_r5;

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

import PPPPPP_r0 from "../../assets/pppppp/PPPPPP_r0.png";

Tile_PPPPPP.sides[0].img = PPPPPP_r0;

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

const Tile_FFPPPP = new Tile([
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.Plains,
  TileSectionType.Plains,
  TileSectionType.Plains,
  TileSectionType.Plains,
]);

import FFPPPP_r0 from "../../assets/ffpppp/FFPPPP_r0.png";
import FFPPPP_r1 from "../../assets/ffpppp/FFPPPP_r5.png";
import FFPPPP_r2 from "../../assets/ffpppp/FFPPPP_r4.png";
import FFPPPP_r3 from "../../assets/ffpppp/FFPPPP_r3.png";
import FFPPPP_r4 from "../../assets/ffpppp/FFPPPP_r2.png";
import FFPPPP_r5 from "../../assets/ffpppp/FFPPPP_r1.png";

Tile_FFPPPP.sides[0].img = FFPPPP_r0;
Tile_FFPPPP.sides[1].img = FFPPPP_r1;
Tile_FFPPPP.sides[2].img = FFPPPP_r2;
Tile_FFPPPP.sides[3].img = FFPPPP_r3;
Tile_FFPPPP.sides[4].img = FFPPPP_r4;
Tile_FFPPPP.sides[5].img = FFPPPP_r5;

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

const Tile_FFMMPP = new Tile([
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.Plains,
  TileSectionType.Plains,
]);

const Tile_MMPPWW = new Tile([
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.Plains,
  TileSectionType.Plains,
  TileSectionType.Water,
  TileSectionType.Water,
]);

const Tile_PPWWCC = new Tile([
  TileSectionType.Plains,
  TileSectionType.Plains,
  TileSectionType.Water,
  TileSectionType.Water,
  TileSectionType.City,
  TileSectionType.City,
]);

const Tile_WWCCFF = new Tile([
  TileSectionType.Water,
  TileSectionType.Water,
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.Forest,
  TileSectionType.Forest,
]);

const Tile_CCMMPP = new Tile([
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.Plains,
  TileSectionType.Plains,
]);

const Tile_MMPPCC = new Tile([
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.Plains,
  TileSectionType.Plains,
  TileSectionType.City,
  TileSectionType.City,
]);

const Tile_PPCCWW = new Tile([
  TileSectionType.Plains,
  TileSectionType.Plains,
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.Water,
  TileSectionType.Water,
]);

const Tile_CCWWFF = new Tile([
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.Water,
  TileSectionType.Water,
  TileSectionType.Forest,
  TileSectionType.Forest,
]);

const Tile_WWFFMM = new Tile([
  TileSectionType.Water,
  TileSectionType.Water,
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.Mountains,
  TileSectionType.Mountains,
]);

const Tile_FFMMCC = new Tile([
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.City,
  TileSectionType.City,
]);

const Tile_MMCCWW = new Tile([
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.Water,
  TileSectionType.Water,
]);

const Tile_CCWWPP = new Tile([
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.Water,
  TileSectionType.Water,
  TileSectionType.Plains,
  TileSectionType.Plains,
]);

const Tile_WWPPFF = new Tile([
  TileSectionType.Water,
  TileSectionType.Water,
  TileSectionType.Plains,
  TileSectionType.Plains,
  TileSectionType.Forest,
  TileSectionType.Forest,
]);

const Tile_FFCCMM = new Tile([
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.Mountains,
  TileSectionType.Mountains,
]);

const Tile_MMCCPP = new Tile([
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.Plains,
  TileSectionType.Plains,
]);

const Tile_CCPPWW = new Tile([
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.Plains,
  TileSectionType.Plains,
  TileSectionType.Water,
  TileSectionType.Water,
]);

const Tile_PPWWFF = new Tile([
  TileSectionType.Plains,
  TileSectionType.Plains,
  TileSectionType.Water,
  TileSectionType.Water,
  TileSectionType.Forest,
  TileSectionType.Forest,
]);

const Tile_WWFFCC = new Tile([
  TileSectionType.Water,
  TileSectionType.Water,
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.City,
  TileSectionType.City,
]);

const Tile_CCMMFF = new Tile([
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.Forest,
  TileSectionType.Forest,
]);

const Tile_MMFFWW = new Tile([
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.Water,
  TileSectionType.Water,
]);

const Tile_FFWWCC = new Tile([
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.Water,
  TileSectionType.Water,
  TileSectionType.City,
  TileSectionType.City,
]);

const Tile_CCFFMM = new Tile([
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.Mountains,
  TileSectionType.Mountains,
]);

const Tile_MMFFCC = new Tile([
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.City,
  TileSectionType.City,
]);

const Tile_CCMMWW = new Tile([
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.Water,
  TileSectionType.Water,
]);

const Tile_MMWWFF = new Tile([
  TileSectionType.Mountains,
  TileSectionType.Mountains,
  TileSectionType.Water,
  TileSectionType.Water,
  TileSectionType.Forest,
  TileSectionType.Forest,
]);

const Tile_FFCCPP = new Tile([
  TileSectionType.Forest,
  TileSectionType.Forest,
  TileSectionType.City,
  TileSectionType.City,
  TileSectionType.Plains,
  TileSectionType.Plains,
]);

const allTiles = [
  //full
  Tile_FFFFFF,
  Tile_CCCCCC,
  Tile_MMMMMM,
  Tile_PPPPPP,
  // half tiles

  // quarter tiles
  Tile_FFPPPP,
  Tile_CCPPPP,
  Tile_MMPPPP,
  // =====
  // Tile_FFFCCC,
  // Tile_FFFFFF,
  // Tile_CCCCCC,
  // Tile_MMMCCC,
  // Tile_MMMMMM,
  // Tile_WWWCCC,
  // Tile_WWWWWW,
  // Tile_PPPCCC,
  // Tile_PPPPPP,
  // Tile_CCCMMM,
  // Tile_CCCWWW,
  // Tile_CCCPPP,
  // Tile_MMMWWW,
  // Tile_MMMPPP,
  // Tile_WWWPPP,
  // Tile_FFFMMM,
  // Tile_FFFWWW,
  // Tile_FFFPPP,
  // Tile_CCCFFF,
  // Tile_MMMFFF,
  // Tile_WWWFFF,
  // Tile_PPPFFF,
  // //   3part tiles
  // Tile_FFMMPP,
  // Tile_MMPPWW,
  // Tile_PPWWCC,
  // Tile_WWCCFF,
  // Tile_CCMMPP,
  // Tile_MMPPCC,
  // Tile_PPCCWW,
  // Tile_CCWWFF,
  // Tile_WWFFMM,
  // Tile_FFMMCC,
  // Tile_MMCCWW,
  // Tile_CCWWPP,
  // Tile_WWPPFF,
  // Tile_FFCCMM,
  // Tile_MMCCPP,
  // Tile_CCPPWW,
  // Tile_PPWWFF,
  // Tile_WWFFCC,
  // Tile_CCMMFF,
  // Tile_MMFFWW,
  // Tile_FFWWCC,
  // Tile_CCFFMM,
  // Tile_MMFFCC,
  // Tile_CCMMWW,
  // Tile_MMWWFF,
  // Tile_FFCCPP,
];

export {
  allTiles,
  Tile_CASTLE,
  Tile_TOXIC,
  Tile_FFPPPP,
  Tile_FFFFFF,
  Tile_CCCCCC,
  Tile_CCPPPP,
  Tile_PPPPPP,

  // Tile_FFFCCC,
  // Tile_CCCCCC,
  // Tile_MMMCCC,
  // Tile_MMMMMM,
  // Tile_WWWCCC,
  // Tile_WWWWWW,
  // Tile_PPPCCC,
  // Tile_PPPPPP,
  // Tile_CCCMMM,
  // Tile_CCCWWW,
  // Tile_CCCPPP,
  // Tile_MMMWWW,
  // Tile_MMMPPP,
  // Tile_WWWPPP,
  // Tile_FFFMMM,
  // Tile_FFFWWW,
  // Tile_FFFPPP,
  // Tile_CCCFFF,
  // Tile_MMMFFF,
  // Tile_WWWFFF,
  // Tile_PPPFFF,
};
