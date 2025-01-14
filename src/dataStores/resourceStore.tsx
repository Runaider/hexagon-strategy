import { create } from "zustand";

type ResourceStore = {
  resources: ResourceProduction;
  setResources: (resources: ResourceProduction) => void;
  increasesResources: (resources: ResourceProduction) => void;
  decreaseResources: (resources: ResourceProduction) => void;
};

const useResourceStore = create<ResourceStore>((set) => ({
  resources: {
    wood: 10,
    stone: 10,
    food: 10,
    gold: 10,
  },
  setResources: (resources: ResourceProduction) => set({ resources }),
  increasesResources: (resources: ResourceProduction) =>
    set((state) => ({
      resources: {
        wood: (state.resources.wood ?? 0) + (resources.wood ?? 0),
        stone: (state.resources.stone ?? 0) + (resources.stone ?? 0),
        food: (state.resources.food ?? 0) + (resources.food ?? 0),
        gold: (state.resources.gold ?? 0) + (resources.gold ?? 0),
      },
    })),
  decreaseResources: (resources: ResourceProduction) =>
    set((state) => ({
      resources: {
        wood: (state.resources.wood ?? 0) - (resources.wood ?? 0),
        stone: (state.resources.stone ?? 0) - (resources.stone ?? 0),
        food: (state.resources.food ?? 0) - (resources.food ?? 0),
        gold: (state.resources.gold ?? 0) - (resources.gold ?? 0),
      },
    })),
}));

export default useResourceStore;
