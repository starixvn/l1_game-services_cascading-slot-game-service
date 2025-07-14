import mongoose from "mongoose";
import { middlewares } from "sc-common";
import configs from "../../src/app-configs.IGT";
import { totalMultipliers } from "../../src/models";
import { playerFreeSpins } from "./stubs/test-data";
const JEST_ASSERT_WAITING_RESPONSE_TIMEOUT = 80000;

const TreasureIslandTotalMultipliers = totalMultipliers("treasureisland");

describe("event expire freeSpin", () => {
    const playerFreeSpin = playerFreeSpins[0];

    describe("when freeSpin expired", () => {
        beforeAll(async () => {
            await middlewares.database.configureDatabase(mongoose, configs.database);
        });
        beforeEach(() => {
            jest.setTimeout(JEST_ASSERT_WAITING_RESPONSE_TIMEOUT);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it("should stop total multiplier chain", async () => {
            // Act
            await new Promise((r) => setTimeout(r, 61000));
            const actualResult = await TreasureIslandTotalMultipliers.find({
                uid: playerFreeSpin.uid,
                ended: false,
            });

            // Assert
            expect(actualResult.length).toBe(0);
        });
    });
});
