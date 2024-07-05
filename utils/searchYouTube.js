const ytSearch = require('yt-search');

module.exports = async function searchYouTube(searchTerm) {
    const result = await ytSearch(searchTerm);
    return result.videos.length > 0 ? result.videos[0] : null;
};
