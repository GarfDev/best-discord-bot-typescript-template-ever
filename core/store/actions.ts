import { Message } from 'discord.js';
import { action } from 'typesafe-actions';
import ActionTypes from './actionTypes';

export const initApplication = () => action(ActionTypes.INIT_APPLICATION);

export const runCommand = (message: Message) =>
  action(ActionTypes.RUN_COMMAND, { message });