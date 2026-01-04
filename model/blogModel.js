module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define(
    "Blog",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      subTitle: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      image: { type: DataTypes.STRING, allowNull: true },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "User", key: "id" }, // works because User table is frozen
        onDelete: "CASCADE",
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  return Blog;
};
