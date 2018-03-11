'use strict';
module.exports = (sequelize, DataTypes) => {
  const Watches = sequelize.define('Watches', {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {});
  Watches.associate = (models) => {
    // associations can be defined here
    const {
      Webstore,
      Characteristics,
    } = models;

    Watches.belongsTo(Webstore, { foreignKey: 'WebstoreId' });
    Watches.hasMany(Characteristics, { foreignKey: 'WatchesId' });
  };

  return Watches;
};
