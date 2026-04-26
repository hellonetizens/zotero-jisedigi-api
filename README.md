# Zotero Jisedigi API Query Plugin

A comprehensive Zotero plugin that queries all 14 APIs from the Jisedigi (NDL Digital Library) service. Search books, illustrations, pages, and retrieve metadata from Japan's National Diet Library digital collection.

## Features

- **14 API Endpoints**: Query all available Jisedigi APIs
- **Multiple Search Types**: Search books, illustrations, and pages
- **Metadata Retrieval**: Get detailed metadata for books and illustrations
- **Random Results**: Fetch random illustrations from the collection
- **Easy Integration**: Right-click menu integration in Zotero
- **Progress Tracking**: Real-time progress updates during queries
- **Error Handling**: Comprehensive error messages and logging

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

## Usage

### Basic Search

1. In Zotero, right-click on any item
2. Select "Query Jisedigi APIs"
3. Enter your search query
4. Choose what to search:
   - Books
   - Illustrations
   - Pages
   - Random Illustration
   - Book Metadata (by ID)
5. Results will be displayed in a dialog

### Examples

**Search for books about "samurai":**
- Query: samurai
- Type: Books
- Results: All books in Jisedigi matching "samurai"

**Search for illustrations about "Mount Fuji":**
- Query: Mount Fuji
- Type: Illustrations
- Results: All illustrations matching "Mount Fuji"

**Get random illustration:**
- Query: (any text, will be ignored)
- Type: Random Illustration
- Results: A random illustration from the collection

**Get book metadata:**
- Query: 200012345 (book ID)
- Type: Book Metadata (by ID)
- Results: Detailed metadata for the specified book

## Configuration

Go to Zotero Preferences → Zotero Jisedigi API to configure:

- **Base URL**: The Jisedigi API base URL (default: https://lab.ndl.go.jp/dl)
- **Default Result Limit**: Maximum number of results per query (default: 50)
- **Auto Create Items**: Automatically create Zotero items from search results (optional)

## API Documentation

For detailed API documentation, visit:
https://lab.ndl.go.jp/dl/swagger-ui/index.html

## Troubleshooting

### "API request failed" error
- Check your internet connection
- Verify the Jisedigi service is accessible
- Check the Zotero debug log (Help → Debug Output Logging)

### No results found
- Try a different search query
- Check that your search terms are in Japanese or English
- Verify the API is working at https://lab.ndl.go.jp/dl/swagger-ui/index.html

### Plugin not appearing
- Restart Zotero completely
- Check that Zotero version is 6.999 or later
- Try reinstalling the plugin

## Debug Logging

To enable debug logging:
1. Go to Help → Debug Output Logging
2. Perform your query
3. Check the debug output for messages starting with "ZoteroJisedigiAPI:"

## Development

### Building the Plugin

```bash
python3 build.py
```

This creates an `.xpi` file in the `dist/` directory.

### Project Structure

```
src/
├── bootstrap.js              # Plugin lifecycle
├── zotero-jisedigi-api.js   # Main plugin logic
├── manifest.json            # Plugin manifest
├── prefs.xhtml              # Preferences UI
├── defaults/
│   └── preferences/
│       └── defaults.js      # Default settings
├── locale/
│   └── en-US/
│       └── zotero-jisedigi-api.ftl  # Localization
└── chrome/
    └── skin/
        └── default/
            └── zotero-jisedigi/
                └── api-icon.svg  # Plugin icon
```

## License

AGPL-3.0 - See LICENSE file for details

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Acknowledgments

- Based on the Zotero extension API
- Integrates with Jisedigi (NDL Digital Library) APIs
- Inspired by the Zotero OCR plugin

## Support

For issues or questions:
1. Check the troubleshooting section
2. Enable debug logging
3. Open a GitHub issue with:
   - Your Zotero version
   - Plugin version
   - Error message
   - Debug log output

---

**Version:** 1.0.0  
**Zotero Compatibility:** 6.999 - 9.*  
**License:** AGPL-3.0
