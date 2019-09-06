import axios from 'axios';

let urlScheme = null;

export default async function getNews(url) {

    if (url) {
        const { news_id, news_type, team_uid, news_items, headlines, url_scheme = 'ibsl' } = url;
        urlScheme = url_scheme;
        const finalUrl = `https://basket.co.il/ws/ws.asmx/News?news_id=${news_id}&news_type=${news_type}&team_uid=${team_uid}&news_items=${news_items}&headlines=${headlines}`;
        return await axios
            .get(finalUrl)
            .then(news => news.data)
            .then(_handleNews)
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

function _handleNews({ news }) {
    return {
        id: 'news',
        title: 'חדשות',
        type: {
            value: 'feed'
        },
        entry: news.map(newItem => ({
            type: {
                value: 'link'
            },
            id: newItem.art_id,
            title: newItem.art_title.replace(/&#34;/g, '"').replace(/&#39;/,"'").replace(/&quot;/g,'"'),
            summary: newItem.art_abstract.replace(/&#34;/g, '"').replace(/&#39;/,"'").replace(/&quot;/g,'"'),
            author: {
                name: ""
            },
            link: {
                href: `${urlScheme}://present?linkUrl=${encodeURIComponent(`https://www.basket.co.il/news.asp?PlayerID=${newItem.art_id}`)}&showContext=true`,
                type: "link"
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