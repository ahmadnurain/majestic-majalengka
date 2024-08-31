import { Sequelize } from "sequelize";

const sequelize = new Sequelize("majesti5_majesti5", "majesti5", "2.Ri~]O;lspa", {
  host: "https://majesticmajalengka.my.id/",
  dialect: "mysql",
});

export default sequelize;
