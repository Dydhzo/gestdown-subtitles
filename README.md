# 🎬 Gestdown Subtitles for Stremio

Subtitle addon for Stremio that provides subtitles for TV series through the Gestdown API. Built with Vue.js 3 and Node.js for an exceptional user experience.

## ✨ Features

- 🎯 **TV Series Only** - Works exclusively with TV series through the Gestdown API
- 🎨 **Modern Interface** - Beautiful, responsive configuration page with dark theme
- ⚡ **Lightning Fast** - Multi-level caching system for instant subtitle loading
- 🔄 **On-the-fly VTT Conversion** - Subtitles are converted to VTT format internally with advanced, language-aware character encoding support.
- 🛡️ **Reliable** - Built with professional error handling and retry mechanisms

## 🏗️ Architecture

```
gestdown-subtitles/
├── backend/                 # Node.js Express server
│   ├── gestdown.js         # Main subtitle logic
│   ├── tmdb.js             # TMDB metadata integration
│   ├── index.js            # Express server setup
│   ├── manifest.json       # Stremio addon manifest
│   ├── languages.json      # Supported languages
│   └── lib/
│       └── gestdownApi.js  # Gestdown API client
├── frontend/               # Vue.js 3 configuration interface
│   ├── src/
│   │   ├── components/     # Vue components
│   │   ├── views/          # Page views
│   │   ├── stores/         # Pinia state management
│   │   └── router/         # Vue Router setup
│   ├── public/             # Static assets
│   └── dist/               # Built frontend (production)
├── docker-compose.yaml      # Docker Compose setup
├── Dockerfile             # Multi-stage Docker build
└── .env                   # Environment configuration
```

## 🚀 Quick Start

### Option 1: Docker (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Dydhzo/gestdown-subtitles.git
   cd gestdown-subtitles
   ```

2. **Configure environment:**
   Create a `.env` file in the root directory and add the following configuration:
   ```env
   # The environment mode, 'production' or 'development'
   NODE_ENV=production

   # The port the server will run on. Change this if 64395 is in use.
   PORT=64395

   # Your TMDB API key (required)
   TMDB_API=your_tmdb_api_key_here

   # The public-facing URL for the addon configuration.
   # For local Docker, this should be http://localhost:PORT
   CONFIG_URL=http://localhost:64395
   ```
   **Note:** Make sure the `PORT` in `CONFIG_URL` matches the `PORT` variable above.

3. **Start with Docker:**
   ```bash
   docker-compose up -d
   ```

4. **Access the addon:**
   - The configuration URL is defined by `CONFIG_URL` in your `.env` file. By default, it is: http://localhost:64395/configure

### Option 2: Manual Development

For those who want to modify the code.

1.  **Install All Dependencies:**
    From the root directory, this single command will install everything needed.
    ```bash
    npm run install:all
    ```

2.  **Configure Environment for Development:**
    Create a `.env` file in the root directory and set the mode to `development`.
    ```env
    NODE_ENV=development
    PORT=64395
    TMDB_API=your_tmdb_api_key_here
    CONFIG_URL=http://localhost:64395
    ```
    > **Note:** The frontend dev server runs on port 3000 and will proxy requests to the backend on the `PORT` specified above.

3.  **Start Both Development Servers:**
    From the root directory, this single command starts both the backend and frontend with live-reloading.
    ```bash
    npm run dev
    ```

## 🔧 Configuration

### Environment Variables

| Variable   | Description         | Required | Default           |
|------------|---------------------|----------|-------------------|
| `NODE_ENV` | Environment mode    | No       | `production`      |
| `PORT`     | Server port         | No       | `64395` (configurable in `.env`) |
| `TMDB_API` | TMDB API key        | **Yes**  | -                 |
| `CONFIG_URL`| Configuration URL   | No       | `http://localhost:{PORT}` (configurable in `.env`)|

### Getting TMDB API Key

