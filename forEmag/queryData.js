/* global process */
const Op = require('sequelize').Op;
const db = require('../models');
const {
  Watches,
  Webstore,
  Characteristics,
} = db;

const formatPrice = (str) => {
  const re = /^(?:(\d+)(\d{2})|(\d{1,2}))$/;
  const m = str.match(re);
  if (m !== null) {
    if (m[3]) {
      return m[3].length === 1 ? '0.0' + m[3] : '0.' + m[3];
    }
  }
  return m[1].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') + '.' + m[2];
};

const deleteTablesData = (tableName) => {
  Watches.destroy({ truncate: { cascade: true } });
  Webstore.destroy({ truncate: { cascade: true } });
  Characteristics.destroy({ truncate: { cascade: true } });
};

const showAllWatchesInfo = async (tableName) => {
  const bufferWatchesData = [];
  const bufferCharacteristicsData = [];

  await Watches.findAll({
      attributes: ['name', 'id'],
      include: [{
          model: Webstore,
          attributes: ['web_page'],
      }],
    })
    .then((result) => result.map((element) => {
      const formattedResult = 'name: '+
                              element.name +
                              '\nprovider: ' +
                              element.Webstore.web_page;
      bufferWatchesData.push([element.id, formattedResult]);
    }));

  await Characteristics.findAll({
      attributes: ['WatchesId', 'producer', 'price', 'waranty',
                   'mechanics', 'proof_level', 'clock_face'],
    })
    .then((result) => result.map((element) => {
        const formattedResult = '\nproducer: '+ element.producer +
                                '\nprice: '+ formatPrice(element.price+'') +
                                ' BGN' +
                                '\nwaranty: '+ element.waranty + ' месеца' +
                                '\nmechanics: '+ element.mechanics +
                                '\nproof_level: '+ element.proof_level +
                                '\nclock_face: '+ element.clock_face +
                                '\n' + '---'.repeat(20);
      bufferCharacteristicsData.push([element.WatchesId, formattedResult]);
    }));

  bufferWatchesData.map((watchId, index) => {
    const info = bufferCharacteristicsData
                 .filter((charId) => charId[0] === watchId[0]);
    if (info.length) {
      const resultInfo = watchId[1] + info[0][1];
      console.log(resultInfo, index + 1);
    }
  });
};

const showInfoForName = async (tableName, productName) => {
  const bufferWatchesData = [];
  const bufferCharacteristicsData = [];

  await Watches.findAll({
      attributes: ['name', 'id'],
        include: [{
          model: Webstore,
          attributes: ['web_page'],
      }],
    })
    .then((result) => result.map((element) => {
      const formattedResult = 'name: '+
                              element.name +
                              '\nprovider: ' +
                              element.Webstore.web_page;
      bufferWatchesData.push([element.name, element.id, formattedResult]);
  }));
  await Characteristics.findAll({
      attributes: ['WatchesId', 'producer', 'price', 'waranty',
                  'mechanics', 'proof_level', 'clock_face'],
    })
    .then((result) => result.map((element) => {
        const formattedResult = '\nproducer: '+ element.producer +
                                '\nprice: '+ formatPrice(element.price+'') +
                                ' BGN' +
                                '\nwaranty: '+ element.waranty + ' месеца' +
                                '\nmechanics: '+ element.mechanics +
                                '\nproof_level: '+ element.proof_level +
                                '\nclock_face: '+ element.clock_face +
                                '\n' + '---'.repeat(20);
      bufferCharacteristicsData.push([element.WatchesId, formattedResult]);
    }));

  const pName = bufferWatchesData.find((product) => product[0] === productName);

  if (pName) {
    const pInfo = bufferCharacteristicsData
                  .filter((charId) => charId[0] === pName[1]);
      if (pInfo.length) {
        const resultInfo = pName[2] + pInfo[0][1];
        console.log(resultInfo);
      }
  } else {
    console.log('Nothing found!');
  }
};

