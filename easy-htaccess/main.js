// https://github.com/GetPublii/Publii/discussions/1359

class MyPlugin {
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

		//Rewrite URL
		let rewriteUrl = ''
		if (this.config.rewriteUrl) {
			rewriteUrl = 
			`	RewriteEngine On

			`
			switch (this.config.redirect) {
				case '1':
					rewriteUrl += 
					`	# Redirect everything to https + www
						RewriteCond %{HTTPS} off [OR]
						RewriteCond %{HTTP_HOST} !^www\. [NC]
						RewriteRule ^ https://www.%{HTTP_HOST}/%{REQUEST_URI} [L,R=301]

					`;
					break;
			
				case '2':
					rewriteUrl += 
					`	# Redirect everything to https + no-www
						RewriteCond %{HTTPS} off [OR]
						RewriteCond %{HTTP_HOST} ^www\. [NC]
						RewriteRule ^ https://%{HTTP_HOST}:%{SERVER_PORT}/%{REQUEST_URI} [L,R=301,NE]

					`;
					break;
			
				case '3':
					rewriteUrl += 
					`	# Redirect everything to https (no preference for www or no-www)
						RewriteCond %{HTTPS} off
						RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

					`;
					break;
			
				case '4':
					rewriteUrl += 
					`	# Redirect everything to www (preserve protocol)
						RewriteCond %{HTTP_HOST} !^www\. [NC]
						RewriteCond %{HTTPS} on
						RewriteRule ^ https://www.%{HTTP_HOST}/%{REQUEST_URI} [L,R=301]
						RewriteCond %{HTTP_HOST} !^www\. [NC]
						RewriteCond %{HTTPS} off
						RewriteRule ^ http://www.%{HTTP_HOST}/%{REQUEST_URI} [L,R=301]

					`;
					break;
			
				case '5':
					rewriteUrl += 
					`	# Redirect everything to no-www (preserve protocol)
						RewriteCond %{HTTP_HOST} ^www\. [NC]
						RewriteCond %{HTTPS} on
						RewriteRule ^ https://%{HTTP_HOST}/%{REQUEST_URI} [L,R=301]
						RewriteCond %{HTTP_HOST} ^www\. [NC]
						RewriteCond %{HTTPS} off
						RewriteRule ^ http://%{HTTP_HOST}/%{REQUEST_URI} [L,R=301]

					`;
					break;
			
				case '6':
					rewriteUrl += 
					`	# Redirect everything to http + www
						RewriteCond %{HTTPS} on [OR]
						RewriteCond %{HTTP_HOST} !^www\. [NC]
						RewriteRule ^ http://www.%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

					`;
					break;
			
				case '7':
					rewriteUrl += 
					`	# Redirect everything to http + no-www
						RewriteCond %{HTTPS} on [OR]
						RewriteCond %{HTTP_HOST} ^www\. [NC]
						RewriteRule ^ http://%{HTTP_HOST:4}%{REQUEST_URI} [L,R=301]

					`;
					break;
			
				case '8':
					rewriteUrl += 
					`	# Redirect everything to http (no preference for www or no-www)
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

		content = rewriteUrl + error404 + gzip + custom
		content = content
			.replace(/[ \t]+/g, ' ')    // Removes double spaces and tabs, replacing them with a single space
			.replace(/^[ \t]+/gm, '')   // Removes spaces and tabs at the beginning of each line
			.trim();                    // Removes spaces at the start and end of the entire string


		//create file in root folder
		this.API.createFile(`[ROOT-FILES]/${output}`, content, this);
	}
	
}


module.exports = MyPlugin;