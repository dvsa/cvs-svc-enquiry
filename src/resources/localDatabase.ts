import { spawnSync } from 'child_process';

const port = 3306;
const databaseName = 'CVSBNOP';
const containerName = 'mysql-test-jenkins';
const rootPassword = '12345';
const rootUsername = 'root';

function runCommand(command: string, options: string[]): string {
  const output = spawnSync(command, options);

  if (String(output.stderr).length > 0) {
    throw new Error(`Error initialising database: ${String(output.stderr)}`);
  }

  return String(output.stdout);
}

function containerExistsAndIsRunning() {
  const response = runCommand('docker', ['ps', '-a']);
  const lines = response.split('\n');
  const containerLine = lines.filter((line) => line.toLowerCase().includes(containerName));

  if (containerLine.length === 0) {
    return { exists: false, isRunning: false };
  }

  if (containerLine[0].toLowerCase().includes('exited')) {
    return { exists: true, isRunning: false };
  }

  return { exists: true, isRunning: true };
}

function startDb() {
  spawnSync('docker', ['start', containerName]);
}

function createDb() {
  const dockerResult = runCommand('docker', [
    'run',
    '--name',
    `${containerName}`,
    '-p',
    `${port}:${port}`,
    '-e',
    `MYSQL_DATABASE=${databaseName}`,
    '-e',
    `MYSQL_ROOT_PASSWORD=${rootPassword}`,
    '-d',
    'mysql:5.7',
  ]);
  console.log(dockerResult);
  setTimeout(() => {
    const liquibaseExecutable = process.platform === 'win32' ? 'liquibase.bat' : 'liquibase';
    const result = runCommand(liquibaseExecutable, [
      '--changeLogFile',
      'src/resources/changelog-master.xml',
      '--username',
      `${rootUsername}`,
      '--password',
      `${rootPassword}`,
      '--url',
      `jdbc:mysql://localhost:${port}/${databaseName}`,
      '--classpath',
      'src/resources/mysql-connector-java-8.0.23.jar',
      'update',
    ]);
    console.log(result);
  }, 10000);
}

function initialiseLocalDatabase(): void {
  const containerStatus = containerExistsAndIsRunning();

  if (containerStatus.exists === false && containerStatus.isRunning === false) {
    createDb();
  } else if (containerStatus.exists === true && containerStatus.isRunning === false) {
    startDb();
  }
}

export default initialiseLocalDatabase;

export {
  port, databaseName, containerName, rootPassword, rootUsername,
};
