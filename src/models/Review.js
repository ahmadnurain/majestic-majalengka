import { DataTypes } from "sequelize";
import sequelize from "../lib/sequelize";
import User from "./User";
import Place from "./Place";

const Review = sequelize.define(
  "Review",
  {
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true, // Kolom createdAt dan updatedAt otomatis ditambahkan
  }
);

Review.belongsTo(User, { foreignKey: "userId" });
Review.belongsTo(Place, { foreignKey: "placeId" });

export default Review;
