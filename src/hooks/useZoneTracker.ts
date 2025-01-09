import { Tile, TileSectionType } from "@/models/Tile";
import { getHexConnectedToSide } from "@/utils/nearbyHexes";
import { cloneDeep } from "lodash";
import { useCallback, useMemo, useState } from "react";
import useCellValueStore from "@/dataStores/cellValues";

const useZoneTracker = ({ rows, cols }: { rows: number; cols: number }) => {
  const cellValues = useCellValueStore((state) => state.values);

  const [zones, setZones] = useState<Zones>({
    [TileSectionType.Forest]: [],
    [TileSectionType.Water]: [],
    [TileSectionType.Mountains]: [],
    [TileSectionType.City]: [],
    [TileSectionType.Plains]: [],
  });

  const setZonesAfterTilePlacement = useCallback(
    (row: number, col: number, tile: Tile) => {
      const tileSides = tile.getSides();
      const newZones = cloneDeep(zones);
      tileSides.forEach((side, index) => {
        const connectedHex = getHexConnectedToSide(row, col, rows, cols, index);
        if (!connectedHex) {
          return;
        }
        const [connectedRow, connectedCol] = connectedHex;
        const connectedTile = cellValues[`${connectedRow},${connectedCol}`];
        if (!connectedTile) {
          return;
        }
        const connectedSide = connectedTile.getSides()[(index + 3) % 6];

        const isConnectedSideSameType = connectedSide.type === side.type;
        if (!isConnectedSideSameType) {
          return;
        }

        const isConnectedSideInZone = newZones[side.type].some((zone) =>
          zone.hexes.some(
            (hex) => hex.row === connectedRow && hex.col === connectedCol
          )
        );
        const isSideAlreadyInZone = newZones[side.type].some((zone) =>
          zone.hexes.some((hex) => hex.row === row && hex.col === col)
        );
        if (isConnectedSideInZone) {
          // add the current hex to the zone
          const zone = newZones[side.type].find((zone) =>
            zone.hexes.some(
              (hex) => hex.row === connectedRow && hex.col === connectedCol
            )
          );
          if (!zone) {
            console.error("Zone not found");
            return;
          }
          zone.hexes.push({
            row,
            col,
            sides: tileSides.filter((_) => _.type == side.type),
          });
        } else if (isSideAlreadyInZone && !isConnectedSideInZone) {
          // add the connected hex to the zone
          const zone = newZones[side.type].find((zone) =>
            zone.hexes.some((hex) => hex.row === row && hex.col === col)
          );
          if (!zone) {
            console.error("Zone not found");
            return;
          }
          zone.hexes.push({
            row: connectedRow,
            col: connectedCol,
            sides: connectedTile.getSides().filter((_) => _.type == side.type),
          });
        } else {
          // create a new zone
          newZones[side.type].push({
            hexes: [
              {
                row: connectedRow,
                col: connectedCol,
                sides: connectedTile
                  .getSides()
                  .filter((_) => _.type == side.type),
              },
              {
                row,
                col,
                sides: tileSides.filter((_) => _.type == side.type),
              },
            ],
          });
        }
      });
      setZones(newZones);
    },
    [cellValues, cols, rows, zones]
  );

  return useMemo(() => ({ zones, setZones: setZonesAfterTilePlacement }), [
    setZonesAfterTilePlacement,
    zones,
  ]);
};

export default useZoneTracker;
