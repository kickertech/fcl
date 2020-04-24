export type GameStatistics = {
  left: {
    goals: {
      sum: number;
      fromMiddle: number;
      fromOffense: number;
      fromDefense: number;
    };
    atGoal: {
      sum: number;
      fromMiddle: number;
      fromOffense: number;
      fromDefense: number;
    };
    pass: number;
    defensiveOdds: number;
    offensiveOdds: number;
  };
  right: {
    goals: {
      sum: number;
      fromMiddle: number;
      fromOffense: number;
      fromDefense: number;
    };
    atGoal: {
      sum: number;
      fromMiddle: number;
      fromOffense: number;
      fromDefense: number;
    };
    pass: number;
    defensiveOdds: number;
    offensiveOdds: number;
  };
};
