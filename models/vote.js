"use strict";
const { Model, QueryTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static report() {
      return sequelize.query(
        `
          SELECT 
            c."name" AS "name", 
            c."number" AS "number", 
            SUM(v."vote") AS "vote"
          FROM "Candidates" c
          JOIN "Votes" v ON v."CandidateId" = c."uniqueId"
          GROUP BY c."name", c."number"
          ORDER BY c."number"
        `,
        { type: QueryTypes.SELECT }
      );
    }

    static reportClean() {
      return sequelize.query(
        `
          SELECT 
            c."name" AS "name", 
            c."number" AS "number", 
            SUM(v."vote") AS "vote"
          FROM "Candidates" c
          JOIN "Votes" v ON v."CandidateId" = c."uniqueId"
          JOIN "Regions" r ON r.id = v."RegionId"
          WHERE
            r."suara_total" = r."suara_sah" + r."suara_tidak_sah"
            AND r."status_suara" = true
            AND r."status_adm" = true
          GROUP BY c."name", c."number"
          ORDER BY c."number"
        `,
        { type: QueryTypes.SELECT }
      );
    }
  }

  Vote.init(
    {
      CandidateId: DataTypes.INTEGER,
      RegionId: DataTypes.INTEGER,
      vote: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Vote",
    }
  );
  return Vote;
};
