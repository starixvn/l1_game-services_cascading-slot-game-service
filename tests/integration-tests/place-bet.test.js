import { GameClientDriver } from "sc-game-service-integration-utils";
import { gameConfigs } from "sc-base-database";

import { socketOptions } from "./stubs/test-data";
import { initUserSession } from "./helpers";
import mongoose from "mongoose";
import { middlewares } from "sc-common";
import configs from "../../src/app-configs.IGT";
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

    describe("when game disabled", () => {
        it("should return endBet=-1", async () => {
            // Arrange
            await new Promise((r) => setTimeout(r, 10000));
            const expectedEndBet = -1;

            // Act
            await middlewares.database.configureDatabase(mongoose, configs.database);
            await gameConfigs.updateOne({ name: "treasureisland" }, { enabled: false });
            await new Promise((r) => setTimeout(r, 61000));
            userClientDriver.emit("bet", { betLevel: 4, coinValue: 10, freeSpin: false });
            const result = await userClientDriver.handleGameEvent((data) => data.endBet);

            // Assert
            expect(result.endBet).toStrictEqual(expectedEndBet);
            await gameConfigs.updateOne({ name: "treasureisland" }, { enabled: true });
        });
    });

    afterAll(() => userClientDriver.close());
});
