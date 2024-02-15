const axios = require("axios");
const { Region, Vote } = require("./models");
const { Op } = require("sequelize");

const getData = async (kode, order = "ASC") => {
  const regions = await Region.findAll({
    where: {
      tingkat: 5,
      kode: {
        [Op.like]: `${kode}%`,
      },
      vote: null,
    },
    order: [["kode", order]],
  });

  for (let i = 0; i < regions.length; i++) {
    const r = regions[i];
    console.log(`(${i + 1}/${regions.length}) TPS ${r.kode}`);

    const { data } = await axios.get(r.url);
    const {
      status_suara,
      status_adm,
      chart: vote,
      administrasi,
      images,
    } = data;

    if (!administrasi) {
      console.log(`Belum ada data`);
      continue;
    }

    const { suara_total, suara_sah, suara_tidak_sah } = administrasi;

    await Region.update(
      {
        vote,
        status_suara,
        status_adm,
        suara_total,
        suara_sah,
        suara_tidak_sah,
        images,
      },
      { where: { id: r.id } }
    );

    console.log({
      suara_total,
      suara_sah,
      suara_tidak_sah,
      vote,
    });

    for (let CandidateId in vote) {
      const v = vote[CandidateId];
      if (v) {
        await Vote.upsert({ CandidateId, RegionId: r.id, vote: v }, ["vote"]);
      }
    }
  }
};

(async () => {
  try {
    const provinces = await Region.findAll({
      where: {
        tingkat: 1,
      },
    });
    provinces.forEach((p) => {
      getData(p.kode, process.argv[2]);
    });
  } catch (error) {
    console.log(error.message);
  }
})();
