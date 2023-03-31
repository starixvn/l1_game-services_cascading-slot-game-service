import { createContainer } from "awilix";
import { when } from "jest-when";
import { Core } from "sc-game-base";
import GameStartup from "../../src/game-startup";
import CascadingSlotTrialMode from "../../src/trial-mode/cascading-slot-trial-mode";
import { stub, stubMongoose } from "jest-micro-auto-stub";
import mongoose from "mongoose";

describe("GameStartup", () => {
    const container = createContainer();
    const cascadingSlotTrialMode = stub(CascadingSlotTrialMode);
    const gameConfigsRepository = stubMongoose(mongoose.Model);
    const definition = { name: "treasureisland" };
    const app = {};
    const gameCron = { start: jest.fn() };
    const processBetQueue = { start: jest.fn() };
    const socketServer = {
        of: jest.fn().mockReturnValue({ on: jest.fn() }),
    };

    let gameStartup;

    beforeEach(() => {
        container.resolve = jest.fn();

        container.resolve.mockReturnValue({});

        when(container.resolve).calledWith("definition").mockReturnValue(definition);
        when(container.resolve).calledWith("gameCron").mockReturnValue(gameCron);
        when(container.resolve).calledWith("processBetQueue").mockReturnValue(processBetQueue);
        when(container.resolve).calledWith("cascadingSlotTrialMode").mockReturnValue(cascadingSlotTrialMode);
        when(container.resolve).calledWith("gameConfigsRepository").mockReturnValue(gameConfigsRepository);

        gameStartup = new GameStartup(container);
    });

    it("should be instance of Core.BaseStartup", () => {
        // Assert
        expect(gameStartup instanceof Core.BaseStartup);
    });

    describe("start", () => {
        beforeEach(() => {
            gameStartup.initHttpRouter = jest.fn();
            gameStartup.initSocketRouter = jest.fn();
            gameStartup.initAdminSocketRouter = jest.fn();
        });

        it("should call initHttpRouter", async () => {
            // Act
            await gameStartup.start(app, socketServer);

            // Assert
            expect(gameStartup.initHttpRouter).toBeCalledWith(app);
        });

        it("should register socket namespace user", async () => {
            // Act
            await gameStartup.start(app, socketServer);

            // Assert
            expect(socketServer.of).toHaveBeenNthCalledWith(1, `/user/${definition.name}`);
        });

        it("should register socket namespace user", async () => {
            // Act
            await gameStartup.start(app, socketServer);

            // Assert
            expect(socketServer.of).toHaveBeenNthCalledWith(1, `/user/${definition.name}`);
        });

        it("should register socket namespace admin", async () => {
            // Act
            await gameStartup.start(app, socketServer);

            // Assert
            expect(socketServer.of).toHaveBeenNthCalledWith(2, `/admin/${definition.name}`);
        });

        it("should register socket namespace trial", async () => {
            // Act
            await gameStartup.start(app, socketServer);

            // Assert
            expect(socketServer.of).toHaveBeenNthCalledWith(3, `/trial/${definition.name}`);
        });

        it("should get gameConfigs", async () => {
            // Arrange
            const gameConfigs = {
                id: 47,
            };
            gameConfigsRepository.findOne().lean().exec.mockResolvedValue(gameConfigs);

            // Act
            await gameStartup.start(app, socketServer);

            // Assert
            expect(gameStartup.gameData.gameConfigs).toStrictEqual(gameConfigs);
        });

        it("should call gameCron.start", async () => {
            // Act
            await gameStartup.start(app, socketServer);

            // Assert
            expect(gameCron.start).toBeCalled();
        });

        it("should call processBetQueue.start", async () => {
            // Act
            await gameStartup.start(app, socketServer);

            // Assert
            expect(processBetQueue.start).toBeCalled();
        });
    });
});
