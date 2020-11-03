import GameEvent, { EVENTS } from "@/lib/GameEvents";
import { getTeamStatistics } from "@/lib/Statistics.ts";

describe("Statistics", () => {
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
    const lstats = getTeamStatistics("L", events);
    const rstats = getTeamStatistics("R", events);
    expect(lstats.mid.goal).toEqual(1);
    expect(lstats.mid.pass).toEqual(1);
    expect(lstats.mid.passRate).toEqual(100);
    expect(rstats.mid.loss).toEqual(3);
    expect(rstats.mid.pass).toEqual(1);
    expect(rstats.mid.goal).toEqual(1);
    expect(rstats.mid.passRate).toEqual(25);
  });
});
