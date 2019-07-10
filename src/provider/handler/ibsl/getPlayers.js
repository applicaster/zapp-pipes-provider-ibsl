import axios from 'axios';

export default function getPlayers() {
    const url = 'http://basket.co.il/ws/ws.asmx/players?team_id=1010&team_uid=10';
    
    if (url) {
        return axios
            .get(url)
            .then(players => players.data)
            .then(_handlePlayers);
    }

    return Promise.reject('no url passed');
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
                href: "maccabi://present?linkUrl=https%3A%2F%2Fmaccabi.co.il%2FplayerApp.asp%3FPlayerID%3D954&showContext=true",
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