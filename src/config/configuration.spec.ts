import configuration from './configuration';

describe('configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return the correct mongo uri from environment variables', () => {
    process.env.DB_URI = 'mongodb://localhost:27017/testdb';
    const config = configuration();
    expect(config.mongo.uri).toBe('mongodb://localhost:27017/testdb');
  });

  it('should return true for synchronize when DB_SYNCHRONIZE is "true"', () => {
    process.env.DB_SYNCHRONIZE = 'true';
    const config = configuration();
    expect(config.mongo.synchronize).toBe(true);
  });

  it('should return false for synchronize when DB_SYNCHRONIZE is not "true"', () => {
    process.env.DB_SYNCHRONIZE = 'false';
    const config = configuration();
    expect(config.mongo.synchronize).toBe(false);
  });

  it('should return false for synchronize when DB_SYNCHRONIZE is undefined', () => {
    delete process.env.DB_SYNCHRONIZE;
    const config = configuration();
    expect(config.mongo.synchronize).toBe(false);
  });
});
