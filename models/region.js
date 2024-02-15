"use strict";
const { Model, QueryTypes } = require("sequelize");

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

    get selisih() {
      return this.suara_total - this.suara_sah - this.suara_tidak_sah;
    }

    get desa() {
      return this.dataValues.desa;
    }

    get kecamatan() {
      return this.dataValues.kecamatan;
    }

    get kota() {
      return this.dataValues.kota;
    }

    get propinsi() {
      return this.dataValues.propinsi;
    }

    get url() {
      const url = `https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp`;
      const lvl1 = this.kode.slice(0, 2);
      const lvl2 = this.kode.slice(0, 4);
      const lvl3 = this.kode.slice(0, 6);
      const lvl4 = this.kode.slice(0, 10);
      const lvl5 = this.kode;
      const tps = [lvl1, lvl2, lvl3, lvl4, lvl5].join("/");
      return `${url}/${tps}.json`;
    }

    static summary() {
      return this.findOne({
        raw: true,
        attributes: [
          [sequelize.fn("SUM", sequelize.col("suara_total")), "suara_total"],
          [sequelize.fn("SUM", sequelize.col("suara_sah")), "suara_sah"],
          [
            sequelize.fn("SUM", sequelize.col("suara_tidak_sah")),
            "suara_tidak_sah",
          ],
          [
            sequelize.literal(
              "SUM(suara_total) - SUM(suara_sah) - SUM(suara_tidak_sah)"
            ),
            "selisih",
          ],
        ],
      });
    }

    static async getInvalidData(page) {
      let query = `
        SELECT
          r5.*,
          r4."nama" AS "desa",
          r3."nama" AS "kecamatan",
          r2."nama" AS "kota",
          r1."nama" AS "propinsi"
        FROM "Regions" r5
        JOIN "Regions" r4 ON r4."kode" = LEFT(r5."kode", 10)
        JOIN "Regions" r3 ON r3."kode" = LEFT(r5."kode", 6)
        JOIN "Regions" r2 ON r2."kode" = LEFT(r5."kode", 4)
        JOIN "Regions" r1 ON r1."kode" = LEFT(r5."kode", 2)
        WHERE 
          r5."tingkat" = 5
          AND (
            r5."suara_total" != r5."suara_sah" + r5."suara_tidak_sah"
            OR r5."suara_total" > 300
            OR r5."suara_sah" > 300
          )
        ORDER BY "propinsi", "kota", "kecamatan", "desa", "nama"
        `;

      const count = await sequelize.query(query, {
        type: QueryTypes.SELECT,
        mapToModel: true,
        model: Region,
      });

      const rows = await sequelize.query(
        `${query} LIMIT 100 OFFSET ${(page - 1) * 100}`,
        {
          type: QueryTypes.SELECT,
          mapToModel: true,
          model: Region,
        }
      );

      return { count: count.length, rows };
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
      vote: DataTypes.JSON,
      images: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "Region",
    }
  );
  return Region;
};
