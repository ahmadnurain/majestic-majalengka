import { DataTypes } from "sequelize";
import sequelize from "../lib/sequelize";
import Place from "./Place";

const TicketInfo = sequelize.define(
  "TicketInfo",
  {
    ticketPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    carParking: {
      type: DataTypes.FLOAT,
    },
    bikeParking: {
      type: DataTypes.FLOAT,
    },
  },
  {
    timestamps: true,
  }
);

TicketInfo.belongsTo(Place, { foreignKey: "placeId" });

export default TicketInfo;
