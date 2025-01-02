enum TileSectionType {
  Forest = "Forest",
  Mountains = "Mountains",
  Water = "Water",
  Plains = "Plains",
  City = "City",
  Castle = "Castle",
  Toxic = "Toxic",
}

const TypeColor = {
  [TileSectionType.Forest]: "#096120",
  [TileSectionType.Mountains]: "#494d4a",
  [TileSectionType.Water]: "#4178c4",
  [TileSectionType.Plains]: "#6e9948",
  [TileSectionType.City]: "#7d5b38",
  [TileSectionType.Castle]: "#140c03",
  [TileSectionType.Toxic]: "#7209b7",
};

type TileSide = {
  type: TileSectionType;
  sideNumber: number;
  color: string;
  img?: string;
};

class Tile {
  public sides: TileSide[] = [];
  public rotation = 0;

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
  // return list of sides adjusted for rotation
  public getSides() {
    const rotatedSides = [...this.sides];
    for (let i = 0; i < this.rotation; i++) {
      rotatedSides.unshift(rotatedSides.pop() as TileSide);
    }
    // console.log("rotatedSides", rotatedSides);
    return rotatedSides;
  }

  public rotate() {
    this.rotation = (this.rotation + 1) % 6;
  }
}

export { Tile, TileSectionType };
export type { TileSide };
