"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Region extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Region.init(
    {
      nama: DataTypes.STRING,
      uniqueId: DataTypes.INTEGER,
      kode: DataTypes.STRING,
      tingkat: DataTypes.INTEGER,
      suara_total: DataTypes.INTEGER,
      suara_sah: DataTypes.INTEGER,
      suara_tidak_sah: DataTypes.INTEGER,
      status_suara: DataTypes.BOOLEAN,
      status_adm: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Region",
    }
  );
  return Region;
};
