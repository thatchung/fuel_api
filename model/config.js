const BaseModel = require('../core/base-model');
const Util = require('../core/util');
const sequelize = require('sequelize');
const op = sequelize.Op;
const moment = require('moment');

module.exports = class extends BaseModel {
    static get _module() {
        return module;
    }

    static get _schema() {
        return {
            id: {type: sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            name: sequelize.STRING,
            value: sequelize.STRING
        };
  	}

    static async getById(id) {
        return await this.model.findOne({
            where: {
                id: id,
            },
        });
    }

    static async getByName(name) {
        return await this.model.findOne({
            where: {
                name: name,
            },
        });
    }


    static async update(id,value) {
        let temp = await this.getById(id);
        temp.value = value;
        await temp.save();

        return temp;
    }
};