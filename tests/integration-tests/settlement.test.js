import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";
import { socketOptions } from "./stubs/test-data";
import { initUserSession } from "./helpers";
const JEST_ASSERT_WAITING_RESPONSE_TIMEOUT = 80000;

describe("when client sends place bet request", () => {
    beforeAll(() => {
        jest.setTimeout(JEST_ASSERT_WAITING_RESPONSE_TIMEOUT);
    });

    let driver;
    beforeEach((done) => {
        driver = new GameClientDriver(socketOptions, initUserSession(normalUser));
        driver.handleSignedInEvent(() => {
            driver.sendInGameEvent();
            done();
        });
    });

    afterEach(() => {
        driver.close();
    });

    it("should return finish", (done) => {
        //Act
        driver.emit("bet", { betLevel: 1, coinValue: 1, totalBet: 20, freeSpin: false });

        //Assert
        driver.on(driver.gameName, (data) => {
            if (data.finish) {
                expect(data.finish.result).not.toBeNull();
                done();
            }
        });
    });

    it("should return endBet", (done) => {
        //Act
        driver.emit("bet", { betLevel: 1, coinValue: 1, totalBet: 20, freeSpin: false });

        //Assert
        driver.on(driver.gameName, (data) => {
            expect(data.endBet).not.toBeNull();
            done();
        });
    });
});
