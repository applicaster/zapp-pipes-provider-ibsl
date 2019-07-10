import { getTeams, getPlayers, getVideos  } from './ibsl';

export const commands = {
  teams: getTeams,
  players: getPlayers,
  videos: getVideos
};

// import { getCollection } from './getCollection';
// import { getItem } from './getItem';

// export const commands = {
//   collection: getCollection,
//   item: getItem,
// };