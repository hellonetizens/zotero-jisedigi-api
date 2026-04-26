// zotero-jisedigi-api.js
// Main plugin file for querying all Jisedigi (NDL Digital Library) APIs

if (Zotero.version >= "8") {
    ChromeUtils.importESModule("resource://gre/modules/FileUtils.sys.mjs");
} else {
    Components.utils.import("resource://gre/modules/FileUtils.jsm");
}

function log(msg) {
    let message = "ZoteroJisedigiAPI: " + msg;
    Zotero.debug(message);
    return message;
}

function createProgressWindow(message, initialProgress = 0) {
    try {
        const progressWindow = new Zotero.ProgressWindow({
            closeOnClick: false
        });

        progressWindow.changeHeadline("Zotero Jisedigi API");
        progressWindow.show();

        const icon = "chrome://zotero/skin/attachment-pdf.svg";
        const progressBar = new progressWindow.ItemProgress(icon, message);

        if (initialProgress > 0) {
            progressBar.setProgress(initialProgress);
        }

        return {
            updateProgress: (progress) => {
                try {
                    const validProgress = Math.min(100, Math.max(0, progress));
                    progressBar.setProgress(validProgress);
                    return validProgress === 100;
                } catch (e) {
                    log("Error updating progress: " + e);
                    return false;
                }
            },
            updateMessage: (newMessage) => {
                try {
                    progressBar.setText(newMessage);
                } catch (e) {
                    log("Error updating message: " + e);
                }
            },
            close: () => {
                try {
                    progressWindow.close();
                } catch (e) {
                    log("Error closing progress window: " + e);
                }
            }
        };
    } catch (e) {
        log("Error creating progress window: " + e);
        return {
            updateProgress: () => false,
            updateMessage: () => {},
            close: () => {}
        };
    }
}

