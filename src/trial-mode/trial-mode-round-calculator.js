import { RoundCalculator } from "sc-cascading-slot-base/src/board";

export default class TrialModeRoundCalculator extends RoundCalculator {
    constructor({ trialModeBoardGenerator, tumbleCalculator }) {
        super({ boardGenerator: trialModeBoardGenerator, tumbleCalculator });
    }
}
