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
     * @param {mongoose.Model} dependencies.roundsRepository
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
        roundsRepository,
        totalMultiplierConsumer,
        boardGenerator,
        cascadingSlotTrialMode,
        trialModeBoardGenerator,
        roundIdConsumer,
        gameManagementApiClientFactory,
        promotionFreeSpinsConsumer,
    }) {
        super({
            definition,
            gameData,
            bot,
            settleGameRoundConsumer,
            gameStatusPublisher,
            runningRoundInfoPublisher,
            logService,
            roundsRepository,
            freeSpinsConsumer,
            idCountersConsumer,
            totalMultiplierConsumer,
            boardGenerator,
            roundIdConsumer,
            gameManagementApiClientFactory,
            promotionFreeSpinsConsumer,
        });

        this.cascadingSlotTrialMode = cascadingSlotTrialMode;
        this.trialModeBoardGenerator = trialModeBoardGenerator;
    }

    initTrialMode() {
        this.trialModeBoardGenerator.initialize();
        this.cascadingSlotTrialMode.init({ ...cloneDeep(this.gameData.gameConfigs), name: this.definition.name });
    }
}
