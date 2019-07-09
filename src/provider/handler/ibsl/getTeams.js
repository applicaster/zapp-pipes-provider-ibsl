import axios from 'axios';

export default function getTeams() {
  const url = 'http://basket.co.il/ws/ws.asmx/teams?board_id=5';

  if (url) {
    return axios
      .get(url)
      .then(response => response.data)
      .then(items => 
        ({ teams: items.teams })
      );
  }

  return Promise.reject('no url passed');
}
