module.exports = function(sequelize, DataTypes){
    const product = sequelize.define('Product',{
        title : {
            type: DataTypes.STRING(20),
            allowNull : false
        },
        price : {
            type: DataTypes.INTEGER(10),
            allowNull: false
        },
        description : {
            type: DataTypes.STRING(300),
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING(300),
            allowNull: true
        },
        soldout : {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue : 0,
        },
        type: {
            type: DataTypes.STRING(50),
            allowNull: true,
        }
    })
    return product
}