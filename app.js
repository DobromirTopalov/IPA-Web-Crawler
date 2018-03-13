/* globals process */
const fromEmag = require('./forEmag/pullEmagData.js');
const startEmagUrl = 'https://www.emag.bg/myzhki-chasovnici/p1/c';

const fromVipWatches = require('./forVipWatches/pullVipWatchesData.js');
const startVipWatchesUrl = 'https://www.vip-watches.net/mujki-chasovnici?p=1';

const runEmag = async () => {
  let allPagesUrls = await fromEmag.extractPagesUrlsFAST(startEmagUrl);
  allPagesUrls = allPagesUrls.splice(10, 18);

  const allProductsUrls = await fromEmag.allWatchesUrlsOnWebSite(allPagesUrls);
  await fromEmag.extractDataReadyObj(allProductsUrls, []);
};

const runVipWatches = async () => {
  let allPagesUrls = await fromVipWatches
                          .extractPagesUrlsFAST( startVipWatchesUrl );
  allPagesUrls = allPagesUrls.splice(10, 18);

  let allProductsUrls = await fromVipWatches
                              .extractDataLinksOnPage(allPagesUrls, []);
  allProductsUrls = fromVipWatches.unpackData(allProductsUrls);

  await fromVipWatches.extractDataReadyObj(allProductsUrls, []);
};

const dataQuery = require('./forEmag/queryData.js');
const command = process.argv[2];
if (command === 'update') {
  dataQuery.deleteTablesData();
  runEmag();
  runVipWatches();
}
