const axios = require("axios");
const { Region, Vote } = require("./models");

const getData = async () => {
  const url = `https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp`;
  const regions = await Region.findAll({
    where: { tingkat: 5 },
  });

  for (let i = 0; i < regions.length; i++) {
    const r = regions[i];
    console.log(`(${i + 1}/${regions.length}) TPS ${r.kode}`);

    const lvl1 = r.kode.slice(0, 2);
    const lvl2 = r.kode.slice(0, 4);
    const lvl3 = r.kode.slice(0, 6);
    const lvl4 = r.kode.slice(0, 10);
    const lvl5 = r.kode;

    const tps = [lvl1, lvl2, lvl3, lvl4, lvl5].join("/");
    const { data } = await axios.get(`${url}/${tps}.json`);
    const { status_suara, status_adm, chart: vote, administrasi } = data;

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
  // while (true) {
  try {
    await getData();
  } catch (error) {
    console.log(error.message);
  }
  // }
})();
