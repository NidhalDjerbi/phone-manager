import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

export default class Phone extends Model {}

Phone.init(
    {
        brand: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imei: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Phone',
        tableName: 'phones',
        timestamps: true,
    }
);
