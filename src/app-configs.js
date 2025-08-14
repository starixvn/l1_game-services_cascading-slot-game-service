export default {
    hostingPort: 5000,
    apiSettings: {
        enabledApi: true,
        apiUrl: "http://api.lumigame.com",
        authUrl: "http://auth.lumigame.com",
        client: {
            id: "game-server",
            secret: "gameserver@20luminet&",
        },
        useAuthenticate: false,
        requestTimeout: 10000,
        placeBetTimeout: 4000,
        hitJackpotTimeout: 200000,
        enableApiLogs: true,
    },
    notificationApiSettings: {
        url: "http://localhost:8004/api",
        auth: {
            url: "http://auth.lumigame.com",
            id: "game-services",
            secret: "gameservices@20luminet&",
        },
        requestTimeout: 10000,
        useAuthenticate: true,
    },
    socketOptions: {
        pingInterval: 60 * 1000,
        pingTimeout: 60 * 1000,
        transports: ["websocket"],
        allowUpgrades: false,
    },
    enabledLogs: true,
    database: {
        url: "mongodb://127.0.0.1:27017",
        options: {
            dbName: "minigame",
            useNewUrlParser: true,
            useUnifiedTopology: true,
            auto_reconnect: true,
        },
    },
    sentry: {
        sentryUrl: "https://8f52d1ed1dbc4500adddbfb6e20f66aa@sentryuat.sabagame.com/217",
        logIdentifier: "cascading-slot",
        env: "LOCAL",
    },
    authenticateSettings: {
        url: "http://l1-auth-api-local-service:5000",
        id: "game-services",
        secret: "gameservices@20luminet&",
        requestTimeout: 10000,
        useAuthenticate: false,
        audiences: ["api", "admin-api"],
    },
    userServiceSettings: {
        url: "http://localhost:8004/api",
    },
    adminSecretKey: "asWDEerfOIdgsdqRTFabvmgh",
    freeSpinLiveSeconds: 86400, // 1 day
    bonusLiveSeconds: 127,
    gameManagementApiSettings: {
        BASE: "https://l1-proxy.lumigame.com/game-management-service",
    },
    tracking: {
        baseUrl: "https://l1-proxy1.lumigame.com/user-tracking-api",
    },
};
