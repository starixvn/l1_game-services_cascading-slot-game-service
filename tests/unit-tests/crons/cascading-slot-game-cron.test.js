import mongoose from "mongoose";
import { stub, stubMongoose } from "jest-micro-auto-stub";
import { logger } from "sc-common";
import CascadingSlotGameCron from "../../../src/crons/cascading-slot-game-cron";
import { SettleGameRoundConsumer, FreeSpinsConsumer, TotalMultiplierConsumer } from "sc-cascading-slot-base/src/event-consumers";
import { CascadingGameCron, CascadingBot } from "sc-cascading-slot-base/src/crons";
import { IdCountersConsumer } from "sc-slot-game-base/src/event-consumers";
import { BoardGenerator } from "sc-slot-board-generator";
import { TrialModeBoardGenerator, CascadingSlotTrialMode } from "../../../src/trial-mode";
import Chance from "chance";

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
    const gameConfigsRepository = stubMongoose(mongoose.Model);
    const roundsRepository = stubMongoose(mongoose.Model);
    const currencyGroupGamesRepository = stubMongoose(mongoose.Model);
    const currencyGroupRepository = stubMongoose(mongoose.Model);
    const currencyRepository = stubMongoose(mongoose.Model);
    const archiveStatusesRepository = stubMongoose(mongoose.Model);
    const notificationRepository = stubMongoose(mongoose.Model);
    const exchangeRatesRepository = stubMongoose(mongoose.Model);
    const partnerConfigRepository = stubMongoose(mongoose.Model);
    const totalMultiplierConsumer = stub(TotalMultiplierConsumer);
    const cascadingSlotTrialMode = stub(CascadingSlotTrialMode);
    const trialModeBoardGenerator = stub(TrialModeBoardGenerator);
    const boardGenerator = stub(BoardGenerator);

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
            gameConfigsRepository,
            roundsRepository,
            archiveStatusesRepository,
            notificationRepository,
            exchangeRatesRepository,
            currencyGroupGamesRepository,
            partnerConfigRepository,
            currencyGroupRepository,
            currencyRepository,
            totalMultiplierConsumer,
            boardGenerator,
            cascadingSlotTrialMode,
            trialModeBoardGenerator,
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
