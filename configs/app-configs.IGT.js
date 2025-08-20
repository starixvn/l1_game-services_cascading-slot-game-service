export default {
    hostingPort: 5001,
    apiSettings: {
        enabledApi: true,
        apiUrl: "http://l1-game-api-local-service:5000",
        authUrl: "http://l1-auth-api-local-service:5000",
        client: {
            id: "game-server",
            secret: "gameserver@20luminet&",
        },
        useAuthenticate: false,
        requestTimeout: 10000,
        placeBetTimeout: 4000,
        enabledApiLogs: true,
    },
    socketOptions: {
        pingInterval: 60 * 1000,
        pingTimeout: 60 * 1000,
        transports: ["websocket"],
        allowUpgrades: false,
        perMessageDeflate: false,
    },
    enabledLogs: true,
    database: {
        url: "mongodb://mongo:27017",
        options: {
            dbName: "game-service-test-db",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    sentry: {
        sentryUrl: "",
        logIdentifier: "cascading-slot",
        env: "DEV",
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
    enableMsgpackParser: false,
    gameManagementApiSettings: {
        BASE: "https://l1-proxy.lumigame.com/game-management-service-igt-test",
    },
    trackingApiSettings: {
        baseUrl: "https://l1-proxy.lumigame.com/user-tracking-api",
    },
};
