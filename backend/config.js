var env = process.env.NODE_ENV || 'development';

var config = {
    BaseURL: "https://api.gestdown.info",
    APIURL: 'https://api.themoviedb.org/3'
}

switch (env) {
    case 'development':
        config.port = process.env.PORT || 64395;
        config.addonUrl = "http://127.0.0.1:" + config.port;
        console.log(`Development mode activated. Configuration URL: ${config.addonUrl}, Port: ${config.port}`);
        break;
    case 'production':
        config.port = process.env.PORT || 64395;
        config.addonUrl = process.env.CONFIG_URL;
        if (!config.addonUrl) {
            console.error("FATAL ERROR: The CONFIG_URL environment variable is not set in production mode. The addon will not work without it.");
            process.exit(1);
        }
        console.log(`Production mode activated. Configuration URL: ${config.addonUrl}, Port: ${config.port}`);
        break;
}

module.exports = config;
