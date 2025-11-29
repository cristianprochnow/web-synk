export default {
    testEnvironment: "jest-environment-jsdom",
    collectCoverage: true,
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
    collectCoverageFrom: [
      'src/**/*.{js,jsx,ts,tsx}',
      '!src/**/*.d.ts',
      '!src/main.tsx',
      '!src/vite-env.d.ts'
    ],
    coverageThreshold: {
      global: {
        branches: 25,
        functions: 25,
        lines: 25,
        statements: 25
      }
    },
    transform: {
        "^.+\\.(t|j)sx?$": "babel-jest"
    },
    moduleNameMapper: {
        "\\.(scss|sass|css)$": "<rootDir>/__mocks__/style.js",
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/file.js"
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}