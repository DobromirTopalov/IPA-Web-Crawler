# IPA-Web-Crawler
Individual Project Assignment - Web Crawler ( JavaScript/Node.js &amp; MariaDB, using Sequelize (ORM) )

Configurations

Download repository and run in VS Code(optional). Establish a connection to your server database via (config/config.js) file, where you can specify your: 'user', 'password', 'database' etc. You might as well check if all the paths are correct in package.json/Scripts and models/index.js, changes depend on what OS you are using.

Don't forget: npm install!

Usage

There are several commands to access the crawled pages data:

    npm run update | clears all previous data and runs the app again, gathering new data
    npm run statistics-info | shows all current information in the database
    npm run statistics-priceASC | displays all entries by name and price sorted in ascending order
    npm run statistics-priceDESC | displays all entries by name and price sorted in descending order
    npm run statistics-store 'website main url' | displays all entries by name and given search parameter as string
    npm run statistics-producer 'brand' | displays all entries by name and given search parameter as string
    npm run statistics-name 'product name(case sensitive)' | displays all entry info for the given search parameter as string
    npm run statistics-charValue 'characteristics' 'value' | displays all entries by name matching the provided string params
    npm run statistics-priceRangeOrder 'price to check against' 'order style - ASC/DESC' | displays all entries by name and given     
    search params as string
