import GameEvent, {
  getType,
  hasPrev,
  TYPE_L_GOAL,
  TYPE_R_GOAL,
  TYPE_START,
  TYPE_END,
  TYPE_L_SHOT_AT_GOAL,
  TYPE_L_OFFENSE,
  TYPE_L_DEFENSE,
  TYPE_L_MIDDLE,
  TYPE_R_SHOT_AT_GOAL,
  TYPE_R_OFFENSE,
  TYPE_R_DEFENSE,
  TYPE_R_MIDDLE
} from "./GameEvents";

import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import { GameStatistics } from "./Statistics";
import { Set } from "./Set";

export type GameResult = {
  leftGoals: number;
  rightGoals: number;
};

export type GoalStat = {
  // the number of goals at a given timestamp
  value: number;
  timestamp: number;
};

// GoalStatistics is an aggregated view of game events
// to make plotting easier
export type GoalStatistics = {
  left: GoalStat[];
  right: GoalStat[];
};

export type GAME_STATE = number;
export const GAME_STATE_NOT_STARTED: GAME_STATE = 0;
export const GAME_STATE_IN_PROGRESS: GAME_STATE = 1;
export const GAME_STATE_ENDED: GAME_STATE = 2;

export default class Game {
  id = "";
  leftTeam = "";
  rightTeam = "";
  sets = [new Set(1)];
  setIdx = 0;
  state = GAME_STATE_NOT_STARTED as GAME_STATE;

  constructor(
    id = uuidv4(),
    leftTeam: string,
    rightTeam: string,
    sets = [new Set(1)],
    state = GAME_STATE_NOT_STARTED
  ) {
    this.id = id;
    this.leftTeam = leftTeam;
    this.rightTeam = rightTeam;
    this.sets = sets;
    this.state = state;
  }

  pushEvent(evt: GameEvent) {
    if (evt.type == TYPE_START && this.sets[this.setIdx].finished()) {
      this.state = GAME_STATE_IN_PROGRESS;
    } else if (evt.type == TYPE_END) {
      this.state = GAME_STATE_ENDED;
    }

    if (evt.type == TYPE_START && this.sets[this.setIdx].finished()) {
      ++this.setIdx;
      this.sets[this.setIdx] = new Set(this.setIdx + 1);
    }
    this.sets[this.setIdx].pushEvent(evt);
  }

  name(): string {
    return `${this.leftTeam} vs. ${this.rightTeam}`;
  }

  startTime(): number {
    return this.sets[0].startTime() || Date.now();
  }

  endTime(): number {
    return this.sets[this.sets.length - 1].endTime();
  }

  getCurrentSet() {
    return this.sets[this.setIdx];
  }

