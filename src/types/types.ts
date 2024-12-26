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
  type ResourceNames = "wood" | "stone" | "food" | "gold" | "_";

  type ResourceProduction = {
    wood?: number;
    stone?: number;
    food?: number;
    gold?: number;
    _: number;
    // isLocked: boolean;
  };

  type ToxicTile = {
    row: number;
    col: number;
    questId: string;
    spawnedTurn: number;
    destructionTurn: number | null;
    // spreadInterval: number;
  };

  type Quest = {
    id: string;
    title: string;
    criteria: {
      type: "poses" | "gather" | "build";
      target: ResourceNames;
      amount: number;
    };
    description: string;
    reward: number;
    completed: boolean;
  };
}
