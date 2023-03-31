import { RoundCalculator } from "sc-cascading-slot-base/src/board";
import { TrialModeRoundCalculator } from "../../../src/trial-mode";

describe("TrialModeRoundCalculator", () => {
    it("should be instance of RoundCalculator", () => {
        // Act
        const trialModeRoundCalculator = new TrialModeRoundCalculator({});

        // Assert
        expect(trialModeRoundCalculator instanceof RoundCalculator);
    });
});
