# Deployment Guide

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: April 26, 2026

## Quick Start

### Installation

1. **Download Zotero Beta**
   - Visit: https://www.zotero.org/support/beta_builds
   - Download and install Zotero 7.0+

2. **Install Plugin**
   - Open Zotero
   - Go to: Tools → Add-ons
   - Click gear icon → Install Add-on From File
   - Select: `dist/zotero-jisedigi-api-1.0.0.xpi`

3. **Verify Installation**
   - Restart Zotero
   - Check: Tools → Add-ons → Extensions
   - Should see: "Zotero Jisedigi API Query"

### Configuration

1. **Open Preferences**
   - Tools → Add-ons → Extensions
   - Find plugin → Preferences

2. **Configure API Settings**
   - Set NDL Digital Library API endpoint
   - Configure authentication if needed
   - Save preferences

3. **Test Functionality**
   - Search for items in Jisedigi
   - Verify metadata retrieval
   - Check console for errors

## Build Information

### Build System
- **Tool**: Python 3
- **Build Time**: < 1 second
- **XPI Size**: 5.6 KB

### Build Process
```bash
# Build plugin
python3 build.py

# Output
# XPI file created: dist/zotero-jisedigi-api-1.0.0.xpi
# File size: 5654 bytes
```

### Package Contents
```
zotero-jisedigi-api-1.0.0.xpi
├── bootstrap.js
├── manifest.json
├── prefs.xhtml
├── zotero-jisedigi-api.js
├── chrome/skin/default/zotero-jisedigi/
├── defaults/preferences/
└── locale/en-US/
```

## Deployment Checklist

- [x] Build script executed successfully
- [x] XPI package created (5.6 KB)
- [x] Manifest validated
- [x] All files included
- [x] Documentation complete
- [x] Ready for production

## Features

- Query NDL Digital Library (Jisedigi) APIs
- Search books, illustrations, pages
- Zotero item integration
- Preferences UI for API configuration
- Localization support (English)

## Troubleshooting

### Plugin Not Loading
1. Check Zotero version (6.999+)
2. Check browser console for errors
3. Verify XPI file integrity
4. Try reinstalling plugin

### Build Issues
1. Ensure Python 3 installed
2. Check file permissions
3. Verify source files present
4. Check disk space

### API Issues
1. Verify API endpoint URL
2. Check network connectivity
3. Verify API credentials
4. Check API rate limits

## Support

### Documentation
- [README.md](README.md) - Project overview
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Project details

### Resources
- [Zotero Plugin Development](https://www.zotero.org/support/dev/zotero_7_for_developers)
- [NDL Digital Library](https://www.ndl.go.jp/)
- [Jisedigi API](https://www.ndl.go.jp/en/service/api.html)

## Version History

### v1.0.0 (April 26, 2026)
- ✅ Initial release
- ✅ Jisedigi API integration
- ✅ Production ready
- ✅ Zotero 6.999 - 9.* support

## License

MIT - See LICENSE file

---

**Last Updated**: April 26, 2026  
**Status**: 🟢 Production Ready  
**Maintainer**: Zotero Jisedigi Contributors
