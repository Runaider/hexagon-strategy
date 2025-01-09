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
  type ResourceNames = "wood" | "stone" | "food" | "gold";

  type ResourceProduction = {
    wood?: number | null;
    stone?: number | null;
    food?: number | null;
    gold?: number | null;
    // _: number;
    // isLocked: boolean;
  };

  type ToxicTile = {
    row: number;
    col: number;
    priceToDestroy: ResourceProduction;
    spawnedTurn: number;
    destructionTurn: number | null;
    // spreadInterval: number;
  };

  type QuestInstantAction = {
    text: string;
    subtext: string;
    price?: ResourceProduction;
    tileModifications?: {
      actionType: "remove" | "add" | "change";
      amount: number;
      tileSectionType: TileSectionType;
    }[];
  };

  type QuestInstant = {
    details: { text: string }[];
    actions: QuestInstantAction[];
  };
}
