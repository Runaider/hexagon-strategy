import { useMemo } from "react";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type EventCallback = (data: any) => void;
type Event = {
  event: string;
  data: any;
  created: number;
};

type EventState = {
  events: Event[];
  callbacks: { [key: string]: EventCallback[] };
  dispatch: <T>(event: string, data: T) => void;
  on: (event: string, cb: EventCallback) => () => void;
};

export const EVENT_TYPES = {
  ZONE_COMPLETE: "ZONE_COMPLETE",
};

const useEventStore = create<EventState>()(
  subscribeWithSelector((set, get) => ({
    events: [],
    callbacks: {},
    dispatch: <T>(event: string, data: T) => {
      console.log("event", event, data);
      const newEvent = { event, data, created: Date.now() };
      set((state) => ({
        events: [...state.events, newEvent],
      }));
      const callbackList = get().callbacks[event];
      if (callbackList) {
        callbackList.forEach((cb) => cb(data));
      }
    },
    on: (event: string, cb: EventCallback) => {
      set((state) => {
        const eventCallbacks = state.callbacks[event] || [];
        return {
          callbacks: {
            ...state.callbacks,
            [event]: [...eventCallbacks, cb],
          },
        };
      });

      // Return a cleanup function to unbind event
      return () => {
        set((state) => ({
          callbacks: {
            ...state.callbacks,
            [event]: state.callbacks[event].filter((i) => i !== cb),
          },
        }));
      };
    },
  }))
);

function useEvents() {
  const dispatch = useEventStore((state) => state.dispatch);
  const on = useEventStore((state) => state.on);
  const events = useEventStore((state) => state.events);

  return useMemo(
    () => ({
      dispatch,
      on,
      events,
    }),
    [dispatch, on, events]
  );
}

export default useEvents;
export { useEventStore };

// example listen

// const { on } = useEvents();

//   useEffect(() => {
//     const unsubscribe = on(EVENT_TYPES.REGION_COMPLETE, (data) => {
//       console.log('Region complete event received:', data);
//     });

//     // Cleanup the subscription when the component unmounts
//     return () => {
//       unsubscribe();
//     };
//   }, [on]);

// ======================================================================

// example dispatch

// const { dispatch } = useEvents();

// const handleClick = () => {
//   dispatch(EVENT_TYPES.REGION_COMPLETE, { regionId: 123 });
// };