1. Visit [TMDB](https://www.themoviedb.org/)
2. Create a free account
3. Go to Settings → API
4. Request an API key
5. Add it to your `.env` file

### Adding to Stremio

1. Start the addon server
2. Visit the configuration page (e.g., `http://localhost:64395/configure`, depending on your `.env` file).
3. Select your preferred subtitle language
4. Click "Install to Stremio" - the addon will be automatically added

## 📦 Dependencies

### Backend
- **Express.js** - Web server framework
- **Axios** - HTTP client for API requests
- **NodeCache** - In-memory caching system
- **Slugify** - URL-friendly string conversion
- **Dotenv** - Environment variable management

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Tailwind CSS** - Utility-first CSS framework
- **Pinia** - State management for Vue
- **Vue Router** - Official router for Vue.js
- **Vite** - Fast build tool and dev server

## 🎯 API Endpoints

| Endpoint                      | Method | Description             |
|-------------------------------|--------|-------------------------|
| `/configure`                  | GET    | Configuration interface |
| `/manifest.json`              | GET    | Default manifest        |
| `/:config/manifest.json`      | GET    | Configured manifest     |
| `/:config/subtitles/:type/:id.json`| GET    | Subtitle search         |
| `/languages.json`             | GET    | Available languages     |
| `/sub.vtt`                    | GET    | On-the-fly VTT conversion|

## 🔄 How It Works

1. **User selects a series** in Stremio
2. **Stremio requests subtitles** using IMDB ID
3. **TMDB converts** IMDB ID to series title
4. **Gestdown API searches** for the series by title
5. **Subtitles are retrieved** for the specific episode
6. **A special URL is generated**, pointing back to the addon itself.
7. **The addon converts the subtitle** to VTT format on-the-fly, intelligently handling character encoding based on the subtitle's language.
8. **Caching system** stores results for faster future requests

## 🐳 Docker Deployment

### Production Deployment

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Custom Configuration

```yaml
# docker-compose.override.yml
services:
  gestdown-subtitles:
    image: dydhzo/gestdown-subtitles:latest
    container_name: gestdown-subtitles
    ports:
      - "64395:64395"  # Example: Map container port 64395 to host port 64395
    environment:
      - NODE_ENV=production
      - PORT=64395 # Tell the container to run on port 64395
      - TMDB_API=your_tmdb_api_key_here
      - CONFIG_URL=https://your-domain.com
    restart: unless-stopped
```

## 🛠️ Development

### Project Structure

- **Backend**: Express.js server handling Stremio addon protocol
- **Frontend**: Vue.js 3 SPA for configuration interface
- **Docker**: Multi-stage build for optimized production deployment

### Available Scripts

All scripts are meant to be run from the project's root directory.

| Script | Description |
|---|---|
| `npm run dev` | Starts both backend and frontend in development mode. |
| `npm start` | Starts the backend server for production use. |
| `npm run build` | Builds the frontend application for production. |
| `npm run install:all` | Installs all dependencies for the root, backend, and frontend. |

## 🐛 Troubleshooting

### Common Issues

**Addon not appearing in Stremio:**
- Check if the server is running on the correct port
- Verify the manifest URL is accessible
- Ensure TMDB API key is valid

**No subtitles found:**
- Verify the series exists on Addic7ed
- Check if the language is supported
- Try different language variations

**Docker issues:**
- Ensure Docker and Docker Compose are installed
- Check if the port specified in your `.env` file is available on your host machine.
- Verify all required environment variables are set correctly in the `.env` file.

## 🙏 Acknowledgments

- **Gestdown API** - For providing the subtitle data
- **[stremio-addic7ed](https://github.com/dexter21767/stremio-addic7ed)** - The boilerplate and structure of this addon were based on this project.
- **sub2vtt** - Thanks to [dexter21767](https://github.com/dexter21767/sub2vtt) for the original project
- **Addic7ed** - For the original subtitle database
- **TMDB** - For metadata and series information
- **Stremio** - For the amazing media center platform
