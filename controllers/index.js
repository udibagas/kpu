const { Region, Vote, sequelize } = require("../models");
const { format } = require("../helpers/number");
const { Op, QueryTypes } = require("sequelize");

module.exports = {
  async home(req, res) {
    const jumlah_tps = await Region.count({
      where: {
        tingkat: 5,
      },
    });

    const jumlah_tps_with_data = await Region.count({
      where: {
        tingkat: 5,
        suara_total: {
          [Op.ne]: null,
        },
      },
    });

    const votes = await Vote.report();
    const persentase_tps = (jumlah_tps_with_data / jumlah_tps) * 100;
    const summary = await Region.summary();
    const invalid = await Region.getInvalidData();

    res.render("home", {
      jumlah_tps,
      jumlah_tps_with_data,
      persentase_tps,
      ...summary,
      invalid,
      votes,
      format,
    });
  },
};
