/* globals process */
const fromEmag = require('./forEmag/pullEmagData.js');
const startEmagUrl = 'https://www.emag.bg/myzhki-chasovnici/p1/c';

const fromVipWatches = require('./forVipWatches/pullVipWatchesData.js');
const startVipWatchesUrl = 'https://www.vip-watches.net/mujki-chasovnici?p=1';

const runEmag = async () => {
  let allPagesUrls = await fromEmag.extractPagesUrlsFAST(startEmagUrl);
  allPagesUrls = allPagesUrls.splice(10, 2);

  const allProductsUrls = await fromEmag.allWatchesUrlsOnWebSite(allPagesUrls);
  const allProductsInfo = await fromEmag
                                .extractDataReadyObj(allProductsUrls, []);
};

const runVipWatches = async () => {
  let allPagesUrls = await fromVipWatches
                          .extractPagesUrlsFAST( startVipWatchesUrl );
  allPagesUrls = allPagesUrls.splice(10, 2);

  let allProductsUrls = await fromVipWatches
                              .extractDataLinksOnPage(allPagesUrls, []);
  allProductsUrls = fromVipWatches.unpackData(allProductsUrls);

  const allProductsInfo = await fromVipWatches
                                .extractDataReadyObj(allProductsUrls, []);
};

const dataQuery = require('./forEmag/queryData.js');
const command = process.argv[2];
if (command === 'update') {
  dataQuery.deleteTablesData();
  runEmag();
  runVipWatches();
}


// connect.sequelize.close();

// queryEmag.showAllWatchesInfo(Watches);
// const test = {
//   producer: 'Dobata LSD',
//   name: 'Kozshche - smoke weed everyday',
//   price: 2560.89,
//   waranty: 42,
//   mechanics: 'механично',
//   proof_level: '420 ATM',
//   clock_face: 'Аналогов и цифров',
// };
// queryEmag.createTableDataForObject(Watches, test);


/* BACK-UP code

const runEmag = async () => {
  let allPagesUrls = await fromEmag.extractPagesUrlsFAST( startEmagUrl );
  allPagesUrls = allPagesUrls.splice(10, 25);
  // console.log(allPagesUrls);

  // let allProductsUrls = await fromVipWatches.extractDataLinksOnPage(allPagesUrls, []);
  // allProductsUrls = fromVipWatches.unpackData(allProductsUrls);

  const allProductsUrls = await fromEmag.allWatchesUrlsOnWebSite(allPagesUrls);
  // console.log(allProductsUrls);

  // const allProductsInfo = await fromEmag.leachData(allProductsUrls);
  // console.log(allProductsInfo);

  let allProductsInfo = await fromEmag.extractDataReadyObj(allProductsUrls, []);
  // allProductsInfo = fromEmag.unpackData(allProductsInfo);

  // allProductsInfo.forEach((productInfo) => {
  //   Watches.create(productInfo);
  // });
};

const runVipWatches = async () => {
  let allPagesUrls = await fromVipWatches.extractPagesUrlsFAST( startVipWatchesUrl );
  allPagesUrls = allPagesUrls.splice(10, 25);
  // console.log(allPagesUrls);

  let allProductsUrls = await fromVipWatches.extractDataLinksOnPage(allPagesUrls, []);
  allProductsUrls = fromVipWatches.unpackData(allProductsUrls);
  // console.log(allProductsUrls);

  let allProductsInfo = await fromVipWatches.extractDataReadyObj(allProductsUrls, []);
  // allProductsInfo = fromVipWatches.unpackData(allProductsInfo);

  // allProductsInfo.forEach((productInfo) => {
  //   Watches.create(productInfo);
  // });
};

const dataQuery = require('./forEmag/queryData.js');
const command = process.argv[2];
if (command === 'update') {
  // dataQuery.deleteTablesData();
  // runEmag();
  // runVipWatches();
}

*/