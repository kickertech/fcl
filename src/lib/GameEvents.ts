export type EventType = number;

// TYPES
export const TYPE_UNDEFINED: EventType = -1;
export const TYPE_L_GOAL: EventType = 0;
export const TYPE_L_DEFENSE: EventType = 1;
export const TYPE_L_MIDDLE: EventType = 2;
export const TYPE_L_OFFENSE: EventType = 3;
export const TYPE_L_SHOT_AT_GOAL: EventType = 4;
export const TYPE_L_TIMEOUT: EventType = 5;
export const TYPE_R_GOAL: EventType = 6;
export const TYPE_R_DEFENSE: EventType = 7;
export const TYPE_R_MIDDLE: EventType = 8;
export const TYPE_R_OFFENSE: EventType = 9;
export const TYPE_R_SHOT_AT_GOAL: EventType = 10;
export const TYPE_R_TIMEOUT: EventType = 11;
export const TYPE_N_BALL_LOST: EventType = 12;

export const TYPE_START: EventType = 9000;
export const TYPE_END: EventType = 9001;

const typeToName = {
  [TYPE_UNDEFINED]: "UNDEFINED",
  [TYPE_L_GOAL]: "TYPE_L_GOAL",
  [TYPE_L_DEFENSE]: "TYPE_L_DEFENSE",
  [TYPE_L_MIDDLE]: "TYPE_L_MIDDLE",
  [TYPE_L_OFFENSE]: "TYPE_L_OFFENSE",
  [TYPE_L_SHOT_AT_GOAL]: "TYPE_L_SHOT_AT_GOAL",
  [TYPE_L_TIMEOUT]: "TYPE_L_TIMEOUT",
  [TYPE_R_GOAL]: "TYPE_R_GOAL",
  [TYPE_R_DEFENSE]: "TYPE_R_DEFENSE",
  [TYPE_R_MIDDLE]: "TYPE_R_MIDDLE",
  [TYPE_R_OFFENSE]: "TYPE_R_OFFENSE",
  [TYPE_R_SHOT_AT_GOAL]: "TYPE_R_SHOT_AT_GOAL",
  [TYPE_R_TIMEOUT]: "TYPE_R_TIMEOUT",
  [TYPE_N_BALL_LOST]: "TYPE_N_BALL_LOST",
  [TYPE_START]: "TYPE_START",
  [TYPE_END]: "TYPE_END"
};

export default class GameEvent {
  type = -1 as EventType;
  timestamp = 0 as number;
  constructor(type: EventType, ts: number) {
    this.type = type;
    this.timestamp = ts;
  }

  toString(): string {
    return `${typeToName[this.type]}: ${this.timestamp}`;
  }
}

export const EVENTS = {
  L_GOAL: () => new GameEvent(TYPE_L_GOAL, Date.now()),
  L_DEFENSE: () => new GameEvent(TYPE_L_DEFENSE, Date.now()),
  L_MIDDLE: () => new GameEvent(TYPE_L_MIDDLE, Date.now()),
  L_OFFENSE: () => new GameEvent(TYPE_L_OFFENSE, Date.now()),
  L_SHOT_AT_GOAL: () => new GameEvent(TYPE_L_SHOT_AT_GOAL, Date.now()),
  L_TIMEOUT: () => new GameEvent(TYPE_L_TIMEOUT, Date.now()),
  R_GOAL: () => new GameEvent(TYPE_R_GOAL, Date.now()),
  R_DEFENSE: () => new GameEvent(TYPE_R_DEFENSE, Date.now()),
  R_MIDDLE: () => new GameEvent(TYPE_R_MIDDLE, Date.now()),
  R_OFFENSE: () => new GameEvent(TYPE_R_OFFENSE, Date.now()),
  R_SHOT_AT_GOAL: () => new GameEvent(TYPE_R_SHOT_AT_GOAL, Date.now()),
  R_TIMEOUT: () => new GameEvent(TYPE_R_TIMEOUT, Date.now()),
  N_BALL_LOST: () => new GameEvent(TYPE_N_BALL_LOST, Date.now()),
  START: () => new GameEvent(TYPE_START, Date.now()),
  END: () => new GameEvent(TYPE_END, Date.now())
};

export const getTypes = (types: EventType[]) => (e: GameEvent) =>
  types.includes(e.type);
export const getType = (type: EventType) => getTypes([type]);

export const hasPrev = (
  events: GameEvent[],
  types: EventType[],
  prevType: EventType[]
) => {
  return events.filter((e, i, coll) => {
    return (
      i > 0 && types.includes(e.type) && prevType.includes(coll[i - 1].type)
    );
  });
};
