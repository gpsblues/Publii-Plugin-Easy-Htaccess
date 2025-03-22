class EasyHtaccess {
    constructor(API, name, config) {
        this.API = API;
        this.name = name;
        this.config = config || {};
    }

    addEvents() {
        this.API.addEvent('beforeRender', this.addFile, 1, this);
    }

    addFile(rendererInstance) {
        if (this.config.destroy) {
            this.createHtaccessFile("## Empty file (Removes Directives = true)");
            return;
        }

        // Array con tutte le sezioni
        const sections = [
            this.generateGzip(),                                    // Compressione
            this.generateExpiresHeaders(rendererInstance),          // Expires Headers
            this.generateRedirects(),                               // Redirects
            this.generateSeoRedirects(),                            // SEO Redirects
            this.generate404(),                                     // Pagina 404 personalizzata
            this.generateFileProtection(),                          // Protezione dei file
            this.generateCustomDirectives()                         // Direttive personalizzate
        ]
        .filter(Boolean)    //rimuove le sezioni "falsy" ('', null, undefined, 0, ecc.)
        .join('\n\n');      //converte l'array in una stringa separando le sezioni da due righe vuote     

        //formatta il contenuto del file
        this.createHtaccessFile(this.cleanFinalContent(sections));
    }

    cleanFinalContent(content) {
        return content
            .replace(/^[ \t]+/gm, '')       // Rimuove le indentazioni
            .replace(/\n{3,}/g, '\n\n')     // Riduce righe vuote multiple
            .trim();
    }

    generateGzip() {
        if (!this.config.gzip) return "";  // Empty string se 'Gzip compression' è disabilitato
        return `
            ## Enable Gzip compression
            <IfModule mod_deflate.c>
                AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css
                AddOutputFilterByType DEFLATE text/javascript application/javascript application/json
                AddOutputFilterByType DEFLATE application/x-javascript application/xml application/xml+rss
                AddOutputFilterByType DEFLATE application/font-woff2 application/font-woff application/font-ttf
                AddOutputFilterByType DEFLATE image/svg+xml
            </IfModule>
        `.trim().replace(/^\s+/gm, '');
    }

    generateExpiresHeaders(rendererInstance){
        if (!this.config.expires) return ""; // Empty string se 'Expires headers' è disabilitato
        //sezione da costruire

        // determino il gersioning
        const versioning = rendererInstance.siteConfig.advanced.versionSuffix || false

        const chacheProfile = this.config.cache || "0";
        //Oggetto JS che contiene opzione-cache, si richiama con optimisation[n]
        const optimisation = {
            "0": `
              ## Cache disabled
              <IfModule mod_expires.c>
                ExpiresActive Off
              </IfModule>
              <IfModule mod_headers.c>
                # Disable cache for all resources
                Header set Cache-Control "no-store, no-cache, must-revalidate, max-age=0"
                Header set Pragma "no-cache"
                Header set Expires "0"
              </IfModule>
            `,
          
            "1": `
              ## Cache optimisation for Frequent Updates
              <IfModule mod_expires.c>
                ExpiresActive On
                ExpiresDefault "access plus 1 week"
                # Images (medium cache)
                ExpiresByType image/jpeg "access plus 6 months"
                ExpiresByType image/png "access plus 6 months"
                ExpiresByType image/webp "access plus 6 months"
                ExpiresByType image/svg+xml "access plus 6 months"
                ExpiresByType image/x-icon "access plus 6 months"
                # CSS/JS (long cache with versioning, otherwise short)
                ExpiresByType text/css "access plus 1 year"
                ExpiresByType application/javascript "access plus 1 year"
                # Dynamic content (short cache)
                ExpiresByType text/html "access plus 2 hours"
                ExpiresByType application/rss+xml "access plus 1 hour"
              </IfModule>
              ${versioning ? `
              <IfModule mod_headers.c>
                # Force "immutable" cache for versioned files
                <FilesMatch "\.(css|js)(\?v=[0-9a-f]{32})?$">
                  Header set Cache-Control "max-age=31536000, immutable"
                </FilesMatch>
              </IfModule>
              ` : `
              <IfModule mod_headers.c>
                # Standard cache for non-versioned files
                <FilesMatch "\.(css|js)$">
                  Header set Cache-Control "max-age=86400" # 1 day
                </FilesMatch>
              </IfModule>
              `}
            `,
          
            "2": `
              ## Cache optimisation for Balanced Performance
              <IfModule mod_expires.c>
                ExpiresActive On
                ExpiresDefault "access plus 1 month"
                # Images (long cache)
                ExpiresByType image/jpeg "access plus 1 year"
                ExpiresByType image/png "access plus 1 year"
                ExpiresByType image/webp "access plus 1 year"
                ExpiresByType image/svg+xml "access plus 1 year"
                ExpiresByType image/x-icon "access plus 1 year"
                # CSS/JS (long cache with versioning, otherwise medium)
                ExpiresByType text/css "access plus 1 year"
                ExpiresByType application/javascript "access plus 1 year"
                # Dynamic content (medium cache)
                ExpiresByType text/html "access plus 1 day"
                ExpiresByType application/pdf "access plus 1 month"
              </IfModule>
              ${versioning ? `
              <IfModule mod_headers.c>
                # Force "immutable" cache for versioned files
                <FilesMatch "\.(css|js)(\?v=[0-9a-f]{32})?$">
                  Header set Cache-Control "max-age=31536000, immutable"
                </FilesMatch>
              </IfModule>
              ` : `
              <IfModule mod_headers.c>
                # Standard cache for non-versioned files
                <FilesMatch "\.(css|js)$">
                  Header set Cache-Control "max-age=604800" # 1 week
                </FilesMatch>
              </IfModule>
              `}
            `,
          
            "3": `
              ## Cache optimisation for Maximum Speed
              <IfModule mod_expires.c>
                ExpiresActive On
                ExpiresDefault "access plus 1 year"
                # Images (maximum cache)
                ExpiresByType image/jpeg "access plus 2 years"
                ExpiresByType image/png "access plus 2 years"
                ExpiresByType image/webp "access plus 2 years"
                ExpiresByType image/svg+xml "access plus 2 years"
                ExpiresByType image/x-icon "access plus 2 years"
                # CSS/JS (maximum cache with versioning, otherwise not applicable)
                ExpiresByType text/css "access plus 2 years"
                ExpiresByType application/javascript "access plus 2 years"
                # Dynamic content (short cache)
                ExpiresByType text/html "access plus 1 week"
              </IfModule>
              ${versioning ? `
              <IfModule mod_headers.c>
                # Force "immutable" cache for versioned files
                <FilesMatch "\.(css|js)(\?v=[0-9a-f]{32})?$">
                  Header set Cache-Control "max-age=63072000, immutable"
                </FilesMatch>
              </IfModule>
              ` : `
              <IfModule mod_headers.c>
                # Standard cache for non-versioned files
                <FilesMatch "\.(css|js)$">
                  Header set Cache-Control "max-age=86400" # 1 day
                </FilesMatch>
              </IfModule>
              `}
            `
          };
        return (optimisation[chacheProfile] || "")
        .trim()
        .replace(/^[ \t]+/gm, '');
    }

    generateRedirects() {
        if (!this.config.rewriteUrl) return ""; // Empty string se 'Canonical URL Redirect' è disabilitato
        
        const redirectType = this.config.redirect || "0";
        //Oggetto JS che contiene opzione-direttiva, si richiama con redirects[n]
        const redirects = {
            '1': `
                ## Redirect HTTPS + WWW
                RewriteEngine On
                RewriteCond %{HTTPS} off [OR]
				RewriteCond %{HTTP_HOST} ^(?:www\.)?(.+)$ [NC]
				RewriteRule ^ https://www.%1%{REQUEST_URI} [L,R=301]
            `,

            '2': `
                ## Redirect HTTPS + no-WWW
                RewriteEngine On
                RewriteCond %{HTTPS} off [OR]
                RewriteCond %{HTTP_HOST} ^www\. [NC]
                RewriteCond %{HTTP_HOST} ^(?:www\.)?(.+)$ [NC]
                RewriteRule ^ https://%1%{REQUEST_URI} [L,NE,R=301]
            `,

            '3': `
                ## Redirect to HTTPS (no preference)
                RewriteEngine On
                RewriteCond %{HTTPS} off
                RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
            `,

            '4': `
                ## Redirect to WWW (preserve protocol)
                RewriteEngine On
                RewriteCond %{HTTPS} on
                RewriteCond %{HTTP_HOST} !^www\. [NC]
                RewriteRule ^(.*)$ https://www.%{HTTP_HOST}/$1 [R=301,L]
                RewriteCond %{HTTPS} off
                RewriteCond %{HTTP_HOST} !^www\. [NC]
                RewriteRule ^(.*)$ http://www.%{HTTP_HOST}/$1 [R=301,L]
            `,

            '5': `
                ## Redirect to no-WWW (preserve protocol)
                RewriteEngine On
                RewriteCond %{HTTPS} on
                RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
                RewriteRule ^(.*)$ https://%1/$1 [L,NE,R=301]
                RewriteCond %{HTTPS} off
                RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
                RewriteRule ^(.*)$ http://%1/$1 [L,NE,R=301]
            `,

            '6': `
                ## Redirect to HTTP + WWW
                RewriteEngine On
                RewriteCond %{HTTPS} off [OR]
                RewriteCond %{HTTP_HOST} ^(?:www\.)?(.+)$ [NC]
                RewriteRule ^ http://www.%1%{REQUEST_URI} [L,R=301]
            `,

            '7': `
                ## Redirect to HTTP + no-WWW
                RewriteEngine On
                RewriteCond %{HTTPS} on [OR]
                RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
                RewriteRule ^ http://%1%{REQUEST_URI} [L,NE,R=301]
            `,

            '8': `
                ## Redirect to HTTP (no preference)
                RewriteEngine On
                RewriteCond %{HTTPS} on
                RewriteRule ^ http://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
            `
        };
        // restituisce la direttiva scelta dall'utente
        return (redirects[redirectType] || "")
            .trim()
            .replace(/^[ \t]+/gm, '');
    }

    generateSeoRedirects() {
        if (!this.config.redirectSeo) return ""; // Empty string se 'Redirect URLs' è disabilitato
        const urls = this.config.repeaterUrlList
            .map(e => `Redirect ${e.type} ${e.oldUrl} ${e.newUrl}`)
            .join('\n');
        
        return `
            ## SEO Redirects
            ${urls}
        `.trim();
    }

    generate404() {
        if (!this.config.redirect404) return ""; // Empty string se Redirect '404 è disabilitato'
        const path404 = (this.config.path404 || "").replace(/\/$/, "");
        
        return `
            ## Custom 404 Error Page
            ErrorDocument 404 ${path404}/404.html
        `.trim();
    }

    generateFileProtection() {
        if (!this.config.protectFileList) return ""; // Empty string se Protect 'files.publii.json' è disavilitato
        
        return `
            ## Block access to files.publii.json
            <Files "files.publii.json">
                Require all denied
            </Files>
        `.trim();
    }

    generateCustomDirectives() {
        if (!this.config.custom ) return ""; // Empty string se 'Custom Directives'
        
        return `
            ## Custom Directives
            ${this.config.personal}
        `.trim();
    }

    createHtaccessFile(content) {
        //genera il file .htaccess o htaccess.txt nella cartella ROOT
        const outputFile = this.config.output || ".htaccess";
        const finalContent = `## File generated by EasyHtaccess Plugin\n\n${content}`;
        this.API.createFile(`[ROOT-FILES]/${outputFile}`, finalContent, this);
    }
}

module.exports = EasyHtaccess;