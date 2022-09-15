'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Stage,Stage_events,Meet_greet,Set_time}) {
      // define association here
      Event.belongsToMany(Stage, {
        foreignKey: "event_id",
        as: "stages",
        through: Stage_events
      })
      
      Event.hasMany(Meet_greet, {
        foreignKey: "event_id",
        as: "meet_greet"
      })

      Event.hasMany(Set_time, {
        foreignKey: "event_id",
        as: "set_time"
      })
    }
  }
  Event.init({
    event_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Event',
    tableName: 'events',
    timestamps: false
  });
  return Event;
};