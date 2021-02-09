import axios from 'axios';
import getTeams from './getTeams';
import { stringify } from 'querystring';

let urlScheme = null;
let boardID;
let teamsList;
let statusOverride;

export default async function getGames(url) {

    if (url) {
        const { board_id, board_round, team_id, team_uid, game_id, cYear = 0, url_scheme = 'ibsl', status_override = false } = url;


        boardID = board_id;
        urlScheme = url_scheme;
        statusOverride = status_override;

        const finalUrl = `https://basket.co.il/ws/ws.asmx/Games?board_id=${board_id}&board_round=${board_round}&team_id=${team_id}&team_uid=${team_uid}&game_id=${game_id}&cYear=${cYear}`;
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

const _errorObjectEntry = {
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
        entry: games.map(gameItem => 
            (_isLiveGame(gameItem) ? _getLiveStats(gameItem, _errorObjectEntry) : _getNotLiveEntry(gameItem)))
    }
}

function _isLiveGame(gameItem) {
    //Each game item got the following date and time: "game_date_txt": "03/02/2021" && "TimeOfGame": "19:20"
    //We need move it to MillisecondsFrom1970 format
    const gameItemDateMillisecondsFrom1970 = _getGameTimeMillisecondsFrom1970(gameItem);

    //Get current time in MillisecondsFrom1970
    const date = new Date();
    const currentMillisecondsFrom1970 = date.getTime();

    const deltaTime = gameItemDateMillisecondsFrom1970 - currentMillisecondsFrom1970;

    if(deltaTime > 0) {
        //Game didn't started
        return false;
    } else {
        //Game may started or ended - check the delta is bigger then 4 hours
        const minutesSinceGameStarted = _msToMinutes(Math.abs(deltaTime));
        return minutesSinceGameStarted > 240 ? false : true;
    }
}

function _msToMinutes(duration) {
    return Math.floor((duration / (1000 * 60)));
}

function _getGameTimeMillisecondsFrom1970(gameItem) {
    const [day, month, year] = gameItem.game_date_txt.split('/');
    const stringDateFormat = `${year}-${month}-${day}T${gameItem.TimeOfGame}:00.000+02:00`;
    const gameDateMillisecondsFrom1970 = Date.parse(stringDateFormat);
    return gameDateMillisecondsFrom1970
}

function _getLiveStats(gameItem, errorObject) {
    const LIVE_STATS_BASE_URL = 'http://stats.segevstats.com/realtimestat_heb/api';
    const GET_BOX_SCORE_METHOD = 'getBoxScore';
    const GET_GAME_INFO = 'getGameInfo';

    const gameId = gameItem.game_id;

    const getBoxScoreURL = `${LIVE_STATS_BASE_URL}/?method=${GET_BOX_SCORE_METHOD}&game_id=${gameId}`
    const getGameInfoURL = `${LIVE_STATS_BASE_URL}/?method=${GET_GAME_INFO}&game_id=${gameId}`

    const getBoxScorePromise = await axios.get(getBoxScoreURL).then(game => game.result.boxscore)
    const getGameInfoPromise = await axios.get(getGameInfoURL).then(game => game.result.gameInfo)

    return Promise.all([getBoxScorePromise, getGameInfoPromise])
        .then((data) => {
            return _getLiveEntry(gameItem, data[0],data[1]);
        }).catch(errorObject);
}

function _getNotLiveEntry(gameItem) {
    return {
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
            ExternalID: gameItem.ExternalID,
            gameFinished: true
        }
    };
}

function _getLiveEntry(gameItem, boxScore, gameInfo) {
    return {
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
            currentQuarter: boxScore.gameInfo.currentQuarter,
            currentQuarterTimeMinutes: boxScore.gameInfo.currentQuarterTime.m,
            currentQuarterTimeSeconds: boxScore.gameInfo.currentQuarterTime.s,
            gameFinished: boxScore.gameInfo.gameFinished,
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
    };
}