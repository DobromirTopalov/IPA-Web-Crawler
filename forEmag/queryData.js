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

const showAllWatchesInfo = (tableName) => {
  Watches.findAll({
    attributes: ['name', 'id'],
    include: [
      {
        model: Webstore,
        attributes: ['web_page'],
      },
      {
        model: Characteristics,
        attributes: ['WatchesId', 'producer', 'price', 'waranty',
        'mechanics', 'proof_level', 'clock_face'],
      },
    ],
    })
    .then((result) => result.map((element, index) => {
      const formattedResult = 'name: '+
              element.name +
              '\nprovider: ' +
              element.Webstore.web_page +
              '\nproducer: '+ element.Characteristics[0].producer +
              '\nprice: '+ formatPrice(element.Characteristics[0].price+'') +
              ' BGN' +
              '\nwaranty: '+ element.Characteristics[0].waranty + ' месеца' +
              '\nmechanics: '+ element.Characteristics[0].mechanics +
              '\nproof_level: '+ element.Characteristics[0].proof_level +
              '\nclock_face: '+ element.Characteristics[0].clock_face +
              '\n' + '---'.repeat(20) + (index + 1);
      console.log(formattedResult);
    }));
};

const showInfoForName = (tableName, productName) => {
  Watches.findAll({
    attributes: ['name', 'id'],
    include: [
      {
        model: Webstore,
        attributes: ['web_page'],
      },
      {
        model: Characteristics,
        attributes: ['WatchesId', 'producer', 'price', 'waranty',
        'mechanics', 'proof_level', 'clock_face'],
      },
    ],
    where: {
      name: productName,
    },
    })
    .then((result) => result.map((element, index) => {
      const formattedResult = 'name: '+
              element.name +
              '\nprovider: ' +
              element.Webstore.web_page +
              '\nproducer: '+ element.Characteristics[0].producer +
              '\nprice: '+ formatPrice(element.Characteristics[0].price+'') +
              ' BGN' +
              '\nwaranty: '+ element.Characteristics[0].waranty + ' месеца' +
              '\nmechanics: '+ element.Characteristics[0].mechanics +
              '\nproof_level: '+ element.Characteristics[0].proof_level +
              '\nclock_face: '+ element.Characteristics[0].clock_face +
              '\n' + '---'.repeat(20) + (index + 1);
      if (formattedResult) {
        console.log(formattedResult);
      }
    }));
};

const orderByPriceDESC = (tableName) => {
      Characteristics.findAll({
        attributes: ['WatchesId', 'producer', 'price', 'waranty',
        'mechanics', 'proof_level', 'clock_face'],
        include: [{
            model: Watches,
            attributes: ['name'],
          },
        ],
        order: [
          ['price', 'DESC'],
        ],
        })
        .then((result) => result.map((characteristic, index) => {
          const formattedResult = 'name: '+
                  characteristic.Watch.name +
                  ' '.repeat(Math.abs(70 - characteristic.Watch.name.length)) +
                  'price: ' + formatPrice(characteristic.price + '') + ' BGN';
          if (formattedResult) {
            console.log(formattedResult);
          }
        }));
};

const orderByPriceASC = (tableName) => {
  Characteristics.findAll({
    attributes: ['WatchesId', 'producer', 'price', 'waranty',
    'mechanics', 'proof_level', 'clock_face'],
    include: [{
        model: Watches,
        attributes: ['name'],
      },
    ],
    order: [
      ['price', 'ASC'],
    ],
    })
    .then((result) => result.map((characteristic, index) => {
      const formattedResult = 'name: '+
              characteristic.Watch.name +
              ' '.repeat(Math.abs(70 - characteristic.Watch.name.length)) +
              'price: ' + formatPrice(characteristic.price + '') + ' BGN';
      if (formattedResult) {
        console.log(formattedResult);
      }
    }));
};

const filterByProducer = (tableName, producer) => {
  Characteristics.findAll({
    attributes: ['WatchesId', 'producer', 'price', 'waranty',
    'mechanics', 'proof_level', 'clock_face'],
    include: [{
        model: Watches,
        attributes: ['name'],
      },
    ],
    where: {
      producer: {
        [Op.eq]: producer,
      },
    },
    })
    .then((result) => result.map((characteristic, index) => {
      const formattedResult = 'name: '+
              characteristic.Watch.name +
              ' '.repeat(Math.abs(70 - characteristic.Watch.name.length)) +
              'producer: ' + characteristic.producer;
      if (formattedResult) {
        console.log(formattedResult);
      }
    }));
};

const filterBySource = (tableName, source) => {
  Watches.findAll({
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
                              '#: ' + (index + 1);
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
                                  (tableName, characteristics, value) => {
  Characteristics.findAll({
    attributes: ['WatchesId', 'producer', 'price', 'waranty',
    'mechanics', 'proof_level', 'clock_face'],
    include: [{
        model: Watches,
        attributes: ['name'],
      },
    ],
    where: {
      [characteristics]: value,
    },
    })
    .then((result) => result.map((characteristic, index) => {
      const formattedResult = 'name: '+
              characteristic.Watch.name +
              ' '.repeat(Math.abs(70 - characteristic.Watch.name.length)) +
              'value: ' + characteristic[characteristics];
      if (formattedResult) {
        console.log(formattedResult);
      }
    }));
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
