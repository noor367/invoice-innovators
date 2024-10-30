module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    maxWorkers: 1,
    globals: {
        'ts-jest': {
          tsconfig: 'tsconfig.jest.json'
        }
    },
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
};  
