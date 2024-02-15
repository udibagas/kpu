const { Region, sequelize } = require("../models");
const { format } = require("../helpers/number");
const { QueryTypes } = require("sequelize");

module.exports = {
  async home(req, res) {
    const summary = await Region.findOne({
      raw: true,
      attributes: [
        [sequelize.fn("SUM", sequelize.col("suara_total")), "suara_total"],
        [sequelize.fn("SUM", sequelize.col("suara_sah")), "suara_sah"],
        [
          sequelize.fn("SUM", sequelize.col("suara_tidak_sah")),
          "suara_tidak_sah",
        ],
      ],
    });

    const invalid = await sequelize.query(
      `
      SELECT 
        COUNT(*) AS "invalid"
      FROM "Regions"
      WHERE 
        "tingkat" = 5
        AND "suara_total" != "suara_sah" + "suara_tidak_sah"
      `,
      { type: QueryTypes.SELECT }
    );

    summary.selisih =
      summary.suara_total - summary.suara_sah - summary.suara_tidak_sah;
    res.render("home", { ...summary, invalid: invalid[0].invalid, format });
  },
};