  getStatistics() {
    const out = {
      total: {} as GameStatistics,
      sets: [] as GameStatistics[]
    };

    this.sets.forEach(set => {
      out.sets.push({
        left: {
          goals: {
            sum: set.events.filter(getType(TYPE_L_GOAL)).length,
            fromMiddle: hasPrev(set.events, [TYPE_L_GOAL], [TYPE_L_MIDDLE])
              .length,
            fromOffense: hasPrev(set.events, [TYPE_L_GOAL], [TYPE_L_OFFENSE])
              .length,
            fromDefense: hasPrev(set.events, [TYPE_L_GOAL], [TYPE_L_DEFENSE])
              .length
          },
          atGoal: {
            sum: set.events.filter(getType(TYPE_L_SHOT_AT_GOAL)).length,
            fromMiddle: hasPrev(
              set.events,
              [TYPE_L_SHOT_AT_GOAL],
              [TYPE_L_MIDDLE]
            ).length,
            fromOffense: hasPrev(
              set.events,
              [TYPE_L_SHOT_AT_GOAL],
              [TYPE_L_OFFENSE]
            ).length,
            fromDefense: hasPrev(
              set.events,
              [TYPE_L_SHOT_AT_GOAL],
              [TYPE_L_DEFENSE]
            ).length
          },
          pass: hasPrev(
            set.events,
            [TYPE_L_OFFENSE],
            [TYPE_L_DEFENSE, TYPE_L_MIDDLE]
          ).length,
          defensiveOdds: 0.0,
          offensiveOdds: 0.0
        },
        right: {
          goals: {
            sum: set.events.filter(getType(TYPE_R_GOAL)).length,
            fromMiddle: hasPrev(set.events, [TYPE_R_GOAL], [TYPE_R_MIDDLE])
              .length,
            fromOffense: hasPrev(set.events, [TYPE_R_GOAL], [TYPE_R_OFFENSE])
              .length,
            fromDefense: hasPrev(set.events, [TYPE_R_GOAL], [TYPE_R_DEFENSE])
              .length
          },
          atGoal: {
            sum: set.events.filter(getType(TYPE_R_SHOT_AT_GOAL)).length,
            fromMiddle: hasPrev(
              set.events,
              [TYPE_R_SHOT_AT_GOAL],
              [TYPE_R_MIDDLE]
            ).length,
            fromOffense: hasPrev(
              set.events,
              [TYPE_R_SHOT_AT_GOAL],
              [TYPE_R_OFFENSE]
            ).length,
            fromDefense: hasPrev(
              set.events,
              [TYPE_R_SHOT_AT_GOAL],
              [TYPE_R_DEFENSE]
            ).length
          },
          pass: hasPrev(
            set.events,
            [TYPE_R_OFFENSE],
            [TYPE_R_DEFENSE, TYPE_R_MIDDLE]
          ).length,
          defensiveOdds: 0.0,
          offensiveOdds: 0.0
        }
      });
    });

    const allEvents = _.flatten(
      Object.keys(this.sets).map((i, n) => {
        return this.sets[n].events;
      })
    );

    out.total = {
      left: {
        goals: {
          sum: allEvents.filter(getType(TYPE_L_GOAL)).length,
          fromMiddle: hasPrev(allEvents, [TYPE_L_GOAL], [TYPE_L_MIDDLE]).length,
          fromOffense: hasPrev(allEvents, [TYPE_L_GOAL], [TYPE_L_OFFENSE])
            .length,
          fromDefense: hasPrev(allEvents, [TYPE_L_GOAL], [TYPE_L_DEFENSE])
            .length
        },
        atGoal: {
          sum: allEvents.filter(getType(TYPE_L_SHOT_AT_GOAL)).length,
          fromMiddle: hasPrev(allEvents, [TYPE_L_SHOT_AT_GOAL], [TYPE_L_MIDDLE])
            .length,
          fromOffense: hasPrev(
            allEvents,
            [TYPE_L_SHOT_AT_GOAL],
            [TYPE_L_OFFENSE]
          ).length,
          fromDefense: hasPrev(
            allEvents,
            [TYPE_L_SHOT_AT_GOAL],
            [TYPE_L_DEFENSE]
          ).length
        },
        pass: hasPrev(
          allEvents,
          [TYPE_L_OFFENSE],
          [TYPE_L_DEFENSE, TYPE_L_MIDDLE]
        ).length,
        defensiveOdds: 0.0,
        offensiveOdds: 0.0
      },
      right: {
        goals: {
          sum: allEvents.filter(getType(TYPE_R_GOAL)).length,
          fromMiddle: hasPrev(allEvents, [TYPE_R_GOAL], [TYPE_R_MIDDLE]).length,
          fromOffense: hasPrev(allEvents, [TYPE_R_GOAL], [TYPE_R_OFFENSE])
            .length,
          fromDefense: hasPrev(allEvents, [TYPE_R_GOAL], [TYPE_R_DEFENSE])
            .length
        },
        atGoal: {
          sum: allEvents.filter(getType(TYPE_R_SHOT_AT_GOAL)).length,
          fromMiddle: hasPrev(allEvents, [TYPE_R_SHOT_AT_GOAL], [TYPE_R_MIDDLE])
            .length,
          fromOffense: hasPrev(
            allEvents,
            [TYPE_R_SHOT_AT_GOAL],
            [TYPE_R_OFFENSE]
          ).length,
          fromDefense: hasPrev(
            allEvents,
            [TYPE_R_SHOT_AT_GOAL],
            [TYPE_R_DEFENSE]
          ).length
        },
        pass: hasPrev(
          allEvents,
          [TYPE_R_OFFENSE],
          [TYPE_R_DEFENSE, TYPE_R_MIDDLE]
        ).length,
        defensiveOdds: 0.0,
        offensiveOdds: 0.0
      }
    };

    return out;
  }

  result(): GameResult {
    return {
      leftGoals: this.sets[0].events.filter(getType(TYPE_L_GOAL)).length,
      rightGoals: this.sets[0].events.filter(getType(TYPE_R_GOAL)).length
    };
  }

  static fromJSON(obj: any): Game {
    return new Game(
      obj.id,
      obj.leftTeam,
      obj.rightTeam,
      obj.sets.map(
        (set: any) =>
          new Set(
            set.number,
            set.events.map((e: any) => new GameEvent(e.type, e.timestamp))
          )
      ),
      obj.state
    );
  }
}
