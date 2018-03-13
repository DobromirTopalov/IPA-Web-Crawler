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

// ultra slow, returns array with all pages - DONT USE THIS!
const extractPagesUrlsSLOW = async (url, pagesUrlBuffer) => {
  if (url === 'https://www.emag.bgundefined') {
    return pagesUrlBuffer;
  }

  pagesUrlBuffer.push(url);

  const DOM = await JSDOM.fromURL(url);
  const $ = $init(DOM.window);

  const pageLinksSelector = `#listing-paginator 
                             li a[aria-label = 'Next'] 
                             span:contains('Напред')`;
  const nextPageUrl = 'https://www.emag.bg' + $(pageLinksSelector)
                                              .parent()
                                              .attr('href');

  await extractPagesUrlsSLOW(nextPageUrl, pagesUrlBuffer);
  return pagesUrlBuffer;
};

// faster, returns array with all pages
const extractPagesUrlsFAST = async (url) => {
  try {
    const DOM = await JSDOM.fromURL(url);
    const $ = $init(DOM.window);

    const pageNextPageSelector = '#listing-paginator';
    const lastPage = +($(pageNextPageSelector)
                      .children()[$(pageNextPageSelector)
                      .children().length - 2].children[0].innerHTML);

    const links = Array.from({ length: lastPage });

    links.map((page, index) => {
      url = url.split('/');
      const urlSize = +url.length;
      url.splice([urlSize - 2], 1, 'p'+ (index + 1));
      url = url.join('/');

      links[index] = url;
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

    const pageLinksSelector = `.page-container 
                               .card-heading 
                               .thumbnail-wrapper`;
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

    await Promise.all(pagesUrlBuffer.map(async (url) => {
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

      const producerSelector = `div.product-page-description-text
                                div.disclaimer-section 
                                p:contains('Производител: ') a`;
      let producer = $(producerSelector).text().trim();
      if (producer === '') {
        producer = 'no information';
      }

      const nameSelector = `h1.page-title:first`;
      let name = $(nameSelector).text().trim();
      if (name === '') {
        name = 'no information';
      }

      const priceSelector = `div.product-highlight p.product-new-price`;
      let price = $(priceSelector).text().trim();
      const mainPrice = price.slice(0, price.length - 6);
      const secondaryPrice = price.slice(-6, price.length - 4);
      price = (mainPrice + '.' + secondaryPrice).split('.').join('');
      if (price === '') {
        price = -1;
      }

      const warantySelector = `#ew-inpage div`;
      const waranty = $($(warantySelector).children()[1]).text().trim();
      let warantyPeriod = waranty.slice(-9).slice(0, 2);
      if (waranty === '') {
        warantyPeriod = -1;
      }

      const mechanicsSelector = `div.pad-top-sm tbody td:contains('Механизъм')`;
      let mechanics = $($(mechanicsSelector).parent().children()[1]).text();
      if (mechanics === '') {
        mechanics = 'no information';
      }

      const waterProofIndexSelector = `div.pad-top-sm 
                                       tbody 
                                       td:contains('Водоустойчивост')`;
      let waterProofIndex = $($(waterProofIndexSelector)
                            .parent()
                            .children()[1])
                            .text()
                            .trim();
      if (waterProofIndex === '') {
        waterProofIndex = null;
      }

      const clockFaceSelector = `div.pad-top-sm tbody td:contains('Циферблат')`;
      let clockFace = $($(clockFaceSelector).parent().children()[1]).text();
      if (clockFace === '') {
        clockFace = 'no information';
      }

      const webPage = 'emag.bg';

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
      console.log('emag');
    }, 2000);

    return pullData([someUrl]);
  }));
  processedData.push(...currentProcessedData);

  return extractDataReadyObj(infoUrls, processedData);
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
  extractPagesUrlsSLOW,
  extractPagesUrlsFAST,
  extractWatchesUrlsOnPage,
  allWatchesUrlsOnWebSite,
  pullData,
  extractDataReadyObj,
  unpackData,
};
