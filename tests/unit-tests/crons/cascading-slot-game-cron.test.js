import Chance from "chance";
import { stub, stubMongoose } from "jest-micro-auto-stub";
import mongoose from "mongoose";
import { CascadingBot, CascadingGameCron } from "sc-cascading-slot-base/src/crons";
import { FreeSpinsConsumer, SettleGameRoundConsumer, TotalMultiplierConsumer } from "sc-cascading-slot-base/src/event-consumers";
import { logger } from "sc-common";
import GameManagementApiClientFactory from "sc-game-base/src/core/game-management-api";
import { BoardGenerator } from "sc-slot-board-generator";
import { IdCountersConsumer } from "sc-slot-game-base/src/event-consumers";
import CascadingSlotGameCron from "../../../src/crons/cascading-slot-game-cron";
import { CascadingSlotTrialMode, TrialModeBoardGenerator } from "../../../src/trial-mode";

describe("gameCron", () => {
    const chance = new Chance();
    const definition = {
        name: "treasureIsland",
        durations: {
            wholeRound: 60,
        },
    };
    const gameData = {
        roundId: chance.natural(),
        gameConfigs: {
            cascadingSlotsConfig: {},
        },
    };

    const bot = stub(CascadingBot);
    const settleGameRoundConsumer = stub(SettleGameRoundConsumer);
    const freeSpinsConsumer = stub(FreeSpinsConsumer);
    const idCountersConsumer = stub(IdCountersConsumer);
    const gameStatusPublisher = {};
    const runningRoundInfoPublisher = {};
    const roundsRepository = stubMongoose(mongoose.Model);
    const archiveStatusesRepository = stubMongoose(mongoose.Model);
    const totalMultiplierConsumer = stub(TotalMultiplierConsumer);
    const cascadingSlotTrialMode = stub(CascadingSlotTrialMode);
    const trialModeBoardGenerator = stub(TrialModeBoardGenerator);
    const boardGenerator = stub(BoardGenerator);
    const gameManagementApiClientFactory = stub(GameManagementApiClientFactory);
    const gameManagementApiClient = {
        archiveStatus: {
            getArchiveStatus: jest.fn(),
        },
        aggregation: {
            getSettingForNewRound: jest.fn(),
        },
        exchangeRates: {
            getExchangeRates: jest.fn(),
        },
    };
    gameManagementApiClientFactory.instance.mockReturnValue(gameManagementApiClient);

    let gameCron;

    beforeEach(() => {
        gameCron = new CascadingSlotGameCron({
            definition,
            gameData,
            bot,
            settleGameRoundConsumer,
            freeSpinsConsumer,
            idCountersConsumer,
            gameStatusPublisher,
            runningRoundInfoPublisher,
            logService: logger,
            roundsRepository,
            archiveStatusesRepository,
            totalMultiplierConsumer,
            boardGenerator,
            cascadingSlotTrialMode,
            trialModeBoardGenerator,
            gameManagementApiClientFactory,
        });
    });

    it("should extend CascadingGameCron", () => {
        // Assert
        expect(gameCron instanceof CascadingGameCron);
    });

    describe("initTrialMode", () => {
        it("should call trialModeBoardGenerator.initialize", () => {
            // Act
            gameCron.initTrialMode();

            // Assert
            expect(trialModeBoardGenerator.initialize).toBeCalled();
        });
        it("should call cascadingSlotTrialMode.init", () => {
            // Act
            gameCron.initTrialMode();

            // Assert
            expect(cascadingSlotTrialMode.init).toBeCalledWith({ ...gameData.gameConfigs, name: definition.name });
        });
    });
});
