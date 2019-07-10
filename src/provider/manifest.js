export const manifest = {
  handlers: ['teams','players','videos'],
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
    // collection: {
    //   description: 'retrieves a collection or a list of collection',
    //   params: {
    //     id: 'optional. if provided, will return that specific collection. Will return all collections if ommited',
    //   }
    // },
    // item: {
    //   description: 'retrieves the item with the given id',
    //   params: {
    //     id: 'required. id of the requested item',
    //   },
    // },
  }
};
