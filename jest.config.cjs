const swcTransform = [
  '@swc/jest',
  {
    jsc: {
      target: 'es2022',
      parser: {
        syntax: 'typescript',
        tsx: true,
      },
      transform: {
        react: {
          runtime: 'automatic',
        },
      },
    },
    module: {
      type: 'commonjs',
    },
  },
];

module.exports = {
  projects: [
    {
      displayName: 'frontend',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/src/**/*.test.tsx'],
      testPathIgnorePatterns: ['<rootDir>/src/server/'],
      setupFilesAfterEnv: ['<rootDir>/test/setupFrontend.ts'],
      transform: {
        '^.+\\.(ts|tsx|js|jsx)$': swcTransform,
      },
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': '<rootDir>/test/styleMock.cjs',
        '\\.(svg|png|jpg|jpeg|gif|webp)$': '<rootDir>/test/fileMock.cjs',
        '^maplibre-gl$': '<rootDir>/test/maplibreMock.cjs',
      },
    },
    {
      displayName: 'backend',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/src/server/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/test/setupBackend.ts'],
      transform: {
        '^.+\\.(ts|tsx|js|jsx)$': swcTransform,
      },
    },
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/server/index.ts',
    '!src/server/db/migrate.ts',
  ],
};
