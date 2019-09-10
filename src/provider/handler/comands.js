import { getTeams, getPlayers, getVideos, getNews, getGames, getCoaches } from './ibsl';

export const commands = {
  teams: getTeams,
  players: getPlayers,
  videos: getVideos,
  news: getNews,
  games: getGames,
  coaches: getCoaches
};