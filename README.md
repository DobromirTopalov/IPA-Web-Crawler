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


# Node.js and databases Teamwork assignment

## Create a web crawler gathering and aggregating information from atleast two different web sites. <h2>
The crawler should support the following operations: 
*	npm run update
*	Gathers the information and stores it in MariaDB/MySQL instance
*	npm run statistics COMMAND:params
*	At least 3 commands for information aggregation 

## Example
Web crawler for mobile phones.
*	Gathers information from technopolis and technomarket
*	Statistics
*	Order by price
    * npm run statistics order-by-price 
*	Filter by RAM, screen size, or OS
    * npm run statistics filter:ram:gt:4GB
    * npm run statistics filter:screen-suze:lt:5
*	Search for a specific requirement
    * i.e. 4G, gorilla glass, etc...
    * npm run statistics search:4g
    * npm run statistics search:gorilla
Web crawler for books (goodreads.com) 
Web crawler for movies (imdb)

## Technical Requirements <h2>
*	No UI required, only CLI interface
*	Parse HTML pages, DO NOT use APIs
*	Use as much ES2015 as possible
–	async-await, promises, generators (if possible), etc..
*	Zero ESLint errors/warnings
–	Use the .eslintrc file from demos
*	Use MariaDB as data storage
–	With schemas, fulfulling the good practices
*	Use Sequelize
*	Do not use loop constructs
–	for(var i = 0; …. ), for(const el of …), for(const key in …)
–	while(….)

## Optional Requirements <h2>
*	Optimize the gathering of data
–	i.e. using an async queue, where, at each moment of time, there are exactly 5 downloading queries
*	Feel free to use any npm package available on the Web
–	i.e. jQuery for the parsing of the HTML

## Hints <h2>
*	Use gpaphs for the gathering
