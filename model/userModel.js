// model/userModel.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("user", {
        username: { type: DataTypes.STRING, allowNull: false, unique: true },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false }
    }, {
        freezeTableName: true,
        timestamps: true
    });
};
