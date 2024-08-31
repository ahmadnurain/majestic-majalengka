import { DataTypes } from "sequelize";
import sequelize from "../lib/sequelize";

const Accommodation = sequelize.define(
  "Accommodation",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ranking: {
      type: DataTypes.FLOAT, // Misalnya, bintang 4.5
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    officialWebsite: {
      type: DataTypes.STRING, // Menyimpan URL website resmi
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    images: {
      type: DataTypes.JSON, // Menyimpan array URL gambar
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

export default Accommodation;
