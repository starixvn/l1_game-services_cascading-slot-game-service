export default {
    hostingPort: 5000,
    apiSettings: {
        enabledApi: true,
        apiUrl: "https://l2-proxy2.lumigame.com/game-api",
        authUrl: "https://l2-auth2.lumigame.com/",
        client: {
            id: "game-server",
            secret: "gameserver@20luminet&",
        },

        useAuthenticate: true,
        requestTimeout: 10000,
        placeBetTimeout: 4000,
        hitJackpotTimeout: 200000,
        enabledApiLogs: true,
    },
    authenticateSettings: {
        url: "https://l2-auth2.lumigame.com/",
        id: "game-services",
        secret: "gameservices@20luminet&",
        requestTimeout: 10000,
        useAuthenticate: true,
        audiences: ["api", "admin-api"],
    },
    notificationApiSettings: {
        url: "https://l2-proxy2.lumigame.com/notification/api",
    },
    socketOptions: {
        pingInterval: 60 * 1000,
        pingTimeout: 60 * 1000,
        transports: ["websocket"],
        allowUpgrades: false,
    },
    enabledLogs: true,
    database: {
        url: "mongodb://lmn_backend:LmnBackend@10.10.50.12:39202,10.10.50.13:39202,10.10.50.14:39202/?replicaSet=L2ppLocal",
        options: {
            dbName: "minigame",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    sentry: {
        sentryUrl: "https://8f52d1ed1dbc4500adddbfb6e20f66aa@sentryuat.sabagame.com/217",
        logIdentifier: "cascading-slot",
        env: "LOCAL",
    },
    userServiceSettings: {
        url: "https://l2-proxy2.lumigame.com/user",
    },
    adminSecretKey: "asWDEerfOIdgsdqRTFabvmgh",
    freeSpinLiveSeconds: 55 * 60, // 55 minutes
    bonusLiveSeconds: 127,
    gameManagementApiSettings: {
        BASE: "https://l2-proxy2.lumigame.com/game-management-service",
    },
    promotionApiSettings: {
        baseUrl: "https://l2-proxy2.lumigame.com/game-promotion-api/",
        timeout: 5000,
        useAuthentication: false,
    },
    trackingApiSettings: {
        baseUrl: "https://l2-proxy2.lumigame.com/user-tracking-api",
    },
    resultChains: {
        maxChains: 300, // Total chains loaded from DB
        maxPlayerChains: 20, // Max active assignments in memory
        memoryExpirationMinutes: 30, // Auto-cleanup threshold
        assignment: {
            minPlayableBoards: 40, // Min boards for assignment
            maxBoards: 125, // Max applicable boards
            boardsMultiplier: 0.25, // 25% bonus calculation
            boardRange: [50, 75, 100, 125], // Valid counts
        },
    },
};
