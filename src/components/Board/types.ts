import { TileSectionType, TileSide } from "@/models/Tile";

declare global {
  type Zones = {
    [TileSectionType.Forest]: {
      hexes: { row: number; col: number; sides: TileSide[] }[];
    }[];
    [TileSectionType.Water]: {
      hexes: { row: number; col: number; sides: TileSide[] }[];
    }[];
    [TileSectionType.Mountains]: {
      hexes: { row: number; col: number; sides: TileSide[] }[];
    }[];
    [TileSectionType.City]: {
      hexes: { row: number; col: number; sides: TileSide[] }[];
    }[];
    [TileSectionType.Plains]: {
      hexes: { row: number; col: number; sides: TileSide[] }[];
    }[];
  };
}
