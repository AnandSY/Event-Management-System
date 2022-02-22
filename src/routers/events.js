const express = require('express')
const Event = require('../models/events')
const auth = require('../middleware/auth')
const User = require('../models/userDetails')
const router = new express.Router()

router.post('/events', auth, async (req, res) => {
    const events = new Event({
        ...req.body,
        owner: req.user._id
    })

    try {
        await events.save()
        res.status(201).send(events)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/events/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const events = await Event.findOne({ _id, owner: req.user._id })

        if (!events) {
            return res.status(404).send()
        }

        res.send(events)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/events/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'information','address','details','invited']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const events = await Event.findOne({ _id: req.params.id, owner: req.user._id})

        if (!events) {
            return res.status(404).send()
        }

        updates.forEach((update) => events[update] = req.body[update])
        await events.save()
        res.send(events)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/events/:id', auth, async (req, res) => {
    try {
        const events = await Event.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!events) {
            res.status(404).send()
        }

        res.send(events)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/events/inviteuser/:id', function(req, res, next) {
    Event.findOneAndUpdate({_id: req.params.id}, {$addToSet: {invited: req.body.user_id}}, function(err, ev) {
      if (err)
        console.log(err)
      else 
        res.status(200).send('Done!')
    })
    User.findOneAndUpdate({_id: req.body.user_id}, {$addToSet: {invited: req.params.id}}, function(err, ev) {
        if (err)
          console.log(err)
        else 
          res.status(200).send('Done!')
      })
  })

module.exports = router