import { Tile, TileSectionType } from "@/models/Tile";
import { getHexConnectedToSide } from "@/utils/nearbyHexes";
import { cloneDeep } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import useCellValueStore from "@/dataStores/cellValues";
import useEvents, { EVENT_TYPES } from "@/hooks/useEvents";
import { usePrevious } from "@mantine/hooks";

const useZoneTracker = ({ rows, cols }: { rows: number; cols: number }) => {
  const cellValues = useCellValueStore((state) => state.values);
  const { dispatch } = useEvents();

  const [zones, setZones] = useState<Zones>({
    [TileSectionType.Forest]: [],
    [TileSectionType.Water]: [],
    [TileSectionType.Mountains]: [],
    [TileSectionType.City]: [],
    [TileSectionType.Plains]: [],
  });

  const [completedZones, setCompletedZones] = useState<Zones>({
    [TileSectionType.Forest]: [],
    [TileSectionType.Water]: [],
    [TileSectionType.Mountains]: [],
    [TileSectionType.City]: [],
    [TileSectionType.Plains]: [],
  });

  const completedZoneIds = useMemo(() => {
    return Object.values(completedZones).flatMap((zoneList) =>
      zoneList.map((zone) => zone.hexes.map((hex) => `${hex.row},${hex.col}`))
    );
  }, [completedZones]);
  console.log(completedZoneIds);
  const completedZoneIdsPrevious = usePrevious(completedZoneIds);

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
            tile: cloneDeep(tile),
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
            tile: cloneDeep(connectedTile),
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
                tile: cloneDeep(connectedTile),
              },
              {
                row,
                col,
                sides: tileSides.filter((_) => _.type == side.type),
                tile: cloneDeep(tile),
              },
            ],
          });
        }
      });
      setZones(newZones);
    },
    [cellValues, cols, rows, zones]
  );

  // check if a zone is completed
  // if it is, add it to the completed zones

  useEffect(() => {
    const newZones = {
      [TileSectionType.Forest]: [],
      [TileSectionType.Water]: [],
      [TileSectionType.Mountains]: [],
      [TileSectionType.City]: [],
      [TileSectionType.Plains]: [],
    };
    Object.entries(zones).forEach(([zoneType, zoneList]) => {
      zoneList.forEach((zone) => {
        const isZoneComplete = zone.hexes.every((hex) => {
          // are all sides of the zoneType type connected
          const isConnected = hex.tile.getSides().every((side, index) => {
            if (side.type !== zoneType) return true;
            const connectedHex = getHexConnectedToSide(
              hex.row,
              hex.col,
              rows,
              cols,
              index
            );
            if (!connectedHex) {
              return false;
            }
            const [connectedRow, connectedCol] = connectedHex;
            const connectedTile = cellValues[`${connectedRow},${connectedCol}`];
            if (!connectedTile) {
              return false;
            }
            return true;
          });
          return isConnected;
        });
        if (!isZoneComplete) {
          return;
        }
        newZones[zoneType as TileSectionType].push(cloneDeep(zone));
      });
    });
    setCompletedZones(newZones);
  }, [cellValues, cols, dispatch, rows, zones]);

  useEffect(() => {
    // check if new zones are completed
    if (completedZoneIds.length === completedZoneIdsPrevious?.length) {
      return;
    }
    const newlyCompletedZones = completedZoneIds.filter(
      (zoneId) => !completedZoneIdsPrevious?.includes(zoneId)
    );

    if (newlyCompletedZones.length === 0) {
      return;
    }

    Object.entries(completedZones).forEach(([zoneType, zoneList]) => {
      const completedZone = zoneList.find((zone) =>
        zone.hexes.every((hex) =>
          newlyCompletedZones.every((entry) =>
            entry.includes(`${hex.row},${hex.col}`)
          )
        )
      );
      if (!completedZone) {
        return;
      }
      dispatch(EVENT_TYPES.ZONE_COMPLETE, { zone: completedZone });
    });
  }, [completedZoneIds, completedZoneIdsPrevious, completedZones, dispatch]);

  return useMemo(
    () => ({ zones, completedZones, setZones: setZonesAfterTilePlacement }),
    [setZonesAfterTilePlacement, completedZones, zones]
  );
};

export default useZoneTracker;
