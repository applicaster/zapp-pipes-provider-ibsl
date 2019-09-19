import axios from 'axios';
import { stringify } from 'querystring';

let urlScheme = null;
export default async function getCoaches(url) {

    if (url) {
        const { team_id, team_uid, cYear = 0, url_scheme = 'ibsl' } = url;
        urlScheme = url_scheme;

        const finalUrl = `https://www.basket.co.il/ws/ws.asmx/Coaches?team_id=${team_id}&team_uid=${team_uid}&cYear=${cYear}`;
        return await axios
            .get(finalUrl)
            .then(coaches => coaches.data)
            .then(_handleCoaches)
            .catch(_errorObject);
    }

    return Promise.reject('no url passed');
}

const _errorObject = {
    id: 'games',
    title: 'מאמנים',
    type: {
        value: 'feed'
    },
    entry: [],
    extensions: {}
}

function _handleCoaches({ coaches }) {

    return {
        id: 'coaches',
        title: 'מאמנים',
        type: {
            value: 'feed'
        },
        entry: coaches.map(coachesItem => {
            return {
                type: {
                    value: 'link'
                },
                id: coachesItem.coach_id,
                title: coachesItem.name.replace(/&#34;/g, '"').replace(/&#39;/g, "'").replace(/&quot;/g, '"'),
                summary: coachesItem.name.replace(/&#34;/g, '"').replace(/&#39;/g, "'").replace(/&quot;/g, '"'),
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
                                src: `https://www.basket.co.il${coachesItem.pic}`,
                                key: "image_base",
                                type: "image"
                            }
                        ]
                    }
                ],
                extensions: {
                    cType: coachesItem.cType,
                    year_id: coachesItem.year_id,
                    team_id: coachesItem.team_id,
                    name_eng: coachesItem.name_eng,
                    isReplaced: coachesItem.isReplaced,
                    mOrder: coachesItem.mOrder,
                    birth_date: coachesItem.birth_date
                }
            }
        })
    }

}