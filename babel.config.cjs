module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                targets: { node: "current" },
                modules: "commonjs",
            },
        ],
    ],
    plugins: [
        ["babel-plugin-transform-import-meta", { module: "ES6" }],
        [
            "module-resolver",
            {
                alias: {
                    "node:crypto": "crypto",
                    crypto: "crypto",
                },
            },
        ],
    ],
};
