const axios = require('axios');
const API_URL = 'https://api.gestdown.info';

/**
 * Performs a series search on Gestdown with error handling and retries for rate limiting.
 * @param {string} query - The name of the series to search for.
 * @param {number} retries - Number of remaining attempts in case of rate limit (429).
 * @returns {Promise<string|null>} The unique ID of the series or null if not found or on error.
 */
async function searchShow(query, retries = 3) {
    try {
        const searchUrl = `${API_URL}/shows/search/${encodeURIComponent(query)}`;
        if (query.length < 3) {
            console.log(`Query too short: ${query}. Minimum 3 characters required.`);
            return null;
        }
        console.log(`Searching for series on Gestdown with query: ${query}`);
        console.log(`Generated search URL: ${searchUrl}`);
        const response = await axios.get(searchUrl, {
            headers: { 'accept': 'application/json' },
            timeout: 10000 // 10 second timeout to avoid endless waits
        });
        console.log(`Gestdown API response - Status: ${response.status}, Data: ${JSON.stringify(response.data).substring(0, 200)}...`);
        // Logic to choose the right show if multiple results
        if (response.data && response.data.shows && response.data.shows.length > 0) {
            console.log(`Series found: ${response.data.shows[0].name} (ID: ${response.data.shows[0].id})`);
            return response.data.shows[0].id;
        } else {
            console.log(`No series found for query: ${query}`);
            // Try alternative search with shortened or modified version if possible
            const words = query.split(' ');
            if (words.length > 1) {
                const shorterQuery = words.slice(0, words.length - 1).join(' ');
                console.log(`Trying with shorter query: ${shorterQuery}`);
                return await searchShow(shorterQuery, retries);
            }
            return null;
        }
    } catch (error) {
        console.error('Error during series search:', error.message);
        if (error.response && error.response.status === 429 && retries > 0) {
            const waitTime = Math.pow(2, 3 - retries) * 1000; // Exponential backoff: 1s, 2s, 4s
            console.log(`Rate limit (429) reached during search. Waiting ${waitTime/1000} seconds before retry (${retries} remaining).`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            return searchShow(query, retries - 1);
        }
        return null;
    }
}

/**
 * Retrieves a series on Gestdown by its TVDB ID.
 * @param {string} tvdbId - The TVDB ID of the series.
 * @param {number} retries - Number of remaining attempts in case of rate limit (429).
 * @returns {Promise<string|null>} The unique ID of the series or null if not found or on error.
 */
async function getShowByTvdbId(tvdbId, retries = 3) {
    try {
        const response = await axios.get(`${API_URL}/shows/external/tvdb/${tvdbId}`, {
            headers: { 'accept': 'application/json' },
            timeout: 10000
        });
        if (response.data && response.data.uniqueId) {
            console.log(`Series found by TVDB ID: ${tvdbId} (Gestdown ID: ${response.data.uniqueId})`);
            return response.data.uniqueId;
        } else {
            console.log(`No series found for TVDB ID: ${tvdbId}`);
            return null;
        }
    } catch (error) {
        console.error('Error retrieving series by TVDB ID:', error.message);
        if (error.response && error.response.status === 429 && retries > 0) {
            const waitTime = Math.pow(2, 3 - retries) * 1000;
            console.log(`Rate limit (429) reached for TVDB ID. Waiting ${waitTime/1000} seconds before retry (${retries} remaining).`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            return getShowByTvdbId(tvdbId, retries - 1);
        }
        return null;
    }
}

/**
 * Retrieves subtitles for a specific episode of a series on Gestdown.
 * @param {string} showUniqueId - The unique ID of the series on Gestdown.
 * @param {string} season - Season number.
 * @param {string} episode - Episode number.
 * @param {string} language - Language code for subtitles.
 * @param {number} retries - Number of remaining attempts in case of rate limit (429).
 * @returns {Promise<Array>} List of available subtitles or empty array on error or if not found.
 */
async function getSubtitles(showUniqueId, season, episode, language, retries = 3) {
    try {
        // Normalize language code to match Gestdown expectations (e.g., "french" -> "fr")
        const normalizedLang = language.toLowerCase().startsWith('fr') ? 'fr' : language;
        console.log(`Searching subtitles for ${showUniqueId} S${season}E${episode} in normalized language: ${normalizedLang}`);
        const url = `${API_URL}/subtitles/get/${showUniqueId}/${season}/${episode}/${normalizedLang}`;
        console.log(`Subtitle search URL: ${url}`);
        const response = await axios.get(url, {
            headers: { 'accept': 'application/json' },
            timeout: 10000
        });
        console.log(`Gestdown API response for subtitles - Status: ${response.status}, Data: ${JSON.stringify(response.data).substring(0, 200)}...`);
        if (response.data && response.data.matchingSubtitles && Array.isArray(response.data.matchingSubtitles)) {
            console.log(`Subtitles retrieved for ${showUniqueId} S${season}E${episode} in ${normalizedLang}: ${response.data.matchingSubtitles.length} results`);
            return response.data.matchingSubtitles;
        } else {
            console.log(`No subtitles found or unexpected response format for ${showUniqueId} S${season}E${episode} in ${normalizedLang}`);
            return [];
        }
    } catch (error) {
        console.error('Error retrieving subtitles:', error.message);
        if (error.response) {
            if (error.response.status === 404) {
                console.log(`No subtitles found for ${showUniqueId} S${season}E${episode} in ${language} (404)`);
                return [];
            } else if (error.response.status === 429 && retries > 0) {
                const waitTime = Math.pow(2, 3 - retries) * 1000;
                console.log(`Rate limit (429) reached for subtitles. Waiting ${waitTime/1000} seconds before retry (${retries} remaining).`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                return getSubtitles(showUniqueId, season, episode, language, retries - 1);
            } else if (error.response.status === 423) {
                console.log(`Refresh required (423) for ${showUniqueId} S${season}E${episode}, please try again later.`);
                return [];
            }
        }
        return [];
    }
}

module.exports = { searchShow, getShowByTvdbId, getSubtitles };