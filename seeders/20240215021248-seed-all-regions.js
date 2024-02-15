"use strict";

const axios = require("axios");

/** @type {import('sequelize-cli').Migration} */

const parseAndInsert = (queryInterface, data) => {
  const parsedData = data.map((el) => {
    const {
      nama,
      id: uniqueId,
      kode,
      tingkat,
      createdAt = new Date(),
      updatedAt = new Date(),
    } = el;

    return {
      nama,
      uniqueId,
      kode,
      tingkat,
      createdAt,
      updatedAt,
    };
  });

  return queryInterface.bulkInsert("Regions", parsedData, {
    ignoreDuplicates: true,
  });
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const prefix = `https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp`;
    console.log("Mengambil data propinsi...");
    const { data: provinces } = await axios.get(`${prefix}/0.json`);
    await parseAndInsert(queryInterface, provinces);
    console.log("Selesai!");

    for (let province of provinces) {
      console.log(`Mengambil data kota di propinsi ${province.nama} ...`);
      const { data: cities } = await axios.get(
        `${prefix}/${province.kode}.json`
      );
      await parseAndInsert(queryInterface, cities);
      console.log("Selesai!");

      for (let city of cities) {
        console.log(`Mengambil data kecamatan di kota ${city.nama} ...`);
        const { data: kecamatan } = await axios.get(
          `${prefix}/${province.kode}/${city.kode}.json`
        );
        await parseAndInsert(queryInterface, kecamatan);
        console.log("Selesai!");

        for (let kec of kecamatan) {
          console.log(`Mengambil data desa di kecamatan ${kec.nama} ...`);
          const { data: desa } = await axios.get(
            `${prefix}/${province.kode}/${city.kode}/${kec.kode}.json`
          );
          await parseAndInsert(queryInterface, desa);
          console.log("Selesai!");

          for (let des of desa) {
            console.log(`Mengambil data TPS di desa ${des.nama} ...`);
            const { data: tps } = await axios.get(
              `${prefix}/${province.kode}/${city.kode}/${kec.kode}/${des.kode}.json`
            );
            await parseAndInsert(queryInterface, tps);
            console.log("Selesai!");
          }
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Regions", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  },
};
