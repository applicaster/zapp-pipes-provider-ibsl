import axios from 'axios';

async function getPlayers(url) {

    if (url) {
        const { team_id, team_uid } = url;
        const finalUrl = `http://basket.co.il/ws/ws.asmx/players?team_id=${team_id}&team_uid=${team_uid}`;
        return await axios
            .get(finalUrl)
            .then(players => players.data)
            .then(_handlePlayers)
            .catch(err => _errorObject);
    }

    return Promise.reject('no url passed');
}

const _errorObject = {
    id: 'players',
    title: 'שחקנים',
    type: {
        value: 'feed'
    },
    entry: [],
    extensions: {}
}

function _handlePlayers({ players }) {
    return {
        id: 'players',
        title: 'שחקנים',
        type: {
            value: 'feed'
        },
        entry: players.map(player => ({
            type: {
                value: 'link'
            },
            id: player.player_id,
            title: player.name,
            summary: "",
            author: {
                name: player.name
            },
            link: {
                href: `ibsl://present?linkUrl=${encodeURIComponent(`https://www.basket.co.il/player.asp?PlayerID=${player.player_id}`)}&showContext=true`,
                type: "link"
            },
            media_group: [
                {
                    type: "image",
                    media_item: [
                        {
                            src: `https://www.basket.co.il${player.pic}`,
                            key: "image_base",
                            type: "image"
                        }
                    ]
                }
            ],
            extensions: {
                jersy: "08",
                year_id: "2020",
                team_id: "1010",
                isReplaced: "False",
                isLocal: "False",
                Height: "2.00",
                position: "פורוורד",
                nationality: "ישראל",
                birth_date: "14/08/1997"
            }
        }))
    }

}

export default getPlayers;