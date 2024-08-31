import { DataTypes } from "sequelize";
import sequelize from "../lib/sequelize";
import User from "./User"; // Import model User untuk relasi

const News = sequelize.define(
  "News",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    authorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING, // URL untuk gambar berita
    },
    sourceLink: {
      type: DataTypes.STRING, // Link sumber berita
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    reads: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    publishedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Tanggal saat berita diposting
    },
  },
  {
    timestamps: true,
  }
);

// Relasi dengan User (opsional jika Anda ingin menghubungkan dengan akun user)
News.belongsTo(User, { foreignKey: "userId" });

export default News;
