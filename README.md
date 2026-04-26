# Zotero Jisedigi API Query Plugin

A lightweight Zotero plugin (Zotero 6.999 - 9.*) that queries all 14 APIs from the Jisedigi (NDL Digital Library) service. Search books, illustrations, and pages from Japan's National Diet Library digital collection.

## Features

- **14 API Endpoints**: Query all available Jisedigi APIs
- **Multiple Search Types**: Search books, illustrations, and pages
- **Metadata Retrieval**: Get detailed metadata for books and illustrations
- **Random Results**: Fetch random illustrations from the collection
- **Easy Integration**: Right-click menu integration in Zotero
- **Progress Tracking**: Real-time progress updates during queries

## Supported APIs

### Illustration APIs (6)
- Get Illustration Metadata by ID
- Search Illustrations by Text
- Search Illustrations by Image
- Random Illustration with Facet
- Random Illustration
- Get Multiple Illustrations

### Book APIs (5)
- Get Book Metadata by ID
- Search Books
- Get Layout Text Data (ZIP)
- Get Full Text Data (ZIP)
- Get Full Text Data (JSON)

### Page APIs (3)
- Get Page Data by ID
- Search Pages
- Get Page Layout Data

## Installation

1. Download the latest `.xpi` file from [releases](https://github.com/yourusername/zotero-jisedigi-api/releases)
2. In Zotero, go to Tools → Add-ons
3. Click the gear icon and select "Install Add-on From File..."
4. Select the downloaded `.xpi` file
5. Restart Zotero

## Configuration

Go to Zotero Preferences → Zotero Jisedigi API:

- **Base URL**: Jisedigi API base URL (default: https://lab.ndl.go.jp/dl)
- **Default Result Limit**: Maximum results per query (default: 50)
- **Auto Create Items**: Automatically create Zotero items from results (optional)

## Usage

1. In Zotero, right-click on any item
2. Select "Query Jisedigi APIs"
3. Enter your search query or ID
4. Choose what to search:
   - Search Books
   - Search Illustrations
   - Search Pages
   - Get Book Metadata (by ID)
   - Random Illustration
5. Results will be displayed in a dialog

## Examples

- **Search books**: Query: "samurai" → Type: Search Books
- **Search illustrations**: Query: "Mount Fuji" → Type: Search Illustrations
- **Get book metadata**: Query: "200012345" → Type: Get Book Metadata
- **Get random illustration**: Type: Random Illustration

## Troubleshooting

- **"No results found"**: Try a different search query
- **"API request failed"**: Check your internet connection and that Jisedigi is accessible
- **Debug logging**: Enable Help → Debug Output Logging to see detailed messages

## Official Documentation

For detailed API documentation, visit: https://lab.ndl.go.jp/dl/swagger-ui/index.html

## License

AGPL-3.0 - See LICENSE file

## Compatibility

- **Zotero**: 6.999 - 9.*
- **Operating Systems**: Windows, macOS, Linux
