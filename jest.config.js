export default {
    testEnvironment: "jest-environment-jsdom",
    moduleNameMapper: {
        "\\.(scss|sass|css)$": "<rootDir>/__mocks__/style.js"
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
}