import { Sequelize } from "sequelize";

const sequelize = new Sequelize("bsa2vh3vobtjtbckahdr", "uxcdqbrjopavdgkf", "XS1QLx9o6QAUlc23fUqf", {
  host: "bsa2vh3vobtjtbckahdr-mysql.services.clever-cloud.com",
  dialect: "mysql",
});

export default sequelize;
