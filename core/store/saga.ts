import { all, call, takeEvery } from 'redux-saga/effects';
import { sendMessage } from 'core/client';
import { runCommand } from './actions';
import ActionType from './actionTypes';
// Import commands
import { fromRootPath, getCommands, getLogger } from 'utils';
import { getCommand } from 'utils/messages';
import commandHandler from 'core/commandHandler';

function* handleCommand({ payload }: ReturnType<typeof runCommand>) {
  const { message } = payload;
  const logger = getLogger();

  const commandPath = yield fromRootPath('commands');
  const commands = yield getCommands(commandPath);

  // Process command
  let splicedCommand = yield message.content.split(' ');
  const command = yield getCommand(splicedCommand[0]);
  if (!command) return;
  splicedCommand = yield splicedCommand.splice(1);

  // Run command
  const commandToRun = yield commands[command];
  if (!commandToRun) return;

  const start = yield new Date().getTime();
  const result = yield call(
    commandHandler,
    commandToRun,
    message,
    ...splicedCommand
  );

  // Return response to channel
  if (result) yield call(sendMessage, message.channel.id, result);
  const elapsed = yield new Date().getTime() - start;
  logger.info(`${command} - ${elapsed}ms`);
}

function* rootSaga() {
  yield all([takeEvery(ActionType.RUN_COMMAND, handleCommand)]);
}

export default rootSaga;
