import cloneDeep from "lodash.clonedeep";
import { CascadingGameCron } from "sc-cascading-slot-base/src/crons";
import CascadingSlotTrialMode from "../trial-mode/cascading-slot-trial-mode";

export default class CascadingSlotGameCron extends CascadingGameCron {
    /**
     * @param {Object} dependencies
     * @param {SlotGameDefinition} dependencies.definition
     * @param {SlotGameData} dependencies.gameData
     * @param {SlotGameBot} dependencies.bot
     * @param {EventConsumers.SettleGameRoundConsumer} dependencies.settleGameRoundConsumer
     * @param {EventConsumers.FreeSpinsConsumer} dependencies.freeSpinsConsumer
     * @param {EventConsumers.IdCountersConsumer} dependencies.idCountersConsumer
     * @param {Core.BaseEventPublishers.GameStatusPublisher} dependencies.gameStatusPublisher
     * @param {Core.BaseEventPublishers.RunningRoundInfoPublisher} dependencies.runningRoundInfoPublisher
     * @param {logger} dependencies.logService
     * @param {mongoose.Model} dependencies.gameConfigsRepository
     * @param {mongoose.Model} dependencies.roundsRepository
     * @param {mongoose.Model} dependencies.archiveStatusesRepository
     * @param {mongoose.Model} dependencies.notificationRepository
     * @param {mongoose.Model} dependencies.exchangeRatesRepository
     * @param {mongoose.Model} dependencies.partnerConfigRepository
     * @param {TotalMultiplierConsumer} dependencies.totalMultiplierConsumer
     * @param {CascadingSlotTrialMode} dependencies.CascadingSlotTrialMode
     * @param {TrialModeBoardGenerator} dependencies.TrialModeBoardGenerator
     */
    constructor({
        definition,
        gameData,
        bot,
        settleGameRoundConsumer,
        freeSpinsConsumer,
        idCountersConsumer,
        gameStatusPublisher,
        runningRoundInfoPublisher,
        logService,
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
    }) {
        super({
            definition,
            gameData,
            bot,
            settleGameRoundConsumer,
            gameStatusPublisher,
            runningRoundInfoPublisher,
            logService,
            gameConfigsRepository,
            roundsRepository,
            archiveStatusesRepository,
            notificationRepository,
            exchangeRatesRepository,
            currencyGroupGamesRepository,
            partnerConfigRepository,
            currencyGroupRepository,
            currencyRepository,
            freeSpinsConsumer,
            idCountersConsumer,
            totalMultiplierConsumer,
            boardGenerator,
        });

        this.cascadingSlotTrialMode = cascadingSlotTrialMode;
        this.trialModeBoardGenerator = trialModeBoardGenerator;
    }

    initTrialMode() {
        this.trialModeBoardGenerator.initialize();
        this.cascadingSlotTrialMode.init({ ...cloneDeep(this.gameData.gameConfigs), name: this.definition.name });
    }

    async updateCurrencyGroupGames() {
        this.gameData.currencyGroupGames = await this.currencyGroupGamesRepository
            .find({ gameId: this.definition.id, enabled: true }, "groupId minBet maxBet maxBetPerChoices chips coinValues maxWinPerRound defaultCoinValue")
            .lean()
            .exec();
    }
}
