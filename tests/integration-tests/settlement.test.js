import axios from "axios";
import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";
import { initUserSession } from "./helpers";
import { socketOptions } from "./stubs/test-data";
const JEST_ASSERT_WAITING_RESPONSE_TIMEOUT = 80000;

const setResult = async (result) => {
    await axios.post("http://localhost:5001/igt-api/set-board", {
        name: normalUser.playerName,
        result,
    });
};

describe("Settlement tests", () => {
    beforeAll(() => {
        jest.setTimeout(JEST_ASSERT_WAITING_RESPONSE_TIMEOUT);
    });

    let userClientDriver;
    beforeEach(async () => {
        userClientDriver = new GameClientDriver(socketOptions, initUserSession(normalUser));
        await userClientDriver.handleSignedInEvent();
        userClientDriver.sendInGameEvent();
    });

    afterEach(() => {
        userClientDriver.close();
    });

    describe("when sending place bet request", () => {
        it("should return finish", async () => {
            //Act
            userClientDriver.emit("bet", { betLevel: 1, coinValue: 1, totalBet: 20, freeSpin: false });
            const result = await userClientDriver.handleGameEvent((data) => data.finish);
            //Assert
            expect(result.finish.result).not.toBeNull();
        });

        it("should return endBet with correct value", async () => {
            //Act
            userClientDriver.emit("bet", { betLevel: 1, coinValue: 1, totalBet: 20, freeSpin: false });
            const result = await userClientDriver.handleGameEvent((data) => data.endBet);

            //Assert
            expect(result.endBet).toStrictEqual(20);
        });
    });

    describe("when user gets bigwin", () => {
        it("bigWin should be true", async () => {
            //Arrange
            await setResult({
                base: {
                    board: [1, 3, 2, 2, 1, 2, 1, 3, 3, 3, 3, 2, 3, 3, 0, 2, 2, 1, 3, 3, 3, 2, 2, 3, 2, 1, 2, 0, 1, 0],
                    multipliers: [],
                },
                tumbles: [
                    {
                        newSymbols: [3, 2, 3, 10, 3, 3, 3, 2, 3, 3, 2, 2, 2, 2, 3, 3, 2, 2, 2, 2, 3],
                        multipliers: [6],
                    },
                    {
                        newSymbols: [9, 6, 5, 4, 0, 4, 0, 3, 7, 5, 8, 7, 0, 8, 3, 4, 6, 2, 8, 2],
                        multipliers: [],
                    },
                ],
            });

            //Act
            userClientDriver.emit("bet", { betLevel: 1, coinValue: 1, totalBet: 20, freeSpin: false });
            const result = await userClientDriver.handleGameEvent((data) => data.finish);
            //Assert
            expect(result.finish.bigWin).toBeTruthy();
        });
    });

    describe("when user gets multiplier", () => {
        it("multiplier should be correct", async () => {
            //Arrange
            await setResult({
                base: {
                    board: [1, 3, 2, 2, 1, 2, 1, 3, 3, 3, 3, 2, 3, 3, 0, 2, 2, 1, 3, 3, 3, 2, 2, 3, 2, 1, 2, 0, 1, 0],
                    multipliers: [],
                },
                tumbles: [
                    {
                        newSymbols: [3, 2, 3, 10, 3, 3, 3, 2, 3, 3, 2, 2, 2, 2, 3, 3, 2, 2, 2, 2, 3],
                        multipliers: [2],
                    },
                    {
                        newSymbols: [9, 6, 5, 4, 0, 4, 0, 3, 7, 5, 8, 7, 0, 8, 3, 4, 6, 2, 8, 2],
                        multipliers: [],
                    },
                ],
            });

            //Act
            userClientDriver.emit("bet", { betLevel: 1, coinValue: 1, totalBet: 20, freeSpin: false });
            const result = await userClientDriver.handleGameEvent((data) => data.finish);
            //Assert
            expect(result.finish.multiplier).toStrictEqual(2);
        });
    });

    describe("when user gets free spin", () => {
        it("freespin should be greater than 0", async () => {
            //Arrange
            await setResult({
                base: {
                    board: [2, 3, 9, 3, 1, 4, 4, 4, 4, 0, 2, 4, 3, 9, 1, 0, 0, 1, 0, 2, 0, 9, 2, 9, 3, 3, 1, 3, 1, 0],
                    multipliers: [],
                },
                tumbles: [],
            });

            //Act
            userClientDriver.emit("bet", { betLevel: 1, coinValue: 1, totalBet: 20, freeSpin: false });
            const result = await userClientDriver.handleGameEvent((data) => data.finish);
            //Assert
            expect(result.finish.freeSpins).toBeGreaterThan(0);
        });
    });
});
