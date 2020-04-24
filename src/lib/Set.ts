import GameEvent, {
  getType,
  TYPE_START,
  TYPE_END,
  TYPE_L_GOAL,
  TYPE_R_GOAL
} from "./GameEvents";
import { v4 as uuidv4 } from "uuid";
import { GoalStatistics, GoalStat } from "./Game";

export class Set {
  id = "";
  number = -1;
  events = [] as GameEvent[];

  constructor(n: number, events = [] as GameEvent[]) {
    this.id = uuidv4();
    this.number = n;
    this.events = events;
  }

  startTime(): number {
    const start = this.events.find(getType(TYPE_START)) || ({} as GameEvent);
    return start.timestamp;
  }
  endTime(): number {
    const end = this.events.find(getType(TYPE_END)) || ({} as GameEvent);
    return end.timestamp;
  }

  finished() {
    const evt = this.events[this.events.length - 1];
    if (evt && evt.type == TYPE_END) {
      return true;
    }
    return false;
  }

  pushEvent(evt: GameEvent) {
    this.events.push(evt);
  }

  goalStatistics(): GoalStatistics {
    const out = {
      left: [] as GoalStat[],
      right: [] as GoalStat[]
    };
    let left = 0;
    let right = 0;
    if (this.events.length == 0) {
      return out;
    }

    const start = this.startTime();
    out.left.push({ value: 0, timestamp: start });
    out.right.push({ value: 0, timestamp: start });

    this.events.forEach(e => {
      if (e.type == TYPE_L_GOAL) {
        out.left.push({
          value: ++left,
          timestamp: e.timestamp
        });
        out.right.push({
          value: right,
          timestamp: e.timestamp
        });
      }
      if (e.type == TYPE_R_GOAL) {
        out.right.push({
          value: ++right,
          timestamp: e.timestamp
        });
        out.left.push({
          value: left,
          timestamp: e.timestamp
        });
      }
    });
    return out;
  }
}
