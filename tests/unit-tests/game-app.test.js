import { createContainer } from "awilix";
import GameApp from "../../src/game-app";
import { Core } from "sc-game-base";

jest.mock("../../src/game-startup");

describe("gameApp", () => {
    const appConfigs = {};
    const serviceName = "TreasureIsland";
    const baseMetrics = {};
    const container = createContainer();

    let gameApp;

    beforeEach(() => {
        gameApp = new GameApp(serviceName, appConfigs, baseMetrics);
    });

    it("should be instance of Core.BaseGameApp", () => {
        // Assert
        expect(gameApp instanceof Core.BaseGameApp);
    });

    describe("startGame", () => {
        beforeEach(() => {
            container.register = jest.fn();
        });

        it("should call container.register", async () => {
            // Act
            await gameApp.startGame(container);

            // Assert
            expect(container.register).toBeCalled();
        });
    });
});
