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
├── docker-compose.yaml      # Docker deployment
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
   Edit the `.env` file and add your TMDB API key:
   ```env
   NODE_ENV=production
   PORT=64395
   TMDB_API=your_tmdb_api_key_here
   CONFIG_URL=http://localhost:64395
   ```

3. **Start with Docker:**
   ```bash
   docker-compose up -d
   ```

4. **Access the addon:**
   - Configuration: http://localhost:64395/configure

### Option 2: Manual Development

1. **Install dependencies:**
   ```bash
   # Backend
   cd backend && npm install

   # Frontend
   cd ../frontend && npm install
   ```

2. **Configure environment:**
   ```bash
   # Create .env file in root directory
   NODE_ENV=development
   PORT=64395
   TMDB_API=your_tmdb_api_key_here
   CONFIG_URL=http://localhost:64395
   ```

3. **Start development servers:**
   ```bash
   # Backend (from backend directory)
   npm start

   # Frontend (from frontend directory)
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

| Variable   | Description         | Required | Default           |
|------------|---------------------|----------|-------------------|
| `NODE_ENV` | Environment mode    | No       | `production`      |
| `PORT`     | Server port         | No       | `64395`           |
| `TMDB_API` | TMDB API key        | **Yes**  | -                 |
| `CONFIG_URL`| Configuration URL   | No       | `http://localhost:64395`|

### Getting TMDB API Key

1. Visit [TMDB](https://www.themoviedb.org/)
2. Create a free account
3. Go to Settings → API
4. Request an API key
5. Add it to your `.env` file

### Adding to Stremio

1. Start the addon server
2. Visit the configuration page: `http://localhost:64395/configure`
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
      - "64395:64395"  # Custom port
    environment:
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

```bash
# Backend
npm start          # Start production server
npm run dev        # Start development server

# Frontend
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build

# Docker
docker-compose up  # Start with Docker
```

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
- Check if port 64395 is available
- Verify environment variables in .env file

## 🙏 Acknowledgments

- **Gestdown API** - For providing the subtitle data
- **[stremio-addic7ed](https://github.com/dexter21767/stremio-addic7ed)** - The boilerplate and structure of this addon were based on this project.
- **sub2vtt** - Thanks to [dexter21767](https://github.com/dexter21767/sub2vtt) for the original project
- **Addic7ed** - For the original subtitle database
- **TMDB** - For metadata and series information
- **Stremio** - For the amazing media center platform
