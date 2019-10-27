import axios from 'axios';

let urlScheme = null;
let linkUrl;

async function getPlayers(url) {

    if (url) {
        const { team_id, team_uid, cYear = 0, url_scheme = 'ibsl', link_url } = url;
        const finalUrl = `https://basket.co.il/ws/ws.asmx/Players?team_id=${team_id}&team_uid=${team_uid}&cYear=${cYear}`;
        urlScheme = url_scheme;
        linkUrl = link_url;
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
            title: player.name.replace(/&#34;/g, '"').replace(/&#39;/g,"'").replace(/&quot;/g,'"'),
            summary: "",
            author: {
                name: player.name.replace(/&#34;/g, '"').replace(/&#39;/g,"'").replace(/&quot;/g,'"')
            },
            link: {
                href: `${urlScheme}://present?linkUrl=${encodeURIComponent(`${linkUrl}${player.player_id}`)}&showContext=true`,
                type: "link"
            },
            media_group: [
                {
                    type: "image",
                    media_item: [
                        {
                            src: `https://basket.co.il${player.pic}`,
                            key: "image_base",
                            type: "image"
                        }
                    ]
                }
            ],
            extensions: {
                jersy: player.jersy,
                year_id: player.year_id,
                team_id: player.team_id,
                isReplaced: player.isReplaced,
                isLocal: player.isLocal,
                Height: player.Height,
                position: player.position,
                nationality: player.nationality,
                birth_date: player.birth_date
            }
        }))
    }

}

export default getPlayers;