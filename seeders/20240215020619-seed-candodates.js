"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = {
      100025: {
        ts: "2024-02-14 18:44:00",
        nama: "H. ANIES RASYID BASWEDAN, Ph.D. - Dr. (H.C.) H. A. MUHAIMIN ISKANDAR",
        warna: "#8CB9BD",
        nomor_urut: 1,
      },
      100026: {
        ts: "2024-02-14 18:44:00",
        nama: "H. PRABOWO SUBIANTO - GIBRAN RAKABUMING RAKA",
        warna: "#C7B7A3",
        nomor_urut: 2,
      },
      100027: {
        ts: "2024-02-14 18:44:00",
        nama: "H. GANJAR PRANOWO, S.H., M.I.P. - Prof. Dr. H. M. MAHFUD MD",
        warna: "#B67352",
        nomor_urut: 3,
      },
    };

    const candidates = [];

    for (let uniqueId in data) {
      candidates.push({
        uniqueId: uniqueId,
        name: data[uniqueId].nama,
        number: data[uniqueId].nomor_urut,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert("Candidates", candidates);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "Candidates",
      {},
      {
        cascade: true,
        truncate: true,
        restartIdentity: true,
      }
    );
  },
};
