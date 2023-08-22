import { CascadingSlotTrialMode, TrialModeRoundCalculator } from "../../../src/trial-mode";
import { stub } from "jest-micro-auto-stub";
import { logger } from "sc-common";

jest.mock("sc-trial-mode");

describe("trialMode", () => {
    let cascadingSlotTrialMode;

    const trialModeRoundCalculator = stub(TrialModeRoundCalculator);
    const logService = stub(logger);

    beforeEach(() => {
        cascadingSlotTrialMode = new CascadingSlotTrialMode(trialModeRoundCalculator, logService);
    });

    describe("init", () => {
        it("should call trialMode.init", () => {
            // Arrange
            const config = {};

            // Act
            cascadingSlotTrialMode.init(config);

            // Assert
            expect(cascadingSlotTrialMode.trialMode.init).toBeCalledWith(config);
        });
    });

    describe("registerSocketEvent", () => {
        it("should call trialMode.registerSocketEvent", () => {
            // Arrange
            const socketClient = {};

            // Act
            cascadingSlotTrialMode.registerSocketEvent(socketClient);

            // Assert
            expect(cascadingSlotTrialMode.trialMode.registerSocketHandler).toBeCalledWith(socketClient);
        });
    });
});
