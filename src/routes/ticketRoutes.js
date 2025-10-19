const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const auth = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: API for managing tickets
 */

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Get all tickets
 *     tags: [Tickets]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all tickets
 */
router.get('/', auth, async (req, res, next) => { try { const tickets = await Ticket.find().populate('event user'); res.json(tickets); } catch (err) { next(err); } });

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Get a ticket by ID
 *     tags: [Tickets]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Ticket data
 *       404:
 *         description: Ticket not found
 */
router.get('/:id', auth, async (req, res, next) => { try { const t = await Ticket.findById(req.params.id).populate('event user'); if (!t) return res.status(404).json({ message: 'Ticket not found' }); res.json(t); } catch (err) { next(err); } });

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Tickets]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event
 *               - user
 *             properties:
 *               event:
 *                 type: string
 *                 description: Event ID
 *               user:
 *                 type: string
 *                 description: User ID
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *       400:
 *         description: Missing required fields
 */
router.post('/', auth, async (req, res, next) => { try { const { event, user } = req.body; if (!event || !user) return res.status(400).json({ message: 'Missing required fields' }); const ticket = new Ticket({ event, user }); const newTicket = await ticket.save(); res.status(201).json(newTicket); } catch (err) { next(err); } });

/**
 * @swagger
 * /tickets/{id}:
 *   put:
 *     summary: Update a ticket
 *     tags: [Tickets]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *               user:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *       404:
 *         description: Ticket not found
 */
router.put('/:id', auth, async (req, res, next) => { try { const updated = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!updated) return res.status(404).json({ message: 'Ticket not found' }); res.json(updated); } catch (err) { next(err); } });

/**
 * @swagger
 * /tickets/{id}:
 *   delete:
 *     summary: Delete a ticket
 *     tags: [Tickets]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Ticket deleted successfully
 *       404:
 *         description: Ticket not found
 */
router.delete('/:id', auth, async (req, res, next) => { try { const deleted = await Ticket.findByIdAndDelete(req.params.id); if (!deleted) return res.status(404).json({ message: 'Ticket not found' }); res.json({ message: 'Ticket deleted' }); } catch (err) { next(err); } });

module.exports = router;
