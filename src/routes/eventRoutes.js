const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: API for managing events
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of all events
 */
router.get('/', async (req, res, next) => {
  try { const events = await Event.find(); res.json(events); } catch (err) { next(err); }
});

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event data
 *       404:
 *         description: Event not found
 */
router.get('/:id', async (req, res, next) => {
  try { const event = await Event.findById(req.params.id); if (!event) return res.status(404).json({ message: 'Event not found' }); res.json(event); } catch (err) { next(err); }
});

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - location
 *               - startDate
 *               - endDate
 *               - capacity
 *               - price
 *               - createdBy
 *             properties:
 *               title:
 *                 type: string
 *               location:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               capacity:
 *                 type: integer
 *               price:
 *                 type: number
 *               createdBy:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Missing required fields
 */
router.post('/', auth, async (req, res, next) => {
  try {
    const { title, location, startDate, endDate, capacity, price, createdBy } = req.body;
    if (!title || !location || !startDate || !endDate || !capacity || !price || !createdBy) return res.status(400).json({ message: 'Missing required fields' });
    const event = new Event({ title, location, startDate, endDate, capacity, price, createdBy, description: req.body.description });
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an existing event
 *     tags: [Events]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               location:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               capacity:
 *                 type: integer
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Event not found
 */
router.put('/:id', auth, async (req, res, next) => {
  try {
    const updates = req.body;
    if ('title' in updates && !updates.title) return res.status(400).json({ message: 'Title cannot be empty' });
    if ('location' in updates && !updates.location) return res.status(400).json({ message: 'Location cannot be empty' });
    const updated = await Event.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: 'Event not found' });
    res.json(updated);
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 */
router.delete('/:id', auth, async (req, res, next) => {
  try { const deleted = await Event.findByIdAndDelete(req.params.id); if (!deleted) return res.status(404).json({ message: 'Event not found' }); res.json({ message: 'Event deleted' }); } catch (err) { next(err); }
});

module.exports = router;
