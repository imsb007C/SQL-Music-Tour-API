// DEPENDENCIES
const events = require('express').Router()
const db = require('../models')
const { Event, Meet_greet, Set_time, Stage, Band, Stage_events } = db 
const { Op } = require('sequelize')

// EXPORT// FIND ALL EVENT

events.get('/', async (req, res) => {
    try {
        const foundEvent = await Event.findAll({
            order: [[ 'date', 'ASC']],
            where: {
                name: { [Op.like]: `%${req.query.name ? req.query.name:''}%`}
            }
        })
        res.status(200).json(foundEvent)
    } catch (error) {
        res.status(500).json(error)
    }
})

events.get('/:name', async (req, res) => {
    try {
        const foundEvent = await Event.findOne({
            where: { name: req.params.name },
            include: [
                { 
                    model: Meet_greet, 
                    as: "meet_greet",
                    attributes:{ exclude: [ "event_id", "band_id"]},
                    include: {
                        model: Band, 
                        as: "bands",
                        where: { name: { [Op.like]: `%${req.query.bands ? req.query.bands : ''}%`}}
                    }
                },
                {
                    model: Set_time,
                    as: "set_time",
                    attributes: {exclude: [ "event_id", "stage_id", "band_id"]},
                    include: [{
                        model: Band, 
                        as: "bands",
                        where: { name: { [Op.like]: `%${req.query.bands ? req.query.bands : ''}%`}}
                    },
                    {
                        model: Stage,
                        as: "stages",
                        where: { name: { [Op.like]: `%${req.query.stages ? req.query.stages : ''}%`}}
                    }]
                },
                {
                    model: Stage,
                    as: "stages",
                    through: { attributes:[]}
                }
            ]
        })
        res.status(200).json(foundEvent)
    } catch (error) {
        res.status(500).json(error)
    }
})

// CREATE A EVENT
events.post('/', async (req, res) => {
    try {
        const newEvent = await Event.create(req.body)
        res.status(200).json({
            message: 'Successfully inserted a new event',
            data: newEvent
        })
    } catch(err) {
        res.status(500).json(err)
    }
})
// UPDATE A BAND
events.put('/:id', async (req, res) => {
    try {
        const updatedEvent = await Event.update(req.body, {
            where: {
                event_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully updated ${updatedEvent} event(s)`
        })
    } catch(err) {
        res.status(500).json(err)
    }
})
// DELETE A EVENT
events.delete('/:id', async (req, res) => {
    try {
        const deletedEvent = await Event.destroy({
            where: {
                event_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully deleted ${deletedEvent} event(s)`
        })
    } catch(err) {
        res.status(500).json(err)
    }
})



module.exports = events
