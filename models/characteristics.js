'use strict';
module.exports = (sequelize, DataTypes) => {
  const Characteristics = sequelize.define('Characteristics', {
    producer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      validate: {
        isDecimal: true,
      },
      allowNull: false,
    },
    waranty: {
      type: DataTypes.INTEGER,
      validate: {
        len: [1, 120],
      },
      allowNull: false,
    },
    mechanics: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    proof_level: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clock_face: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {});
  Characteristics.associate = (models) => {
    // associations can be defined here
  };

  return Characteristics;
};
