'use strict';
module.exports = (sequelize, DataTypes) => {
  const Webstore = sequelize.define('Webstore', {
    web_page: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {});
  Webstore.associate = (models) => {
    // associations can be defined here
  };
  return Webstore;
};