const orderByPriceDESC = async (tableName) => {
  const bufferWatchesData = [];
  const bufferCharacteristicsData = [];

  await Watches.findAll({
      attributes: ['name', 'id'],
      include: [{
          model: Webstore,
          attributes: ['web_page'],
      }],
    })
    .then((result) => result.map((element) => {
      const formattedResult = 'name: '+
                              element.name +
                              ' '.repeat(Math.abs(70 - element.name.length));
      bufferWatchesData.push([element.id, formattedResult]);
    }));
  await Characteristics.findAll({
      attributes: ['WatchesId', 'producer', 'price', 'waranty',
                   'mechanics', 'proof_level', 'clock_face'],
      order: [
          ['price', 'DESC'],
      ],
    })
    .then((result) => result.map((element) => {
      const formattedResult = 'costs: '+ formatPrice(element.price+'') +
                              ' BGN';
      bufferCharacteristicsData.push([element.WatchesId, formattedResult]);
    }));

  bufferCharacteristicsData.map((charId, index) => {
    const info = bufferWatchesData
                 .filter((watchId) => charId[0] === watchId[0]);
    if (info.length) {
      const resultInfo = info[0][1] + charId[1];
      console.log(resultInfo, index + 1);
    }
  });
};

const orderByPriceASC = async (tableName) => {
  const bufferWatchesData = [];
  const bufferCharacteristicsData = [];

  await Watches.findAll({
      attributes: ['name', 'id'],
    })
    .then((result) => result.map((element) => {
      const formattedResult = 'name: '+
                              element.name +
                              ' '.repeat(Math.abs(70 - element.name.length));
      bufferWatchesData.push([element.id, formattedResult]);
    }));

  await Characteristics.findAll({
      attributes: ['WatchesId', 'producer', 'price', 'waranty',
                   'mechanics', 'proof_level', 'clock_face'],
      order: [
          ['price', 'ASC'],
      ],
    })
    .then((result) => result.map((element) => {
      const formattedResult = 'costs: '+ formatPrice(element.price+'') +
                              ' BGN';
      bufferCharacteristicsData.push([element.WatchesId, formattedResult]);
    }));

  bufferCharacteristicsData.map((charId, index) => {
    const info = bufferWatchesData
                 .filter((watchId) => charId[0] === watchId[0]);
    if (info.length) {
      const resultInfo = info[0][1] + charId[1];
      console.log(resultInfo, index + 1);
    }
  });
};

const filterByProducer = async (tableName, producer) => {
  const bufferWatchesData = [];
  const bufferCharacteristicsData = [];

  await Watches.findAll({
      attributes: ['name', 'id'],
    })
    .then((result) => result.map((element) => {
      const formattedResult = 'name: '+
                              element.name +
                              ' '.repeat(Math.abs(70 - element.name.length));
      bufferWatchesData.push([element.id, formattedResult]);
    }));

  await Characteristics.findAll({
      attributes: ['WatchesId', 'producer', 'price', 'waranty',
                   'mechanics', 'proof_level', 'clock_face'],
      where: {
      producer: {
        [Op.eq]: producer,
      },
    },
    })
    .then((result) => result.map((element) => {
      const formattedResult = 'producer: '+ element.producer;
      bufferCharacteristicsData.push([element.WatchesId, formattedResult]);
    }));

  bufferCharacteristicsData.map((charId, index) => {
    const info = bufferWatchesData
                 .filter((watchId) => charId[0] === watchId[0]);
    if (info.length) {
      const resultInfo = info[0][1] + charId[1];
      console.log(resultInfo, index + 1);
    }
  });
};

const filterBySource = async (tableName, source) => {
  await Watches.findAll({
      attributes: ['name', 'id'],
      include: [{
        model: Webstore,
        attributes: ['web_page'],
        where: {
          web_page: source,
        },
    }],
    })
    .then((result) => result.map((element, index) => {
      const formattedResult = 'name: '+
                              element.name +
                              ' '.repeat(Math.abs(70 - element.name.length)) +
                              'Store: ' + element.Webstore.web_page +
                              '#:' + (index + 1);
      console.log(formattedResult);
    }));
};

