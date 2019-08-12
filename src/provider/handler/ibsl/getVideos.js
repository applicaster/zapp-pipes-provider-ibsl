import axios from 'axios';

let urlScheme = null;

export default async function getVideos(url) {

    if (url) {
        const { video_type, team_uid, video_items, headlines, url_scheme = 'ibsl' } = url;
        const finalUrl = `https://www.basket.co.il/ws/ws.asmx/videos?video_type=${video_type}&team_uid=${team_uid}&video_items=${video_items}&headlines=${headlines}`;
        urlScheme = url_scheme;
        return await axios
            .get(finalUrl)
            .then(videos => videos.data)
            .then(_handleVideos)
            .catch(err => _errorObject);
    }

    return Promise.reject('no url passed');
}

const _errorObject = {
    id: 'videos',
    title: 'פלייליסט Youtube',
    type: {
        value: 'feed'
    },
    entry: [],
    extensions: {}
}

function _handleVideos({ videos }) {
    return {
        "id": "videos",
        "type": {
            "value": "feed"
        },
        "title": "פלייליסט Youtube",
        "entry": videos.map(video => ({
            "type": {
                "value": "video"
            },
            "id": video.id,
            "title": video.title,
            "summary": video.title,
            "published": "",
            "updated": "",
            "media_group": [
                {
                    "type": "image",
                    "media_item": [
                        {
                            "key": "image_base",
                            "src": video.pic
                        }
                    ]
                }
            ],
            "content": {
                "type": "youtube-id",
                "src": video.external_id
            },
            "link": {
                "rel": "alternate",
                "href": video.video_url
            }
        })),
        "extensions": {}
    }
}