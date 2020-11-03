import GameEvent, {
  EVENTS,
  removeEventSequence,
  TYPE_L_MID,
  TYPE_R_MID,
  TYPE_L_GOAL,
  TYPE_L_OFFENSE,
  TYPE_R_OFFENSE,
  TYPE_R_GOAL,
  TYPE_L_DEFENSE,
  TYPE_END
} from "@/lib/GameEvents";

describe("GameEvent", () => {
  it("should calculate correct metrics for mid", () => {
    const events = [
      // good case: pass
      EVENTS.L_MID(),
      EVENTS.L_OFFENSE(),
      EVENTS.L_GOAL(),
      // R lost ball to opponent mid
      EVENTS.R_MID(),
      EVENTS.L_MID(),
      EVENTS.L_GOAL(),
      // R lost ball to opponent offense
      EVENTS.R_MID(),
      EVENTS.L_OFFENSE(),
      // R lost ball to opponent defense + pass to offense & goal
      EVENTS.R_MID(),
      EVENTS.L_DEFENSE(),
      EVENTS.L_OFFENSE(),
      EVENTS.L_GOAL(),
      // R pass + goal
      EVENTS.R_MID(),
      EVENTS.R_OFFENSE(),
      EVENTS.R_MID(),
      EVENTS.R_GOAL(),
      EVENTS.END()
    ] as GameEvent[];

    const seq = removeEventSequence(events, [TYPE_L_MID, TYPE_L_GOAL]);

    expect(seq.map(e => e.type)).toEqual([
      TYPE_L_MID,
      TYPE_L_OFFENSE,
      TYPE_L_GOAL,

      TYPE_R_MID,
      // THESE SHOULD BE REMOVED
      // EVENTS.L_MID(),
      // EVENTS.L_GOAL(),
      // R lost ball to opponent offense
      TYPE_R_MID,
      TYPE_L_OFFENSE,

      TYPE_R_MID,
      TYPE_L_DEFENSE,
      TYPE_L_OFFENSE,
      TYPE_L_GOAL,

      TYPE_R_MID,
      TYPE_R_OFFENSE,
      TYPE_R_MID,
      TYPE_R_GOAL,
      TYPE_END
    ]);
  });
});
