export const manifest = {
  handlers: ['teams', 'players', 'videos', 'news', 'games', 'coaches'],
  help: {
    teams: {
      description: 'retrieves a list of teams'
    },
    players: {
      description: 'retrieves a list of players'
    },
    videos: {
      description: 'retrieves a list of youtube videos'
    },
    news: {
      description: 'retrieves a list of news items'
    },
    games: {
      description: 'retrieves a list of games / games by team'
    },
    coaches: {
      description: 'retrieves a list of coaches by team'
    }
  }
};
