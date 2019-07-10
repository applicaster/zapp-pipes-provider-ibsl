import axios from 'axios';

export default function getVideos() {
    const url = 'https://www.basket.co.il/ws/ws.asmx/videos?video_type=0&team_uid=0&video_items=5&headlines=true';

    if (url) {
        return axios
            .get(url)
            .then(videos => videos.data)
            .then(_handleVideos);
    }

    return Promise.reject('no url passed');
}

function _handleVideos({videos}) {
    return {
        "type": {
            "value": "feed"
        },
        "title": "",
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