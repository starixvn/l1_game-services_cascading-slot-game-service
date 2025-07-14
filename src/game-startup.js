import { logger } from "sc-common";
import { Core } from "sc-game-base";

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
            await this.gameCron.start();
            this.processBetQueue.start();
        } catch (error) {
            logger.logError(error);
        }
    }
}
