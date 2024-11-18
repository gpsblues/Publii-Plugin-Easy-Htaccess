# Publii Plugin: Easy .htaccess
An easy .htaccess editor for Publii.

<p><img height="100" alt="publii plugin" title="Copy text icons" src="https://raw.githubusercontent.com/gpsblues/Publii-Plugin-Easy-Htaccess/802bbe1ad69aafd209050b19b37371a913fe547f/.assets/thumbnail.svg"></p>

## Features
This plugin creates an .htaccess file with essential optimizations to enhance site performance. It includes HTTPS and 404 redirections, Gzip file compression, and custom directives. Please note that modifying the .htaccess file is at your own risk; the author assumes no responsibility for malfunctions or data loss. **A backup of the original .htaccess file is strongly recommended**, as these changes cannot be undone. This feature only works on Apache servers with .htaccess support.

![Publii plugin screenshot](https://raw.githubusercontent.com/gpsblues/Publii-Plugin-Easy-Htaccess/refs/heads/main/.assets/screen.png)

This plugin uses directives aimed at maximizing compatibility across different servers. However, compatibility is not guaranteed as the behavior of these directives can vary significantly depending on server configurations, which may differ widely. It's recommended to review and test the generated .htaccess file to ensure it functions as expected on your specific server environment.

## Installation and Usage
- Download the .zip file of the latest plugin version from the [release page](https://github.com/gpsblues/Publii-Plugin-Easy-Htaccess/releases/).
- Open Publii CMS and [install the plugin](https://getpublii.com/docs/plugins.html#installingplugins).
- [Enable the plugin](https://getpublii.com/docs/plugins.html#enablingplugins).
- Set plugin options by clicking on its name.
- Save and or Sync your website to see it in action.

## Settings
The plugin allows for selecting multiple options. These options will only take effect after synchronizing the site to an Apache server.

**File Name**  
- `htaccess.txt` creates a plain text file on the server, which will remain inactive until manually renamed to `.htaccess`. This is a safe option that allows you to review the file before making it operational.  
- `.htaccess` directly creates the file, overwriting any previous versions.

**Rewrite URL**  
Enable HTTPS/HTTP redirection and enforce the use of the www or non-www prefix. Various rewrite combinations are available for flexibility.

**Redirect 404**  
Force 404 redirects to the `404.html` page. This works only if the theme supports error pages. [Learn more about supported features](https://getpublii.com/dev/theme-supported-features/). 
Here you can specify the absolute path or the subfolder where the 404.html file is located. For example: `/home/mhd-01/mydomain.com`, `/test`, `/home/mhd/www.mydomain.net/htdocs/test`, etc. Default value: empty.

**Gzip Compression**  
Enable Gzip compression to reduce file sizes and improve loading times. This feature requires `mod_deflate` to be enabled on the server.

**Custom Directives**  
Manually add your custom directives here. These will be appended to the end of the `.htaccess` file.

**Empty .htaccess**  
Reset all customizations by creating an empty `.htaccess` file. This option is effectively equivalent to deleting the file.


## Uninstalling
Since Publii plugins do not work directly on the server and currently cannot delete files, uninstalling or deactivating the plugin will leave the last version of the .htaccess file created by the plugin on the server. If you wish to remove this file, you have two options:  
1. Manually delete the file directly from the server (the obvious option);  
2. Enable the plugin option `Empty .htaccess` and sync the site.

Option 2 does not actually delete the .htaccess file but empties it, removing all directives. This effectively renders the file inactive, making its impact equivalent to deletion.

## Disclaimer
This plugin is an unofficial extension for the [Publii CMS](https://getpublii.com/). I do not assume any responsibility for potential issues or malfunctions that may occur while using this plugin. Additionally, support for this plugin is not guaranteed.

For official Publii resources, please visit the [Publii CMS Official Repository](https://marketplace.getpublii.com/plugins/).