ZoteroJisedigiAPI = {
    id: null,
    version: null,
    rootURI: null,
    initialized: false,
    addedElementIDs: [],
    baseURL: "https://lab.ndl.go.jp/dl",

    // All 14 Jisedigi APIs
    apis: {
        illustration: {
            getById: { method: "GET", path: "/api/illustration/{id}", description: "図版メタデータ取得API" },
            searchByText: { method: "GET", path: "/api/illustration/searchbytext", description: "類似画像検索API（テキストから探す）" },
            searchById: { method: "GET", path: "/api/illustration/searchbyid", description: "類似画像検索API（画像から探す）" },
            randomWithFacet: { method: "GET", path: "/api/illustration/randomwithfacet", description: "ランダム図版出力API（ファセット絞り込み）" },
            random: { method: "GET", path: "/api/illustration/random", description: "ランダム図版出力API" },
            multiGet: { method: "GET", path: "/api/illustration/multi-get", description: "図版メタデータ取得API（複数取得）" }
        },
        book: {
            getById: { method: "GET", path: "/api/book/{id}", description: "資料メタデータ取得API" },
            search: { method: "GET", path: "/api/book/search", description: "資料検索API" },
            layoutText: { method: "GET", path: "/api/book/layouttext/{id}", description: "レイアウト付き全文テキストデータ一括ダウンロードAPI（zip形式）" },
            fulltext: { method: "GET", path: "/api/book/fulltext/{id}", description: "全文テキストデータ一括ダウンロードAPI（zip形式）" },
            fulltextJson: { method: "GET", path: "/api/book/fulltext-json/{id}", description: "全文テキストデータ一括ダウンロードAPI（json）" }
        },
        page: {
            getById: { method: "GET", path: "/api/page/{id}", description: "ページ（コマ）データ取得API" },
            search: { method: "GET", path: "/api/page/search", description: "資料内検索API" },
            layout: { method: "GET", path: "/api/page/layout/{id}", description: "ページ（コマ）レイアウトデータ取得API" }
        }
    },

    init({ id, version, rootURI }) {
        if (this.initialized) return;
        this.id = id;
        this.version = version;
        this.rootURI = rootURI;
        this.initialized = true;
    },

    addToWindow(window) {
        let doc = window.document;

        window.MozXULElement.insertFTLIfNeeded("zotero-jisedigi-api.ftl");

        // Add menu option for Jisedigi API Query
        let menuitem = doc.createXULElement('menuitem');
        menuitem.id = 'zotero-jisedigi-api-item-menu';
        menuitem.class = 'menuitem-iconic zotero-menuitem-jisedigi-api'
        menuitem.setAttribute('data-l10n-id', 'query-jisedigi-apis');
        doc.getElementById('zotero-itemmenu').appendChild(menuitem);
        menuitem.addEventListener('command', () => {
            ZoteroJisedigiAPI.showQueryDialog(window);
        });
        this.storeAddedElement(menuitem);
    },

    addToAllWindows() {
        var windows = Zotero.getMainWindows();
        for (let win of windows) {
            if (!win.ZoteroPane) continue;
            this.addToWindow(win);
        }
    },

    storeAddedElement(elem) {
        if (!elem.id) {
            throw new Error("Element must have an id");
        }
        this.addedElementIDs.push(elem.id);
    },

    removeFromWindow(window) {
        var doc = window.document;
        for (let id of this.addedElementIDs) {
            doc.getElementById(id).remove();
        }
        doc.querySelector('[href="zotero-jisedigi-api.ftl"]').remove();
    },

    removeFromAllWindows() {
        var windows = Zotero.getMainWindows();
        for (let win of windows) {
            if (!win.ZoteroPane) continue;
            this.removeFromWindow(win);
        }
    },

    async queryAPI(endpoint, params = {}) {
        try {
            let url = this.baseURL + endpoint;
            
            // Add query parameters
            if (Object.keys(params).length > 0) {
                const queryString = new URLSearchParams(params).toString();
                url += "?" + queryString;
            }

            log("Querying API: " + url);

            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error("API request failed: " + response.statusText);
            }

            const data = await response.json();
            log("API response received");
            return data;
        } catch (e) {
            log("API query error: " + e.message);
            throw e;
        }
    },

    async searchBooks(query, window) {
        const progress = createProgressWindow("Searching books in Jisedigi...", 0);

        try {
            progress.updateMessage("Querying book search API...");
            const results = await this.queryAPI("/api/book/search", {
                q: query,
                limit: 50
            });

            progress.updateMessage("Processing results...");

            if (results.books && results.books.length > 0) {
                let message = "Found " + results.books.length + " books:\n\n";
                results.books.forEach((book, index) => {
                    message += (index + 1) + ". " + (book.title || "Unknown") + "\n";
                    if (book.creator) message += "   Author: " + book.creator + "\n";
                    if (book.date) message += "   Date: " + book.date + "\n";
                });
                
                window.alert(message);
            } else {
                window.alert("No books found for: " + query);
            }

            progress.updateProgress(100);
        } catch (error) {
            window.alert("Error searching books: " + error.message);
            log("Error: " + error.message);
        } finally {
            progress.close();
        }
    },

    async searchIllustrations(query, window) {
        const progress = createProgressWindow("Searching illustrations in Jisedigi...", 0);

        try {
            progress.updateMessage("Querying illustration search API...");
            const results = await this.queryAPI("/api/illustration/searchbytext", {
                q: query,
                limit: 50
            });

            progress.updateMessage("Processing results...");

            if (results.illustrations && results.illustrations.length > 0) {
                let message = "Found " + results.illustrations.length + " illustrations:\n\n";
                results.illustrations.forEach((ill, index) => {
                    message += (index + 1) + ". " + (ill.title || "Unknown") + "\n";
                });
                
                window.alert(message);
            } else {
                window.alert("No illustrations found for: " + query);
            }

            progress.updateProgress(100);
        } catch (error) {
            window.alert("Error searching illustrations: " + error.message);
            log("Error: " + error.message);
        } finally {
            progress.close();
        }
    },

    async searchPages(query, window) {
        const progress = createProgressWindow("Searching pages in Jisedigi...", 0);

        try {
            progress.updateMessage("Querying page search API...");
            const results = await this.queryAPI("/api/page/search", {
                q: query,
                limit: 50
            });

            progress.updateMessage("Processing results...");

            if (results.pages && results.pages.length > 0) {
                let message = "Found " + results.pages.length + " pages:\n\n";
                results.pages.forEach((page, index) => {
                    message += (index + 1) + ". Page " + (page.page_id || "Unknown") + "\n";
                });
                
                window.alert(message);
            } else {
                window.alert("No pages found for: " + query);
            }

            progress.updateProgress(100);
        } catch (error) {
            window.alert("Error searching pages: " + error.message);
            log("Error: " + error.message);
        } finally {
            progress.close();
        }
    },

    async getBookMetadata(bookId, window) {
        const progress = createProgressWindow("Fetching book metadata...", 0);

        try {
            progress.updateMessage("Querying book metadata API...");
            const book = await this.queryAPI("/api/book/" + bookId);

            progress.updateMessage("Processing metadata...");

            let message = "Book Metadata:\n\n";
            message += "Title: " + (book.title || "Unknown") + "\n";
            message += "Creator: " + (book.creator || "Unknown") + "\n";
            message += "Date: " + (book.date || "Unknown") + "\n";
            message += "Description: " + (book.description || "Unknown") + "\n";
            message += "ID: " + book.id + "\n";
            
            window.alert(message);

            progress.updateProgress(100);
        } catch (error) {
            window.alert("Error fetching metadata: " + error.message);
            log("Error: " + error.message);
        } finally {
            progress.close();
        }
    },

    async getRandomIllustration(window) {
        const progress = createProgressWindow("Fetching random illustration...", 0);

        try {
            progress.updateMessage("Querying random illustration API...");
            const result = await this.queryAPI("/api/illustration/random");

            progress.updateMessage("Processing result...");

            let message = "Random Illustration:\n\n";
            message += "Title: " + (result.title || "Unknown") + "\n";
            message += "ID: " + (result.id || "Unknown") + "\n";
            
            window.alert(message);

            progress.updateProgress(100);
        } catch (error) {
            window.alert("Error fetching random illustration: " + error.message);
            log("Error: " + error.message);
        } finally {
            progress.close();
        }
    },

    showQueryDialog(window) {
        let query = window.prompt("Enter search query:", "");
        
        if (query === null) return; // User cancelled

        let options = "Books\nIllustrations\nPages\nRandom Illustration\nBook Metadata (by ID)";
        let choice = window.prompt("Select what to query:\n" + options, "Books");

        if (choice === null) return;

        switch (choice.toLowerCase()) {
            case "books":
                this.searchBooks(query, window);
                break;
            case "illustrations":
                this.searchIllustrations(query, window);
                break;
            case "pages":
                this.searchPages(query, window);
                break;
            case "random illustration":
                this.getRandomIllustration(window);
                break;
            case "book metadata (by id)":
                this.getBookMetadata(query, window);
                break;
            default:
                window.alert("Invalid selection");
        }
    }
};
