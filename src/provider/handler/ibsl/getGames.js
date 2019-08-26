import axios from 'axios';
import getTeams from './getTeams';
import { stringify } from 'querystring';

let urlScheme = null;
let boardID;
let teamsList;
export default async function getGames(url) {

    if (url) {
        const { board_id, board_round, team_id, team_uid, game_id, url_scheme = 'ibsl' } = url;
        boardID = board_id;
        urlScheme = url_scheme;

        await axios.get(`http://www.basket.co.il/ws/ws.asmx/teams?board_id=${board_id}`)
            .then(teams => teams.data)
            .then((teams) =>  teamsList = teams.teams);

        const finalUrl = `http://basket.co.il/ws/ws.asmx/games?board_id=${board_id}&board_round=${board_round}&team_id=${team_id}&team_uid=${team_uid}&game_id=${game_id}`;

        return await axios
            .get(finalUrl)
            .then(games => games.data)
            .then(_handleGames)
            .catch(_errorObject);
    }

    return Promise.reject('no url passed');
}

function teamPic(teamID) {
    const teamSelected = teamsList.filter(team => team.team_year_id === teamID);
    return teamSelected[0].team_icon2;
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

function _handleGames({ games }, teamsList) {

    return {
        id: 'games',
        title: 'משחקים',
        type: {
            value: 'feed'
        },
        entry: games.map(gameItem => {
            return ({
                type: {
                    value: 'link'
                },
                id: gameItem.game_id,
                title: gameItem.board_name,
                summary: gameItem.board_name,
                author: {
                    name: ""
                },
                link: {
                    href: `${urlScheme}://present?linkUrl=${encodeURIComponent(`https://www.basket.co.il/news.asp?PlayerID=${gameItem.game_id}`)}&showContext=true`,
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
                    team1_name: gameItem.team1_name,
                    team1_pic: teamPic(gameItem.team1),
                    team2: gameItem.team2,
                    team2_name: gameItem.team2_name,
                    team2_pic: teamPic(gameItem.team2),
                    score_team1: gameItem.score_team1,
                    score_team2: gameItem.score_team2,
                    BOARD_ID: gameItem.BOARD_ID,
                    gameNumber: gameItem.gameNumber,
                    TimeOfGame: gameItem.TimeOfGame,
                    PlaceOfGameHeb: gameItem.PlaceOfGameHeb,
                    Ref: gameItem.Ref,
                    total_viewers: gameItem.total_viewers,
                    overtime: gameItem.overtime,
                    total_ot: gameItem.total_ot,
                    score_by_q_1: gameItem.score_by_q_1,
                    score_by_q_2: gameItem.score_by_q_2,
                    tickets_url: gameItem.tickets_url
                }
            })
        })
    }

}