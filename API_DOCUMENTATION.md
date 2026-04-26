# Jisedigi API Documentation

This document lists all 14 APIs available in the Jisedigi (NDL Digital Library) service that this plugin queries.

## API Endpoints

### Illustration APIs (6 endpoints)

#### 1. Get Illustration Metadata by ID
- **Endpoint:** `GET /api/illustration/{id}`
- **Description:** 図版メタデータ取得API
- **Parameters:** 
  - `id` (required): Illustration ID
- **Returns:** Illustration metadata including title, creator, date, etc.

#### 2. Search Illustrations by Text
- **Endpoint:** `GET /api/illustration/searchbytext`
- **Description:** 類似画像検索API（テキストから探す）
- **Parameters:**
  - `q` (required): Search query text
  - `limit` (optional): Maximum results (default: 50)
- **Returns:** Array of illustrations matching the text query

#### 3. Search Illustrations by Image
- **Endpoint:** `GET /api/illustration/searchbyid`
- **Description:** 類似画像検索API（画像から探す）
- **Parameters:**
  - `id` (required): Reference illustration ID
  - `limit` (optional): Maximum results (default: 50)
- **Returns:** Array of similar illustrations

#### 4. Random Illustration with Facet
- **Endpoint:** `GET /api/illustration/randomwithfacet`
- **Description:** ランダム図版出力API（ファセット絞り込み）
- **Parameters:**
  - `facet` (optional): Facet filter
- **Returns:** Random illustration with facet filtering

#### 5. Random Illustration
- **Endpoint:** `GET /api/illustration/random`
- **Description:** ランダム図版出力API
- **Parameters:** None
- **Returns:** Random illustration from the collection

#### 6. Get Multiple Illustrations
- **Endpoint:** `GET /api/illustration/multi-get`
- **Description:** 図版メタデータ取得API（複数取得）
- **Parameters:**
  - `ids` (required): Comma-separated illustration IDs
- **Returns:** Array of illustration metadata

### Book APIs (5 endpoints)

#### 7. Get Book Metadata by ID
- **Endpoint:** `GET /api/book/{id}`
- **Description:** 資料メタデータ取得API
- **Parameters:**
  - `id` (required): Book ID
- **Returns:** Book metadata including title, creator, date, description, etc.

#### 8. Search Books
- **Endpoint:** `GET /api/book/search`
- **Description:** 資料検索API
- **Parameters:**
  - `q` (required): Search query
  - `limit` (optional): Maximum results (default: 50)
  - `offset` (optional): Result offset for pagination
- **Returns:** Array of books matching the query

#### 9. Get Layout Text Data (ZIP)
- **Endpoint:** `GET /api/book/layouttext/{id}`
- **Description:** レイアウト付き全文テキストデータ一括ダウンロードAPI（zip形式）
- **Parameters:**
  - `id` (required): Book ID
- **Returns:** ZIP file containing layout text data

#### 10. Get Full Text Data (ZIP)
- **Endpoint:** `GET /api/book/fulltext/{id}`
- **Description:** 全文テキストデータ一括ダウンロードAPI（zip形式）
- **Parameters:**
  - `id` (required): Book ID
- **Returns:** ZIP file containing full text data

#### 11. Get Full Text Data (JSON)
- **Endpoint:** `GET /api/book/fulltext-json/{id}`
- **Description:** 全文テキストデータ一括ダウンロードAPI（json）
- **Parameters:**
  - `id` (required): Book ID
- **Returns:** JSON file containing full text data

### Page APIs (3 endpoints)

#### 12. Get Page Data by ID
- **Endpoint:** `GET /api/page/{id}`
- **Description:** ページ（コマ）データ取得API
- **Parameters:**
  - `id` (required): Page ID
- **Returns:** Page metadata and content

#### 13. Search Pages
- **Endpoint:** `GET /api/page/search`
- **Description:** 資料内検索API
- **Parameters:**
  - `q` (required): Search query
  - `limit` (optional): Maximum results (default: 50)
- **Returns:** Array of pages matching the query

#### 14. Get Page Layout Data
- **Endpoint:** `GET /api/page/layout/{id}`
- **Description:** ページ（コマ）レイアウトデータ取得API
- **Parameters:**
  - `id` (required): Page ID
- **Returns:** Page layout data

## Base URL

All endpoints are accessed via:
```
https://lab.ndl.go.jp/dl
```

## Response Format

All APIs return JSON responses with the following general structure:

```json
{
  "id": "unique-identifier",
  "title": "Item Title",
  "creator": "Author/Creator",
  "date": "Publication Date",
  "description": "Item Description",
  "...": "other fields"
}
```

## Error Handling

If an API request fails, the response will include an error message:

```json
{
  "error": "Error message",
  "status": 400
}
```

## Rate Limiting

The Jisedigi API has rate limiting. Please be respectful with your queries.

## Official Documentation

For the official API documentation, visit:
https://lab.ndl.go.jp/dl/swagger-ui/index.html

## Examples

### Search for books about "samurai"
```
GET https://lab.ndl.go.jp/dl/api/book/search?q=samurai&limit=10
```

### Get random illustration
```
GET https://lab.ndl.go.jp/dl/api/illustration/random
```

### Get book metadata
```
GET https://lab.ndl.go.jp/dl/api/book/200012345
```

### Search pages
```
GET https://lab.ndl.go.jp/dl/api/page/search?q=Mount%20Fuji&limit=20
```

---

**Last Updated:** April 26, 2024  
**API Version:** v3  
**Total Endpoints:** 14
