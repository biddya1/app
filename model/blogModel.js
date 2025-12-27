// model/blogModel.js
module.exports = (sequelize, DataTypes) => {
    const Blog = sequelize.define(
        "Blog", // Model name
        {
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            subTitle: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            image: {  // Changed to match index.js
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            freezeTableName: true, // Use exact table name 'Blog'
            timestamps: true,      // optional: createdAt & updatedAt
        }
    );

    return Blog;
};
