import axios from 'axios';
import { BASE_URL } from '../config/const';

let urlScheme = null;
let linkUrl;

export default async function getNews(url) {

    if (url) {
        const { news_id, news_type, team_uid, news_items, headlines, url_scheme = 'ibsl', link_url } = url;
        urlScheme = url_scheme;
        linkUrl = link_url;

        const finalUrl = `${BASE_URL.PROD}/News?news_id=${news_id}&news_type=${news_type}&team_uid=${team_uid}&news_items=${news_items}&headlines=${headlines}`;
        return await axios
            .get(finalUrl)
            .then(news => news.data)
            .then(data => _handleNews(data, team_uid == 0))
            .catch(_errorObject);
    }

    return Promise.reject('no url passed');
}


const _errorObject = {
    id: 'news',
    title: 'חדשות',
    type: {
        value: 'feed'
    },
    entry: [],
    extensions: {}
}

function _handleNews({ news }, shouldUseArtID) {
    return {
        id: 'news',and 
        title: 'חדשות',
        type: {
            value: 'feed'
        },
        entry: news.map(newItem => ({
            type: {
                value: 'link'
            },
            id: shouldUseArtID ? newItem.art_id : newItem.id,
            title: newItem.art_title.replace(/&#34;/g, '"').replace(/&#39;/g, "'").replace(/&quot;/g, '"'),
            summary: newItem.art_abstract.replace(/&#34;/g, '"').replace(/&#39;/g, "'").replace(/&quot;/g, '"'),
            author: {
                name: ""
            },
            link: {
                href: `${linkUrl}${shouldUseArtID ? newItem.art_id : newItem.id}&app=true&showContext=true`,
                rel: "alternate"
            },
            media_group: [
                {
                    type: "image",
                    media_item: [
                        {
                            src: `https://www.basket.co.il${newItem.art_pic8}`,
                            key: "image_base",
                            type: "image"
                        }
                    ]
                }
            ],
            extensions: {
                art_year: newItem.art_year,
                news_type_2: newItem.news_type_2,
                art_date: newItem.art_date,
                game_id: newItem.game_id,
                art_body: newItem.art_body,
                video_mode: newItem.video_mode,
                video_link: newItem.video_link,
                is_link: newItem.is_link,
                birth_date: newItem.birth_date
            }
        }))
    }

}