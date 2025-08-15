module.exports = async () => {
    return {
        rootDir: "./",
        verbose: true,
        transform: {
            "^.+\\.js?$": "babel-jest",
        },
        transformIgnorePatterns: [
            "node_modules/(?!(sc-base-database|sc-common|sc-game-base|sc-base-apis|sc-api-client|sc-slot-game-base|sc-cascading-slot-base|sc-game-service-integration-utils|axios|nanoid|crypto-random-string|sc-game-management-client|@sc/user-tracking-client)/)",
        ],
        testEnvironment: "node",
        testResultsProcessor: "jest-sonar-reporter",
        setupFilesAfterEnv: ["jest-extended/all"],
        reporters: [
            "default",
            ["jest-junit", { outputDirectory: "coverage" }],
            ["jest-html-reporters", { publicPath: "./reports", filename: "report.html" }],
        ],
        coverageReporters: ["clover", "lcov", "text-summary", "cobertura"],
        coverageDirectory: "coverage",
    };
};
