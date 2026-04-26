// zotero-jisedigi-api.js
// Optimized plugin for Zotero 6.999 - 9.* with improved error handling and performance

if (Zotero.version >= "8") {
    ChromeUtils.importESModule("resource://gre/modules/FileUtils.sys.mjs");
} else {
    Components.utils.import("resource://gre/modules/FileUtils.jsm");
}

function log(msg) {
    const message = `ZoteroJisedigiAPI: ${msg}`;
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
                    log(`Error updating progress: ${e}`);
                    return false;
                }
            },
            updateMessage: (newMessage) => {
                try {
                    progressBar.setText(newMessage);
                } catch (e) {
                    log(`Error updating message: ${e}`);
                }
            },
            close: () => {
                try {
                    progressWindow.close();
                } catch (e) {
                    log(`Error closing progress window: ${e}`);
                }
            }
        };
    } catch (e) {
        log(`Error creating progress window: ${e}`);
        return {
            updateProgress: () => false,
            updateMessage: () => {},
            close: () => {}
        };
    }
}

const ZoteroJisedigiAPI = {
    id: null,
    version: null,
    rootURI: null,
    initialized: false,
    addedElementIDs: [],
    baseURL: "https://lab.ndl.go.jp/dl",

    init({ id, version, rootURI }) {
        if (this.initialized) return;
        this.id = id;
        this.version = version;
        this.rootURI = rootURI;
        this.initialized = true;
        log("Plugin initialized");
    },

    addToWindow(window) {
        const doc = window.document;

        window.MozXULElement.insertFTLIfNeeded("zotero-jisedigi-api.ftl");

        const menuitem = doc.createXULElement('menuitem');
        menuitem.id = 'zotero-jisedigi-api-item-menu';
        menuitem.class = 'menuitem-iconic zotero-menuitem-jisedigi-api';
        menuitem.setAttribute('data-l10n-id', 'query-jisedigi-apis');
        doc.getElementById('zotero-itemmenu').appendChild(menuitem);
        menuitem.addEventListener('command', () => {
            this.showQueryDialog(window);
        });
        this.storeAddedElement(menuitem);
    },

    addToAllWindows() {
        const windows = Zotero.getMainWindows();
        for (const win of windows) {
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
        const doc = window.document;
        for (const id of this.addedElementIDs) {
            const elem = doc.getElementById(id);
            if (elem) elem.remove();
        }
        const ftlLink = doc.querySelector('[href="zotero-jisedigi-api.ftl"]');
        if (ftlLink) ftlLink.remove();
    },

    removeFromAllWindows() {
        const windows = Zotero.getMainWindows();
        for (const win of windows) {
            if (!win.ZoteroPane) continue;
            this.removeFromWindow(win);
        }
    },

    async queryAPI(endpoint, params = {}) {
        try {
            let url = this.baseURL + endpoint;
            
            if (Object.keys(params).length > 0) {
                const queryString = new URLSearchParams(params).toString();
                url += `?${queryString}`;
            }

            log(`Querying API: ${url}`);

            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.statusText}`);
            }

            const data = await response.json();
            log("API response received");
            return data;
        } catch (e) {
            log(`API query error: ${e.message}`);
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
                let message = `Found ${results.books.length} books:\n\n`;
                results.books.forEach((book, index) => {
                    message += `${index + 1}. ${book.title || "Unknown"}\n`;
                    if (book.creator) message += `   Author: ${book.creator}\n`;
                    if (book.date) message += `   Date: ${book.date}\n`;
                    if (book.id) message += `   ID: ${book.id}\n`;
                });
                
                window.alert(message);
            } else {
                window.alert(`No books found for: ${query}`);
            }

            progress.updateProgress(100);
        } catch (error) {
            window.alert(`Error searching books: ${error.message}`);
            log(`Error: ${error.message}`);
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
                let message = `Found ${results.illustrations.length} illustrations:\n\n`;
                results.illustrations.forEach((ill, index) => {
                    message += `${index + 1}. ${ill.title || "Unknown"}\n`;
                    if (ill.id) message += `   ID: ${ill.id}\n`;
                });
                
                window.alert(message);
            } else {
                window.alert(`No illustrations found for: ${query}`);
            }

            progress.updateProgress(100);
        } catch (error) {
            window.alert(`Error searching illustrations: ${error.message}`);
            log(`Error: ${error.message}`);
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
                let message = `Found ${results.pages.length} pages:\n\n`;
                results.pages.forEach((page, index) => {
                    message += `${index + 1}. Page ${page.page_id || "Unknown"}\n`;
                });
                
                window.alert(message);
            } else {
                window.alert(`No pages found for: ${query}`);
            }

            progress.updateProgress(100);
        } catch (error) {
            window.alert(`Error searching pages: ${error.message}`);
            log(`Error: ${error.message}`);
        } finally {
            progress.close();
        }
    },

    async getBookMetadata(bookId, window) {
        const progress = createProgressWindow("Fetching book metadata...", 0);

        try {
            progress.updateMessage("Querying book metadata API...");
            const book = await this.queryAPI(`/api/book/${bookId}`);

            progress.updateMessage("Processing metadata...");

            let message = "Book Metadata:\n\n";
            message += `Title: ${book.title || "Unknown"}\n`;
            message += `Creator: ${book.creator || "Unknown"}\n`;
            message += `Date: ${book.date || "Unknown"}\n`;
            message += `Description: ${book.description || "Unknown"}\n`;
            message += `ID: ${book.id}\n`;
            
            window.alert(message);

            progress.updateProgress(100);
        } catch (error) {
            window.alert(`Error fetching metadata: ${error.message}`);
            log(`Error: ${error.message}`);
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
            message += `Title: ${result.title || "Unknown"}\n`;
            message += `ID: ${result.id || "Unknown"}\n`;
            
            window.alert(message);

            progress.updateProgress(100);
        } catch (error) {
            window.alert(`Error fetching random illustration: ${error.message}`);
            log(`Error: ${error.message}`);
        } finally {
            progress.close();
        }
    },

    showQueryDialog(window) {
        const query = window.prompt("Enter search query or ID:", "");
        
        if (query === null) return;

        const options = "Search Books\nSearch Illustrations\nSearch Pages\nGet Book Metadata\nRandom Illustration";
        const choice = window.prompt(`Select what to query:\n${options}`, "Search Books");

        if (choice === null) return;

        switch (choice.toLowerCase()) {
            case "search books":
                this.searchBooks(query, window);
                break;
            case "search illustrations":
                this.searchIllustrations(query, window);
                break;
            case "search pages":
                this.searchPages(query, window);
                break;
            case "get book metadata":
                this.getBookMetadata(query, window);
                break;
            case "random illustration":
                this.getRandomIllustration(window);
                break;
            default:
                window.alert("Invalid selection");
        }
    }
};
