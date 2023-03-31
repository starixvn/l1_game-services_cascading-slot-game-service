import { Core } from "sc-game-base";
import { logger } from "sc-common";

export default class GameStartup extends Core.BaseStartup {
    constructor(container) {
        super(container);

        this.cascadingSlotTrialMode = this.container.resolve("cascadingSlotTrialMode");
    }

    async start(app, socketServer) {
        const gameNameInSocketNamespace = this.definition.name.toLowerCase();
        this.initHttpRouter(app);
        socketServer.of(`/user/${gameNameInSocketNamespace}`).on("connection", (socketClient) => {
            this.initSocketRouter(socketClient);
        });

        socketServer.of(`/admin/${gameNameInSocketNamespace}`).on("connection", (socketClient) => {
            this.initAdminSocketRouter(socketClient);
        });

        socketServer.of(`/trial/${gameNameInSocketNamespace}`).on("connection", (socketClient) => {
            this.cascadingSlotTrialMode.registerSocketEvent(socketClient);
        });

        try {
            const gameConfigsRepository = this.container.resolve(this.dependencies.gameConfigsRepository);
            this.gameData.gameConfigs = await gameConfigsRepository.findOne({ name: this.definition.configName }).lean().exec();

            await this.gameCron.start();
            this.processBetQueue.start();
        } catch (error) {
            logger.logError(error);
        }
    }
}
