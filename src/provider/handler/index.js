import { commands } from './comands';

export const handler = nativeBridge => params => {
  const { type } = params;

  if (!type || ['teams', 'players', 'videos', 'news', 'games', 'coaches'].indexOf(type) == -1) {
    return nativeBridge.throwError('unknown request');
  }

  return commands[type](params)
    .then(nativeBridge.sendResponse)
    .catch(nativeBridge.throwError);
};
