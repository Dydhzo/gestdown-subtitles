const express = require("express");
const app = express();
const cors = require('cors');
const path = require('path');
const subtitles = require('./gestdown');
const manifest = require("./manifest.json");
const languages = require('./languages.json');
const sub2vtt = require('sub2vtt/middleware');
app.set('trust proxy', true)

const serveIndex = require('serve-index');

app.use('/logs', express.static(path.join(__dirname, 'logs'),{etag: false}), serveIndex('logs', {'icons': true,'view':'details '}))

app.use('/configure', express.static(path.join(__dirname, 'frontend', 'dist')));
app.use('/assets', express.static(path.join(__dirname, 'frontend', 'dist', 'assets')));

app.use(cors())

app.get('/sub.vtt', sub2vtt)

app.get('/', (_, res) => {
	res.redirect('/configure');
});

app.get('/:configuration?/configure', (req, res) => {
	res.setHeader('Cache-Control', 'max-age=86400,staleRevalidate=stale-while-revalidate, staleError=stale-if-error, public');
	res.setHeader('content-type', 'text/html');
	res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

app.get('/manifest.json', (_, res) => {
	res.setHeader('Cache-Control', 'max-age=86400,staleRevalidate=stale-while-revalidate, staleError=stale-if-error, public');
	res.setHeader('Content-Type', 'application/json');
	manifest.behaviorHints.configurationRequired = true;
	res.send(manifest);
});

app.get('/:configuration?/manifest.json', (_, res) => {
	res.setHeader('Cache-Control', 'max-age=86400,staleRevalidate=stale-while-revalidate, staleError=stale-if-error, public');
	res.setHeader('Content-Type', 'application/json');
	manifest.behaviorHints.configurationRequired = false;
	res.send(manifest);
});

app.get('/:configuration?/:resource/:type/:id/:extra?.json', (req, res) => {
    res.setHeader('Cache-Control', 'max-age=86400,staleRevalidate=stale-while-revalidate, staleError=stale-if-error, public');
    res.setHeader('Content-Type', 'application/json');

    console.log('Request received:', req.params);
    const { configuration, resource, type, id } = req.params;
    if (resource !== "subtitles") {
        console.log(`Ressource non prise en charge: ${resource}`);
        res.send({ subtitles: [] });
        return;
    }

    if (configuration && configuration !== "subtitles") {
        let lang = configuration;
        if (languages[lang]) {
            console.log(`Searching subtitles for ${type} ID: ${id} in language: ${lang}`);
            subtitles(type, id, lang)
                .then(subs => {
                    console.log(`Subtitles returned for ${id}: ${subs.length} results`);
                    res.send({ subtitles: subs });
                })
                .catch(error => {
                    console.error(`Error retrieving subtitles for ${id}:`, error);
                    res.send({ subtitles: [] });
                });
        } else {
            console.log(`Langue non prise en charge: ${lang}`);
            res.send({ subtitles: [] });
        }
    } else {
        console.log(`No language specified for ${id}, returning empty list`);
        res.send({ subtitles: [] });
    }
});

// Endpoint to serve languages.json for the frontend
app.get('/languages.json', (_, res) => {
    res.setHeader('Cache-Control', 'max-age=86400,staleRevalidate=stale-while-revalidate, staleError=stale-if-error, public');
    res.setHeader('Content-Type', 'application/json');
    res.send(languages);
});

module.exports = app
