# Publii Plugin: Easy .htaccess
A simple and user-friendly plugin to create and manage .htaccess files with essential optimizations for your website.

<p><img height="100" alt="publii plugin" title="Plugin icons" src="https://raw.githubusercontent.com/gpsblues/Publii-Plugin-Easy-Htaccess/802bbe1ad69aafd209050b19b37371a913fe547f/.assets/thumbnail.svg"></p>

## Features
This plugin creates an **.htaccess** file with essential optimizations to enhance site performance. It includes HTTPS and 404 redirections, Gzip file compression, and custom directives. Please note that modifying the .htaccess file is at your own risk; the author assumes no responsibility for malfunctions or data loss. **A backup of the original .htaccess file is strongly recommended**, as these changes cannot be undone. This feature only works on Apache servers with .htaccess support.

![Publii plugin screenshot](https://raw.githubusercontent.com/gpsblues/Publii-Plugin-Easy-Htaccess/refs/heads/main/.assets/screen.png)

This plugin uses directives aimed at maximizing compatibility across different servers. However, compatibility is not guaranteed as the behavior of these directives can vary significantly depending on server configurations, which may differ widely. It's recommended to review and test the generated .htaccess file to ensure it functions as expected on your specific server environment.

## Installation and Usage
- Download the .zip file of the latest plugin version from the [release page](https://github.com/gpsblues/Publii-Plugin-Easy-Htaccess/releases/).
- Open Publii CMS and [install the plugin](https://getpublii.com/docs/plugins.html#installingplugins).
- [Enable the plugin](https://getpublii.com/docs/plugins.html#enablingplugins).
- Set plugin options by clicking on its name.
- Save and Sync your website to see it in action.

## Settings
The plugin allows for selecting multiple options. These options will only take effect after synchronizing the site to an Apache server.

### File Name 
- **`htaccess.txt`**  creates a plain text file on the server, which will remain inactive until manually renamed to .htaccess. This is a safe option that allows you to review the file before making it operational.  
- **`.htaccess`**  directly creates the .htaccess file, overwriting any previous versions.

### Canonical URL redirect 
Enable HTTPS/HTTP redirection and enforce the use of the www or non-www prefix. Various rewrite combinations are available for flexibility.

### Redirect URLs
Set up URL redirects directly in the `.htaccess` file by specifying old and new paths. Choose between permanent (301) or temporary (302) redirects. These rules help maintain SEO rankings and prevent broken links.  

This option uses simple redirects (technically mod_alias), so patterns and regular expressions are not supported.  

### Redirect 404 
Force 404 redirects to the `404.html` page. This works only if the theme supports error pages. [Learn more about supported features](https://getpublii.com/dev/theme-supported-features/).  

You can specify either the absolute server path or the host URL or the subfolder where the `404.html` file is located. For example: `/home/mhd-01/mydomain.com`, `/https://www.mydomain.com`, `/test`. Default value: empty.

### Protecting the files.publii.json File
With this option, you can make the `files.publii.json` file unreachable from the outside. [More information](https://getpublii.com/docs/recommended-server-settings.html#protectingthefilespubliijsonfile).

### Gzip Compression 
Enable Gzip compression to improve site performance by reducing file sizes. This option works only if the server supports Gzip. If you're unsure, contact your hosting provider for more information.

### Expires Headers

Optimize your site's performance with customizable caching levels. The **Expires Headers** feature automatically adjusts based on whether versioning is enabled or disabled, ensuring optimal performance for your specific needs. Choose from four profiles:

- **⚙️ Disables caching**: Loads all resources fresh every time. Ideal for development to instantly see changes without clearing the cache.  
- **🔄 Frequent Updates**: Perfect for blogs, news sites, or any content updated frequently. Keeps your site fast while ensuring visitors see the latest changes.  
- **⚖️ Balanced Performance**: Best for corporate sites, service pages, or small business websites with occasional updates. Balances speed and content freshness.  
- **🚀 Maximum Speed**: Optimized for very static content, delivering the fastest possible performance.  

To check if versioning is enabled, go to: `Site settings > Website speed > Version parameter`.

### Custom Directives
Manually add your custom directives here. These will be appended to the end of the `.htaccess` file.

### Empty .htaccess 
Reset all customizations by creating an empty `.htaccess` file. This option is effectively equivalent to deleting the file.

## Uninstalling
Uninstalling or deactivating this plugin will not remove the `.htaccess` file created on the server. If you want to remove it, you have two options:

- **Enable the plugin option `Empty .htaccess` and sync the site.**  
  This option does not delete the `.htaccess` file but empties its contents, removing all directives. This effectively deactivates the file, making its impact equivalent to deletion.

- **Deactivate the plugin and manually delete the files.**  
  You will need to remove two `.htaccess` files: the one located on the server and the local copy found in **`Publii > File Manager > root directory`**.

## Disclaimer
This plugin is an unofficial extension for the [Publii CMS](https://getpublii.com/). I do not assume any responsibility for potential issues or malfunctions that may occur while using this plugin. Additionally, support for this plugin is not guaranteed.

For official Publii resources, please visit the [Publii CMS Official Repository](https://marketplace.getpublii.com/plugins/).
