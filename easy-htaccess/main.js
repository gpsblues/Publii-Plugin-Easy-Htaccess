// https://github.com/GetPublii/Publii/discussions/1359

class EasyHtaccess {
    constructor (API, name, config) {
        this.API = API; 		// gives you an access to the plugins API functions
		this.name = name; 		// retrieved plugin name - probably will be removed in the future
		this.config = config; 	// gives access to the plugin saved config
    }	

	
	// Events - can be used to do some additional actions in specific moments of the website rendering process.
    addEvents () {
		this.API.addEvent('beforeRender', this.addFile, 1, this);
    }

    // Custom code below
    
	
    addFile (rendererInstance) {	

		//Output file name
		let output = this.config.output
		let content = ""

		//Create empty .htaccess
		if (this.config.destroy) {
			this.API.createFile(`[ROOT-FILES]/${output}`, content, this);
			return
		}

		//Canonical URL redirect
		let rewriteUrl = ''
		if (this.config.rewriteUrl) {
			rewriteUrl = 
			`	RewriteEngine On

			`
			switch (this.config.redirect) {
				case '1':
					rewriteUrl += 
					`	# Redirect to HTTPS + WWW #
						RewriteCond %{HTTPS} off [OR]
						RewriteCond %{HTTP_HOST} ^(?:www\.)?(.+)$ [NC]
						RewriteRule ^ https://www.%1%{REQUEST_URI} [L,R=301]

					`;
					break;
			
				case '2':
					rewriteUrl += 
					`	# Redirect to HTTPS + no-WWW #
						RewriteCond %{HTTPS} off [OR]
						RewriteCond %{HTTP_HOST} ^www\. [NC]
						RewriteCond %{HTTP_HOST} ^(?:www\.)?(.+)$ [NC]
						RewriteRule ^ https://%1%{REQUEST_URI} [L,NE,R=301]

					`;
					break;
			
				case '3':
					rewriteUrl += 
					`	# Redirect to HTTPS (no preference for www or no-www) #
						RewriteCond %{HTTPS} off
						RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

					`;
					break;
			
				case '4':
					rewriteUrl += 
					`	# Redirect no-WWW to WWW, preserving protocol #
						# Force www preserving HTTPS
						RewriteCond %{HTTPS} on
						RewriteCond %{HTTP_HOST} !^www\. [NC]
						RewriteRule ^(.*)$ https://www.%{HTTP_HOST}/$1 [R=301,L]
						# Force www preserving HTTP
						RewriteCond %{HTTPS} off
						RewriteCond %{HTTP_HOST} !^www\. [NC]
						RewriteRule ^(.*)$ http://www.%{HTTP_HOST}/$1 [R=301,L]

					`;
					break;
			
				case '5':
					rewriteUrl += 
					`	# Redirect WWW to non-WWW, preserving protocol
						# Force no-www preserving HTTPS
						RewriteCond %{HTTPS} on
						RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
						RewriteRule ^(.*)$ https://%1/$1 [R=301,L]
						# Force no-www preserving HTTP
						RewriteCond %{HTTPS} off
						RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
						RewriteRule ^(.*)$ http://%1/$1 [R=301,L]

					`;
					break;
			
				case '6':
					rewriteUrl += 
					`	# Redirect to HTTP + WWW #
						RewriteCond %{HTTPS} off [OR]
						RewriteCond %{HTTP_HOST} ^(?:www\.)?(.+)$ [NC]
						RewriteRule ^ http://www.%1%{REQUEST_URI} [L,R=301]

					`;
					break;
			
				case '7':
					rewriteUrl += 
					`	# Redirect to HTTP + no-WWW #
						# Force HTTP without www when the protocol is HTTPS and the host contains www
						RewriteCond %{HTTPS} on
						RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
						RewriteRule ^ http://%1%{REQUEST_URI} [L,NE,R=301]
						# Force HTTP without www when the protocol is already HTTP (ensure no www)
						RewriteCond %{HTTPS} off
						RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
						RewriteRule ^ http://%1%{REQUEST_URI} [L,NE,R=301]
						# Redirect HTTPS without www to HTTP without www
						RewriteCond %{HTTPS} on
						RewriteCond %{HTTP_HOST} ^miosito\.it$ [NC]
						RewriteRule ^ http://miosito.it%{REQUEST_URI} [L,NE,R=301]

					`;
					break;
			
				case '8':
					rewriteUrl += 
					`	# Redirect to HTTP (no preference for www or no-www) #
						RewriteCond %{HTTPS} on
						RewriteRule ^ http://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

					`;
					break;
			
				default:
					rewriteUrl += 
					`	# No redirect or invalid option

					`;
					break;
			}
				
		}

		//Rewrite SEO Urls
		let redirectSeo = ""
		if (this.config.redirectSeo) {
			let urls = []	// Initialize the array to store redirect strings
			if (Array.isArray(this.config.repeaterUrlList)) {
				this.config.repeaterUrlList.forEach((elements) => {
					const redirect = `Redirect ${elements.type} ${elements.oldUrl} ${elements.newUrl}` 
					urls.push(redirect) // Add the redirect string to the array
				});
				// Build the final redirectSeo string with custom text before and after
				redirectSeo = "	# Redirect URLs\n"
				redirectSeo += urls.join("\n"); // Combine all redirect strings with newline
				redirectSeo += "\n\n";
			}
		}

		//Custom 404 Error Page
		let error404 = ""
		let subfolder = this.config.path404
		subfolder = subfolder.replace(/\/$/, '');
		if (this.config.redirect404) {
			error404 = 
			`	# Custom 404 Error Page
				ErrorDocument 404 ${subfolder}/404.html

			`
		}

		//Protect files.publii.json
		let protectFileList = ""
		if (this.config.protectFileList) {
			protectFileList = 
			`	# Blocking access files.publii.json
				<Files "files.publii.json">
					Require all denied
				</Files>

			`;
		}

		//Gzip compression
		let gzip = ""
		if (this.config.gzip) {
			gzip = 
			`	# Enable Gzip compression
				<IfModule mod_deflate.c>
					AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css
					AddOutputFilterByType DEFLATE text/javascript application/javascript application/json
					AddOutputFilterByType DEFLATE application/x-javascript application/xml application/xml+rss
					AddOutputFilterByType DEFLATE application/font-woff2 application/font-woff application/font-ttf
					AddOutputFilterByType DEFLATE image/svg+xml
				</IfModule>
				
			`
		}

		//Custom directives
		let custom = ""
		if (this.config.custom) {
			custom = 
			`	# Custom directives
				${this.config.personal}
			`
		}

		//Write directives in appropriate order
		content = gzip + rewriteUrl + redirectSeo + error404 + protectFileList + custom 
		content = content
			.replace(/[ \t]+/g, ' ')    // Removes double spaces and tabs, replacing them with a single space
			.replace(/^[ \t]+/gm, '')   // Removes spaces and tabs at the beginning of each line
			.trim();                    // Removes spaces at the start and end of the entire string


		//create file in root folder
		this.API.createFile(`[ROOT-FILES]/${output}`, content, this);
	}
	
}

module.exports = EasyHtaccess;