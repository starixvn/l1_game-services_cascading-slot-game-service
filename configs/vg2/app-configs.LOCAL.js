export default {
    hostingPort: 5000,
    apiSettings: {
        enabledApi: true,
        apiUrl: "http://l2-game-api-local-service:5000",
        authUrl: "http://l2-auth-api-local-service:5000",
        client: {
            id: "game-server",
            secret: "gameserver@20luminet&",
        },
        useAuthenticate: true,
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
        url: "mongodb://lmn_backend:LmnBackend@10.10.50.12:39200,10.10.50.13:39200,10.10.50.14:39200/?replicaSet=L2Local",
        options: {
            dbName: "minigame",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    sentry: {
        sentryUrl: "https://8eb9632f2663e57c838ec83febbee14f@sentry-k8s.lumigame.com/4",
        logIdentifier: "cascading-slot",
        env: "LOCAL",
    },
    authenticateSettings: {
        url: "http://l2-auth-api-local-service:5000",
        id: "game-services",
        secret: "gameservices@20luminet&",
        requestTimeout: 10000,
        useAuthenticate: true,
        audiences: ["api", "admin-api"],
    },
    userServiceSettings: {
        url: "http://l2-user-service-local-service:5000",
    },
    adminSecretKey: "asWDEerfOIdgsdqRTFabvmgh",
    freeSpinLiveSeconds: 55 * 60, // 55 minutes
    bonusLiveSeconds: 127,
    otel: {
        system: "VG",
        enabled: true,
        endpoint: "http://10.10.50.69:4318/v1/traces",
    },
    gameManagementApiSettings: {
        BASE: "http://l2-game-management-service-local-service:5000",
    },
    trackingApiSettings: {
        baseUrl: "http://l2-user-tracking-api-local2-service:5000",
    },
    promotionApiSettings: {
        baseUrl: "http://l2-game-promotion-api-local-service:5000",
        timeout: 5000,
        useAuthentication: false,
    },
};
