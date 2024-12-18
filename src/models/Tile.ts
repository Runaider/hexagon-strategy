enum TileSectionType {
  Forest,
  Mountains,
  Desert,
  Water,
  Swamp,
  City,
  Castle,
  Road,
}

const TypeColor = {
  [TileSectionType.Forest]: "#096120",
  [TileSectionType.Mountains]: "#494d4a",
  [TileSectionType.Desert]: "#c4ac41",
  [TileSectionType.Water]: "#4178c4",
  [TileSectionType.Swamp]: "#6e9948",
  [TileSectionType.City]: "#7d5b38",
  [TileSectionType.Castle]: "#140c03",
  [TileSectionType.Road]: "#9da1a0",
};

type TileSide = {
  type: TileSectionType;
  sideNumber: number;
  color: string;
};

class Tile {
  public sides: TileSide[] = [];
  constructor(sections: TileSectionType[]) {
    this.sides = sections.map(
      (section, index) =>
        ({
          type: section,
          sideNumber: index,
          color: TypeColor[section],
        } as unknown as TileSide)
    );
  }
}

export { Tile, TileSectionType };
export type { TileSide };
