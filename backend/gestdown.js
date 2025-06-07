const tmdb = require('./tmdb');
const gestdownApi = require('./lib/gestdownApi');
const sub2vtt = require('sub2vtt');
const config = require('./config');
const languages = require('./languages.json');
const NodeCache = require("node-cache");
const Cache = new NodeCache();
const MetaCache = new NodeCache();
const subtitlesCache = new NodeCache();

async function subtitles(type, imdbid, lang) {
    let [id, season, episode] = imdbid.split(':');
    console.log(`Request for ID: ${id}, Season: ${season}, Episode: ${episode}, Language: ${lang}`);
    let meta = MetaCache.get(id);
    if (!meta) {
        try {
            meta = await tmdb(type, id);
            if (meta) {
                MetaCache.set(id, meta, 86400); // Cache pour 24 heures
                console.log(`Metadata retrieved and cached for ID: ${id}`);
            } else {
                console.log(`No metadata found for ID: ${id}`);
                return [];
            }
        } catch (error) {
            console.error(`Error retrieving metadata for ID: ${id}`, error);
            return [];
        }
    }

    console.log(`Title: ${meta.title}, Season: ${season}, Episode: ${episode}`);
    const cachID = `${id}_${season}_${episode}_${lang}`;
    let cached = Cache.get(cachID);
    if (cached) {
        console.log(`Cached result for ${cachID}`);
        return cached;
    } else {
        const subtitlescachID = `${id}_${season}_${episode}`;
        let subtitlesList = subtitlesCache.get(subtitlescachID);
        if (!subtitlesList) {
            let showId = null;
            try {
                // Try to retrieve series ID by title search
                showId = await gestdownApi.searchShow(meta.title);
                if (!showId) {
                    console.log(`Series not found on Gestdown: ${meta.title}`);
                    return [];
                }
                console.log(`Gestdown series ID found: ${showId} for ${meta.title}`);
                subtitlesList = await gestdownApi.getSubtitles(showId, season, episode, lang);
                if (subtitlesList && subtitlesList.length > 0) {
                    subtitlesCache.set(subtitlescachID, subtitlesList, 3600); // Cache pour 1 heure
                    console.log(`Subtitles retrieved and cached for ${subtitlescachID}`);
                } else {
                    console.log(`No subtitles found for ${meta.title} S${season}E${episode} in ${lang}`);
                    subtitlesList = [];
                }
            } catch (error) {
                console.error(`Error retrieving subtitles for ${meta.title}`, error);
                return [];
            }
        }

        let subs = [];
        if (subtitlesList.length > 0) {
            for (let i = 0; i < subtitlesList.length; i++) {
                let subInfo = subtitlesList[i];
                let url = `https://api.gestdown.info/subtitles/download/${subInfo.subtitleId}`;
                // Use a local proxy to convert subtitles to VTT format with proper encoding handling
                // Use the external proxy for VTT conversion
                proxy = {
                    BaseURL:config.BaseURL,
                    "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
                }

                let proxyUrl = config.local + "/sub.vtt?"+sub2vtt.gerenateUrl(url, { proxy, lang });
                subs.push({
                    lang: languages[lang].iso || languages[lang].id || lang,
                    id: `${cachID}_${i}`,
                    url: proxyUrl,
                });
            }
            console.log(`Subtitles formatted for Stremio:`, subs);
            console.log("Current cache keys:", Cache.keys());
            if (subs.length > 0) {
                Cache.set(cachID, subs, 3600); // Cache pour 1 heure
                console.log(`Result cached for ${cachID}`);
            }
            return subs;
        } else {
            console.log(`Returning empty subtitle list for ${cachID}`);
            return [];
        }
    }
}

module.exports = subtitles;
