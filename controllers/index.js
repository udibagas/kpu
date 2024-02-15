const { Region, Vote, sequelize } = require("../models");
const { format } = require("../helpers/number");
const { Op, QueryTypes, NUMBER } = require("sequelize");

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
    const votesClean = await Vote.reportClean();
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
      votesClean,
      format,
    });
  },

  async province(req, res) {
    try {
      const data = await sequelize.query(
        `
        select * from crosstab('select 
							r1.nama as "provinsi",
							c.number as "paslon",
							sum(v.vote) as "suara"
						from "Votes" v
						join "Candidates" c on c."uniqueId" = v."CandidateId"
						join "Regions" r on r.id = v."RegionId"
						join "Regions" r1 on r1.kode = left(r.kode, 2)
						group by r1.nama, c.number
						order by 1, 2',
						'select distinct(number) from "Candidates" order by 1')
        as (provinsi varchar, paslon1 int8, paslon2 int8, paslon3 int8)
        union
        select * from crosstab('select 
                      ''Total'' as "provinsi",
                      c.number as "paslon",
                      sum(v.vote) as "suara"
                    from "Votes" v
                    join "Candidates" c on c."uniqueId" = v."CandidateId"
                    join "Regions" r on r.id = v."RegionId"
                    JOIN "Regions" r1 on r1.kode = LEFT(r.kode, 2)
                    group by c.number
                    order by 1, 2',
                    'select distinct(number) from "Candidates" order by 1')
        as (provinsi varchar, paslon1 int8, paslon2 int8, paslon3 int8)
        order by 1
      `,
        { type: QueryTypes.SELECT }
      );

      const report = data.map((el) => {
        const { paslon1, paslon2, paslon3 } = el;
        const total = Number(paslon1) + Number(paslon2) + Number(paslon3);
        el.paslon1Percentage = ((Number(paslon1) / total) * 100).toPrecision(4);
        el.paslon2Percentage = ((Number(paslon2) / total) * 100).toPrecision(4);
        el.paslon3Percentage = ((Number(paslon3) / total) * 100).toPrecision(4);
        el.total = total;
        return el;
      });

      res.render("province", { report, format });
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  },
};