const filterByPriceRangeSortByType = async (tableName, price, orderType) => {
  const bufferWatchesData = [];
  const bufferCharacteristicsData = [];

  await Watches.findAll({
      attributes: ['name', 'id'],
    })
    .then((result) => result.map((element) => {
      const formattedResult = 'name: '+
                              element.name +
                              ' '.repeat(Math.abs(70 - element.name.length));
      bufferWatchesData.push([element.id, formattedResult]);
    }));

  await Characteristics.findAll({
      attributes: ['WatchesId', 'producer', 'price', 'waranty',
                   'mechanics', 'proof_level', 'clock_face'],
      where: {
        price: {
          [Op.gt]: price,
        },
      },
      order: [
        ['price', orderType],
      ],
    })
    .then((result) => result.map((element) => {
      const formattedResult = 'costs: '+ formatPrice(element.price+'') +
                              ' BGN';
      bufferCharacteristicsData.push([element.WatchesId, formattedResult]);
    }));

  bufferCharacteristicsData.map((charId, index) => {
    const info = bufferWatchesData
                 .filter((watchId) => charId[0] === watchId[0]);
    if (info.length) {
      const resultInfo = info[0][1] + charId[1];
      console.log(resultInfo, index + 1);
    }
  });
};

const filterByCharacteristicsAndValue =
                                  async (tableName, characteristics, value) => {
  const bufferWatchesData = [];
  const bufferCharacteristicsData = [];

  await Watches.findAll({
      attributes: ['name', 'id'],
    })
    .then((result) => result.map((element) => {
      const formattedResult = 'name: '+
                              element.name +
                              ' '.repeat(Math.abs(70 - element.name.length));
      bufferWatchesData.push([element.id, formattedResult]);
    }));

  await Characteristics.findAll({
      attributes: ['WatchesId', 'producer', 'price', 'waranty',
                   'mechanics', 'proof_level', 'clock_face'],
        where: {
        [characteristics]: value,
      },
    })
    .then((result) => result.map((element) => {
      const formattedResult = characteristics +
                              ':  ' + element[characteristics];
      bufferCharacteristicsData.push([element.WatchesId, formattedResult]);
    }));

  bufferCharacteristicsData.map((charId, index) => {
    const info = bufferWatchesData
                 .filter((watchId) => charId[0] === watchId[0]);
    if (info.length) {
      const resultInfo = info[0][1] + charId[1];
      console.log(resultInfo, index + 1);
    }
  });
};

const command = process.argv[2];
const tableName = Watches;
const secondParam = process.argv[3] || '';
const thirdParam = process.argv[4] || '';

if (command === 'filterByCharacteristicsAndValue') {
  filterByCharacteristicsAndValue(tableName, secondParam, thirdParam);
}

if (command === 'filterByPriceRangeSortByType') {
  filterByPriceRangeSortByType(tableName, secondParam, thirdParam);
}

if (command === 'filterByProducer') {
  filterByProducer(tableName, secondParam);
}

if (command === 'orderByPriceASC') {
  orderByPriceASC(tableName);
}

if (command === 'orderByPriceDESC') {
  orderByPriceDESC(tableName);
}

if (command === 'showAllWatchesInfo') {
  showAllWatchesInfo(tableName);
}

if (command === 'showInfoForName') {
  showInfoForName(tableName, secondParam);
}

if (command === 'filterBySource') {
  filterBySource(tableName, secondParam);
}

module.exports = {
  orderByPriceDESC,
  orderByPriceASC,
  filterByProducer,
  filterByPriceRangeSortByType,
  filterByCharacteristicsAndValue,
  showAllWatchesInfo,
  showInfoForName,
  filterBySource,
  deleteTablesData,
};
