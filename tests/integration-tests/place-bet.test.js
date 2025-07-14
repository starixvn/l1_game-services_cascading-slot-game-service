import { GameClientDriver } from "sc-game-service-integration-utils";

import { initUserSession } from "./helpers";
import { socketOptions } from "./stubs/test-data";
import { placeBetUser } from "./stubs/user-stub";

const JEST_ASSERT_WAITING_RESPONSE_TIMEOUT = 80000;

describe("event place bet", () => {
    let userClientDriver;

    beforeAll(async () => {
        jest.setTimeout(JEST_ASSERT_WAITING_RESPONSE_TIMEOUT);
        userClientDriver = new GameClientDriver(socketOptions, initUserSession(placeBetUser));
        await userClientDriver.handleSignedInEvent();
        userClientDriver.sendInGameEvent();
    });

    describe("when game enabled", () => {
        it("should return endBet info", async () => {
            // Arrange
            const expectedEndBet = 600;

            // Act
            userClientDriver.emit("bet", { betLevel: 3, coinValue: 10, freeSpin: false });
            const result = await userClientDriver.handleGameEvent((data) => data.endBet);

            // Assert
            expect(result.endBet).toStrictEqual(expectedEndBet);
        });
    });

    afterAll(() => userClientDriver.close());
});
