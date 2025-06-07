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
        return { title: id, slug: id }; // Return default value to avoid downstream errors
    }

    if (type == "movie") {
        let url = `${BaseURL}/movie/${id}?api_key=${process.env.TMDB_API}`;
        let res = await request(url);
        if (!res || !res.data) {
            console.error(`No data received from TMDB for movie ID: ${id}`);
            return { title: id, slug: id };
        }
        let title = res.data.original_title?.match(/[\u3400-\u9FBF]/) ? res.data.title : res.data.original_title;
        if (!title) {
            console.error(`Title not found for movie ID: ${id}`);
            return { title: id, slug: id };
        }
        var slug = slugify(title, { replacement: '-', remove: undefined, lower: true, strict: true, trim: true });
        return { title: title, slug: slug };
    } else if (type == "series") {
        let url = `${BaseURL}/find/${id}?api_key=${process.env.TMDB_API}&external_source=imdb_id`;
        let res = await request(url);
        if (!res || !res.data || !res.data.tv_results || res.data.tv_results.length === 0) {
            console.error(`No data or series found on TMDB for ID: ${id}`);
            return { title: id, slug: id };
        }
        let title = res.data.tv_results[0].original_name?.match(/[\u3400-\u9FBF]/) ? res.data.tv_results[0].name : res.data.tv_results[0].original_name;
        if (!title) {
            console.error(`Title not found for series ID: ${id}`);
            return { title: id, slug: id };
        }
        var slug = slugify(title, { replacement: '-', remove: undefined, lower: true, strict: true, trim: true });
        return { title: title, slug: slug };
    }
    return { title: id, slug: id }; // Default value if type not recognized
}


//getMeta("series", 'tt0903747').then(meta => (console.log(meta)))
module.exports = getMeta;