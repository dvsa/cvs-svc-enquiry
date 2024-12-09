import { spawnSync, SpawnSyncReturns } from 'child_process';
import localDatabase, { containerName } from '../../../src/resources/localDatabase';

jest.mock('child_process');

describe('Local database', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.resetAllMocks().restoreAllMocks();
  });

  it('does nothing when the docker container is running', () => {
    const mockedSpawnSync = jest.mocked(spawnSync);
    const mockResponse = ({
      stdout: Buffer.from(`${containerName} up`),
      stderr: Buffer.from(''),
    } as unknown) as SpawnSyncReturns<Buffer>;

    mockedSpawnSync.mockReturnValue(mockResponse);

    localDatabase();

    expect(mockedSpawnSync).toHaveBeenCalledTimes(1);
  });

  it('starts the container when the container exists but is not running', () => {
    const mockedSpawnSync = jest.mocked(spawnSync);
    const mockResponse = ({
      stdout: Buffer.from(`${containerName} exited`),
      stderr: Buffer.from(''),
    } as unknown) as SpawnSyncReturns<Buffer>;
    const mockStartResponse = ({
      stdout: Buffer.from('12345'),
      stderr: Buffer.from(''),
    } as unknown) as SpawnSyncReturns<Buffer>;

    mockedSpawnSync.mockReturnValueOnce(mockResponse);
    mockedSpawnSync.mockReturnValueOnce(mockStartResponse);

    localDatabase();

    expect(mockedSpawnSync).toHaveBeenCalledTimes(2);
    expect(mockedSpawnSync.mock.calls[1][1]?.[0]).toEqual('start');
    expect(mockedSpawnSync.mock.calls[1][1]?.[1]).toEqual(containerName);
  });

  it('boots the DB from scratch when it does not exist', () => {
    const mockedSpawnSync = jest.mocked(spawnSync);
    const mockListResponse = ({
      stdout: Buffer.from(''),
      stderr: Buffer.from(''),
    } as unknown) as SpawnSyncReturns<Buffer>;
    const mockDockerRunResponse = ({
      stdout: Buffer.from('1234'),
      stderr: Buffer.from(''),
    } as unknown) as SpawnSyncReturns<Buffer>;
    const mockLiquibaseResponse = ({
      stdout: Buffer.from('Success'),
      stderr: Buffer.from(''),
    } as unknown) as SpawnSyncReturns<Buffer>;

    mockedSpawnSync.mockReturnValueOnce(mockListResponse);
    mockedSpawnSync.mockReturnValueOnce(mockDockerRunResponse);
    mockedSpawnSync.mockReturnValueOnce(mockLiquibaseResponse);

    localDatabase();
    jest.runAllTimers();

    expect(mockedSpawnSync).toHaveBeenCalledTimes(3);
    expect(mockedSpawnSync.mock.calls[1][0]).toEqual('docker');
    expect(mockedSpawnSync.mock.calls[1][1]?.[0]).toEqual('run');
    expect(mockedSpawnSync.mock.calls[2][0]).toContain('liquibase');
  });

  it('throws an error if the stderr is not empty', () => {
    const mockedSpawnSync = jest.mocked(spawnSync);
    const mockResponse = ({
      stdout: Buffer.from(`${containerName} up`),
      stderr: Buffer.from('Something went wrong'),
    } as unknown) as SpawnSyncReturns<Buffer>;

    mockedSpawnSync.mockReturnValue(mockResponse);

    expect(() => localDatabase()).toThrow();
  });
});
