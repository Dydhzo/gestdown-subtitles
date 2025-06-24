const axios = require('axios').default;
var slugify = require('slugify');
const BaseURL = require('./config').APIURL;
require('dotenv').config();

async function request(url, header) {

    return await axios
        .get(url, header, { timeout: 5000 })
        .then(res => {
            return res;
        })
        .catch(error => {
            if (error.response) {
                console.error('error on tmdb.js request:', error.response.status, error.response.statusText, error.config.url);
            } else {
                console.error(error);
            }
        });

}
async function getMeta(type, id) {
    if (!process.env.TMDB_API) {
        console.error("Error: TMDB API key is not defined. Set TMDB_API in your environment.");
        return null;
    }

    let url;
    if (type === "movie") {
        url = `${BaseURL}/movie/${id}?api_key=${process.env.TMDB_API}`;
    } else if (type === "series") {
        url = `${BaseURL}/find/${id}?api_key=${process.env.TMDB_API}&external_source=imdb_id`;
    } else {
        console.error(`Unsupported type: ${type}`);
        return null;
    }

    const res = await request(url);

    if (!res || !res.data) {
        console.error(`No data received from TMDB for ID: ${id}`);
        return null;
    }

    let title;
    if (type === "movie") {
        title = res.data.original_title?.match(/[\u3400-\u9FBF]/) ? res.data.title : res.data.original_title;
    } else if (type === "series") {
        if (!res.data.tv_results || res.data.tv_results.length === 0) {
            console.error(`No series found on TMDB for ID: ${id}`);
            return null;
        }
        title = res.data.tv_results[0].original_name?.match(/[\u3400-\u9FBF]/) ? res.data.tv_results[0].name : res.data.tv_results[0].original_name;
    }

    if (!title) {
        console.error(`Title not found for ID: ${id}`);
        return null;
    }

    const slug = slugify(title, { replacement: '-', remove: undefined, lower: true, strict: true, trim: true });
    return { title, slug };
}


//getMeta("series", 'tt0903747').then(meta => (console.log(meta)))
module.exports = getMeta;
