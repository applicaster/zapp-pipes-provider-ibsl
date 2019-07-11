import { getTeams, getPlayers, getVideos, getNews } from './ibsl';

export const commands = {
  teams: getTeams,
  players: getPlayers,
  videos: getVideos,
  news: getNews
};

// import { getCollection } from './getCollection';
// import { getItem } from './getItem';

// export const commands = {
//   collection: getCollection,
//   item: getItem,
// };