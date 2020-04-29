import GameEvent, {
  getType,
  notTypes,
  not,
  hasPrev,
  hasNext,
  TYPE_L_GOAL,
  TYPE_R_GOAL,
  TYPE_L_AT_GOAL,
  TYPE_R_AT_GOAL,
  TYPE_L_TIMEOUT,
  TYPE_R_TIMEOUT,
  includes,
  isLeft,
  isRight,
  EventType,
  EventTypePredicate,
  lookup,
  getEventName
} from "./GameEvents";

export type BarStatistics = {
  defense: {
    retry: number;
    loss: number;
    goal: number;
    pass: number;
    atGoal: number;
  };
  mid: {
    retry: number;
    loss: number;
    goal: number;
    pass: number;
    atGoal: number;
    passRate: number;
  };
  offense: {
    retry: number;
    loss: number;
    goal: number;
    atGoal: number;
    goalRate: number;
  };
};

export type GameStatistics = {
  left: {
    goals: number;
    atGoal: number;
    bars: BarStatistics;
  };
  right: {
    goals: number;
    atGoal: number;
    bars: BarStatistics;
  };
};

export const rateFn = (
  events: GameEvent[],
  from: EventType,
  pred: EventTypePredicate
): number => {
  const successful = hasNext(events, [from], pred).length;
  const notSuccessful = hasNext(events, [from], not(pred)).length;
  if (successful + notSuccessful == 0) {
    return 0;
  }
  return (successful / (successful + notSuccessful)) * 100;
};

export const getBarStatistics = (
  team: string,
  events: GameEvent[]
): BarStatistics => {
  const lookupEvent = lookup(team);
  const enemyTeam = team == "L" ? isRight() : isLeft();
  const defense = lookupEvent("DEFENSE");
  const offense = lookupEvent("OFFENSE");
  const mid = lookupEvent("MID");
  const goal = lookupEvent("GOAL");
  const atGoal = lookupEvent("AT_GOAL");
  const stats = {
    defense: {
      retry: hasPrev(events, [defense], includes([defense])).length,
      loss: hasNext(events, [defense], enemyTeam).length,
      goal: hasPrev(events, [goal], includes([defense])).length,
      atGoal: hasPrev(events, [atGoal], includes([defense])).length,
      pass: hasPrev(events, [offense], includes([defense])).length
    },
    mid: {
      retry: hasPrev(events, [mid], includes([mid])).length,
      loss: hasNext(events, [mid], enemyTeam).length,
      goal: hasPrev(events, [goal], includes([mid])).length,
      atGoal: hasPrev(events, [atGoal], includes([mid])).length,
      pass: hasPrev(events, [offense], includes([mid])).length,
      passRate: rateFn(events, mid, includes([offense]))
    },
    offense: {
      retry: hasPrev(events, [offense], includes([offense])).length,
      loss: hasNext(events, [offense], enemyTeam).length,
      lossRate: rateFn(events, offense, enemyTeam),
      goal: hasPrev(events, [goal], includes([offense])).length,
      atGoal: hasPrev(events, [atGoal], includes([offense])).length,
      goalRate: rateFn(events, offense, includes([goal]))
    }
  };

  return stats;
};

export const getStatistics = (events: GameEvent[]): GameStatistics => {
  const nonTimeoutEvents = events.filter(
    notTypes([TYPE_L_TIMEOUT, TYPE_R_TIMEOUT])
  );
  const leftBar = getBarStatistics("L", nonTimeoutEvents);
  const rightBar = getBarStatistics("R", nonTimeoutEvents);

  return {
    left: {
      goals: nonTimeoutEvents.filter(getType(TYPE_L_GOAL)).length,
      atGoal: nonTimeoutEvents.filter(getType(TYPE_L_AT_GOAL)).length,
      bars: leftBar
    },
    right: {
      goals: nonTimeoutEvents.filter(getType(TYPE_R_GOAL)).length,
      atGoal: nonTimeoutEvents.filter(getType(TYPE_R_AT_GOAL)).length,
      bars: rightBar
    }
  };
};

export const mapBarStats = (team: string, events: GameEvent[]) => {
  const look = lookup(team);
  const inverseTeam = team == "L" ? isRight() : isLeft();
  const midEvents = {} as any;
  const offenseEvents = {} as any;
  const defenseEvents = {} as any;
  const out = [] as any;

  events.forEach((e, i, coll) => {
    if (i >= coll.length - 1) {
      return;
    }
    const type = e.type.toString();
    const nextType = coll[i + 1].type;
    const next = getEventName(coll[i + 1].type);
    let nextName = next.replace(`TYPE_${team}_`, "");
    if (inverseTeam(nextType)) {
      nextName = "LOSS";
    }
    switch (type) {
      case look("MID"):
        if (!midEvents[nextName]) {
          midEvents[nextName] = 0;
        }
        midEvents[nextName]++;
        break;
      case look("OFFENSE"):
        if (!offenseEvents[nextName]) {
          offenseEvents[nextName] = 0;
        }
        offenseEvents[nextName]++;
        break;
      case look("DEFENSE"):
        if (!defenseEvents[nextName]) {
          defenseEvents[nextName] = 0;
        }
        defenseEvents[nextName]++;
        break;
      default:
        break;
    }
  });
  Object.keys(defenseEvents).forEach(k => {
    out.push({
      group: "DEFENSE",
      variable: k,
      value: defenseEvents[k]
    });
  });
  Object.keys(midEvents).forEach(k => {
    out.push({
      group: "MID",
      variable: k,
      value: midEvents[k]
    });
  });
  Object.keys(offenseEvents).forEach(k => {
    out.push({
      group: "OFFENSE",
      variable: k,
      value: offenseEvents[k]
    });
  });

  return out;
};
