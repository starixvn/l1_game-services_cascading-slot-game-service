module.exports = async () => {
    return {
        rootDir: "./",
        verbose: true,
        transform: {
            "^.+\\.js?$": [
                "babel-jest",
                {
                    configFile: "./babel.config.cjs",
                },
            ],
        },
        transformIgnorePatterns: [
            "node_modules/(?!(sc-base-database|sc-common|sc-game-base|sc-base-apis|sc-api-client|sc-slot-game-base|sc-cascading-slot-base|sc-game-service-integration-utils|axios|sc-core-rng|sc-slot-board-generator)/)",
        ],
        testEnvironment: "node",
        testResultsProcessor: "jest-sonar-reporter",
        setupFilesAfterEnv: ["jest-extended"],
        reporters: [
            "default",
            ["jest-junit", { outputDirectory: "coverage" }],
            ["jest-html-reporters", { publicPath: "./reports", filename: "report.html" }],
        ],
        coverageReporters: ["clover", "lcov", "text-summary", "cobertura"],
        coverageDirectory: "coverage",
        moduleNameMapper: {
            "^node:(.*)$": "$1",
        },
    };
};
