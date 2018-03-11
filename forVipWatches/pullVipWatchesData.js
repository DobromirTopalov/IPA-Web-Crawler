const {
  JSDOM,
} = require('jsdom');

const $init = require('jquery');

const db = require('../models');
const {
  Watches,
  Webstore,
  Characteristics,
} = db;

// faster, returns array with all pages
const extractPagesUrlsFAST = async (url) => {
  try {
    const DOM = await JSDOM.fromURL(url);
    const $ = $init(DOM.window);

    const pageNextPageSelector = 'div.pagingBox div.pagingItems a.last';
    const lastPage = parseInt($(pageNextPageSelector).html(), 10);

    const links = Array.from({ length: lastPage });

    links.map((page, index) => {
      const indexOfChange = url.lastIndexOf('=');
      const newUrl = url.slice(0, indexOfChange + 1) + (index + 1);

      links[index] = newUrl;
    });
    return links;
  } catch (error) {
      console.log(error);

    return null;
  }
};

// returns array with all products on given page
const extractWatchesUrlsOnPage = async (url) => {
  try {
    const DOM = await JSDOM.fromURL(url);
    const $ = $init(DOM.window);

    const pageLinksSelector = `div.productListing 
                               a.productIMGLink`;
    return [...$(pageLinksSelector)].map((pageLink) => $(pageLink))
    .map(($link) => $link.attr('href'));
  } catch (error) {
      console.log(error);

    return null;
  }
};

// returns array with all products found
const allWatchesUrlsOnWebSite = async (pagesUrlBuffer) => {
  try {
    const productsUrlBuffer = [];

    await Promise.all(pagesUrlBuffer.map( async (url) => {
      try {
        const pageUrls = await extractWatchesUrlsOnPage(url);
        productsUrlBuffer.push(...pageUrls);
      } catch (error) {
        console.log(error);
        return;
      }
    }));

    return productsUrlBuffer;
  } catch (error) {
      console.log(error);

    return null;
  }
};

// returns array of objects with all the info needed for the database
const pullData = async (urlsBuffer) => {
  try {
    const pulledData = [];

    await Promise.all(urlsBuffer.map(async (productUrl, indexer) => {
      try {
      const DOM = await JSDOM.fromURL(productUrl);
      const $ = $init(DOM.window);

      const producerSelector = `div.textPage
                                table.styles 
                                td:contains('Марка')`;
      let producer = $($(producerSelector).parent()
                                          .children()[1])
                                          .text()
                                          .trim();
      if (producer === '') {
        producer = 'no information';
      }

      const nameSelector = `div.productViewRight h1`;
      let name = $(nameSelector).text().trim();
      if (name === '') {
        name = 'no information';
      }

      const priceSelector = `span.price`;
        let price = $(priceSelector).text().trim();
        const delimeter = price[price.length-4];
        price = (price.split(delimeter));
        const indexToThrowAway = price.length - 1;
        price.splice(indexToThrowAway, 1);
        price = price.join('').split(',').join('');
      if (price === '') {
        price = -1;
      }

      const warantySelector = `div.textPage
                               table.styles 
                               td:contains('Гаранция')`;
      const waranty = $($(warantySelector).parent()
                                          .children()[1])
                                          .text()
                                          .trim();
      let warantyPeriod = waranty.slice(0, 2);
      if (waranty === '') {
        warantyPeriod = -1;
      }
      if (waranty === 'Доживотна') {
        warantyPeriod = 120;
      }

      const mechanicsSelector = `div.textPage
                                 table.styles 
                                 td:contains('Механизъм')`;
      let mechanics = $($(mechanicsSelector).parent()
                                            .children()[1])
                                            .text()
                                            .trim();
      if (mechanics === '') {
        mechanics = 'no information';
      }

      const waterProofIndexSelector = `div.textPage
                                       table.styles 
                                       td:contains('Водоустойчивост')`;
      let waterProofIndex = $($(waterProofIndexSelector)
                              .parent()
                              .children()[1])
                              .text()
                              .trim();
      if (waterProofIndex === '') {
        waterProofIndex = null;
      }

      const clockFaceSelector = `div.textPage
                                 table.styles 
                                 td:contains('Циферблат')`;
      let clockFace = $($(clockFaceSelector).parent()
                                            .children()[1])
                                            .text()
                                            .trim();
      if (clockFace === '') {
        clockFace = 'no information';
      }

      const webPage = 'vip-watches.net';

      const dataSingleQueryInfo = {
        producer: producer,
        price: parseFloat(price),
        name: name,
        waranty: parseInt(warantyPeriod, 10),
        mechanics: mechanics,
        proof_level: waterProofIndex,
        clock_face: clockFace,
        web_page: webPage,
      };

      pulledData.push(dataSingleQueryInfo);
      console.log('.add ', dataSingleQueryInfo.producer,
                  ' to database "watchesdb/watches".');
                  Watches.create({
                    name: dataSingleQueryInfo.name,
                    Webstore: {
                      web_page: dataSingleQueryInfo.web_page,
                    },
                    Characteristics: {
                      producer: dataSingleQueryInfo.producer,
                      price: dataSingleQueryInfo.price,
                      waranty: dataSingleQueryInfo.waranty,
                      mechanics: dataSingleQueryInfo.mechanics,
                      proof_level: dataSingleQueryInfo.proof_level,
                      clock_face: dataSingleQueryInfo.clock_face,
                    },
                  }, {
                    include: [Webstore, Characteristics],
                  });
      // Watches.create(dataSingleQueryInfo);
    } catch (error) {
        console.log(error);

      return;
    }
  }));

  return [...pulledData];
  } catch (error) {
      console.log(error);

    return null;
  }
};

// async function to make requests in chunks to the server - returns [ [{},{}],
// [{},{},{},{}], [{},{}] ]
const extractDataReadyObj = async (infoUrls, processedData) => {
  if (infoUrls.length === 0) {
    return processedData;
  }

  const watchesUrls = infoUrls.splice(0, 5);
  const currentProcessedData = await Promise.all(watchesUrls.map((someUrl) => {
    setTimeout(function() {
      console.log('vip-watches');
    }, 500);

    return pullData([someUrl]);
  }));
  processedData.push(...currentProcessedData);

  return extractDataReadyObj(infoUrls, processedData);
};

const extractDataLinksOnPage = async (infoUrls, processedData) => {
  if (infoUrls.length === 0) {
    return processedData;
  }

  const watchesUrls = infoUrls.splice(0, 5);
  const currentProcessedData = await Promise.all(watchesUrls.map((someUrl) => {
    return allWatchesUrlsOnWebSite([someUrl]);
  }));
  processedData.push(...currentProcessedData);

  return extractDataLinksOnPage(infoUrls, processedData);
};

const unpackData = (data) => {
  const unpackedData = [];

  data.forEach((entry) => {
    unpackedData.push(...entry);
  });

  return [...unpackedData];
};

module.exports = {
  JSDOM,
  $init,
  extractPagesUrlsFAST,
  extractWatchesUrlsOnPage,
  allWatchesUrlsOnWebSite,
  pullData,
  extractDataReadyObj,
  extractDataLinksOnPage,
  unpackData,
};
