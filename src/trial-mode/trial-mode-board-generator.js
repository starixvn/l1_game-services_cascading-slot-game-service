import { CascadingBoardGenerator } from "sc-cascading-slot-base/src/board";

export const trialModeBoardSettings = {
    reels: 6,
    symbolsOnReel: 5,
    numberOfSymbols: 11,
    numberOfShuffles: 3,
    difficulty: 4,
};

export default class TrialModeBoardGenerator extends CascadingBoardGenerator {
    constructor(definition, gameData, boardSettings, logService) {
        super(definition, gameData, trialModeBoardSettings, logService);
    }
}
