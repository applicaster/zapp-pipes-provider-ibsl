import { getTeams, getPlayers  } from './ibsl';

export const commands = {
  teams: getTeams,
  players: getPlayers
};

// import { getCollection } from './getCollection';
// import { getItem } from './getItem';

// export const commands = {
//   collection: getCollection,
//   item: getItem,
// };