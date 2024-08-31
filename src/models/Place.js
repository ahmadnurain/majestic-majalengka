import { DataTypes } from "sequelize";
import sequelize from "../lib/sequelize";

const Place = sequelize.define(
  "Place",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    operationalHours: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    maps: {
      type: DataTypes.STRING,
    },
    socialMedia: {
      type: DataTypes.JSON,
    },
    images: {
      type: DataTypes.JSON, // Array of image URLs
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

export default Place;
