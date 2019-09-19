import { getTeams, getPlayers, getVideos, getNews, getGames, getCoaches, getGamesByTeam } from './ibsl';

export const commands = {
  teams: getTeams,
  players: getPlayers,
  videos: getVideos,
  news: getNews,
  games: getGames,
  gamesByTeam: getGamesByTeam,
  coaches: getCoaches
};