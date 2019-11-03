import axios from 'axios';
import getTeams from './getTeams';
import { stringify } from 'querystring';

let urlScheme = null;
let boardID;
let teamsList;
let statusOverride;

export default async function getGamesByTeam(url) {

    if (url) {
        const { board_id, team_uid, cYear = 0, url_scheme = 'ibsl', status_override = false } = url;
        boardID = board_id;
        urlScheme = url_scheme;
        statusOverride = status_override;

        const finalUrl = `https://basket.co.il/ws/ws.asmx/GamesByTeam?team_uid=${team_uid}&cYear=${cYear}`;
        return await axios
            .get(finalUrl)
            .then(games => games.data)
            .then(_handleGames)
            .catch(_errorObject);
    }

    return Promise.reject('no url passed');
}

const _errorObject = {
    id: 'games',
    title: 'משחקים',
    type: {
        value: 'feed'
    },
    entry: [],
    extensions: {}
}

function _handleGames({ games }) {

    return {
        id: 'games',
        title: 'משחקים',
        type: {
            value: 'feed'
        },
        entry: games.map(gameItem => ({
            type: {
                value: 'link'
            },
            id: gameItem.game_id,
            title: gameItem.board_name.replace(/&#34;/g, '"').replace(/&#39;/g, "'").replace(/&quot;/g, '"'),
            summary: gameItem.board_name.replace(/&#34;/g, '"').replace(/&#39;/g, "'").replace(/&quot;/g, '"'),
            author: {
                name: ""
            },
            link: {
                href: "",
                type: "link"
            },
            media_group: [
                {
                    type: "image",
                    media_item: [
                        {
                            src: ``,
                            key: "image_base",
                            type: "image"
                        }
                    ]
                }
            ],
            extensions: {
                game_date_txt: gameItem.game_date_txt,
                year_id: gameItem.year_id,
                team1: gameItem.team1,
                team1_name: gameItem.team1_name.replace(/&#34;/g, '"').replace(/&#39;/g, "'").replace(/&quot;/g, '"'),
                team1_pic: gameItem.team1_logo,
                team2: gameItem.team2.replace(/&#34;/g, '"').replace(/&#39;/g, "'").replace(/&quot;/g, '"'),
                team2_name: gameItem.team2_name.replace(/&#34;/g, '"').replace(/&#39;/g, "'").replace(/&quot;/g, '"'),
                team2_pic: gameItem.team2_logo,
                score_team1: gameItem.score_team1,
                score_team2: gameItem.score_team2,
                BOARD_ID: gameItem.BOARD_ID,
                gameNumber: gameItem.gameNumber,
                TimeOfGame: gameItem.TimeOfGame,
                PlaceOfGameHeb: gameItem.PlaceOfGameHeb.replace(/&#34;/g, '"').replace(/&#39;/g, "'").replace(/&quot;/g, '"'),
                Ref: gameItem.Ref,
                total_viewers: gameItem.total_viewers,
                overtime: gameItem.overtime,
                total_ot: gameItem.total_ot,
                score_by_q_1: gameItem.score_by_q_1,
                score_by_q_2: gameItem.score_by_q_2,
                tickets_url: gameItem.tickets_url,
                statusOverride: statusOverride,
                ExternalID: gameItem.ExternalID
            }
        }))
    }

}