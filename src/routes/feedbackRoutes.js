const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const auth = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: API for managing event feedback
 */

/**
 * @swagger
 * /feedback:
 *   get:
 *     summary: Get all feedback
 *     tags: [Feedback]
 *     responses:
 *       200:
 *         description: List of all feedback
 */
router.get('/', async (req, res, next) => { try { const fb = await Feedback.find().populate('event user'); res.json(fb); } catch (err) { next(err); } });

/**
 * @swagger
 * /feedback/{id}:
 *   get:
 *     summary: Get feedback by ID
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Feedback ID
 *     responses:
 *       200:
 *         description: Feedback data
 *       404:
 *         description: Feedback not found
 */
router.get('/:id', async (req, res, next) => { try { const f = await Feedback.findById(req.params.id).populate('event user'); if (!f) return res.status(404).json({ message: 'Feedback not found' }); res.json(f); } catch (err) { next(err); } });

/**
 * @swagger
 * /feedback:
 *   post:
 *     summary: Create new feedback
 *     tags: [Feedback]
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
 *               - rating
 *             properties:
 *               event:
 *                 type: string
 *                 description: Event ID
 *               user:
 *                 type: string
 *                 description: User ID
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Feedback created successfully
 *       400:
 *         description: Missing required fields
 */
router.post('/', auth, async (req, res, next) => { try { const { event, user, rating } = req.body; if (!event || !user || !rating) return res.status(400).json({ message: 'Missing required fields' }); const feedback = new Feedback(req.body); const newFb = await feedback.save(); res.status(201).json(newFb); } catch (err) { next(err); } });

/**
 * @swagger
 * /feedback/{id}:
 *   put:
 *     summary: Update feedback
 *     tags: [Feedback]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Feedback ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Feedback updated successfully
 *       404:
 *         description: Feedback not found
 */
router.put('/:id', auth, async (req, res, next) => { try { const updated = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!updated) return res.status(404).json({ message: 'Feedback not found' }); res.json(updated); } catch (err) { next(err); } });

/**
 * @swagger
 * /feedback/{id}:
 *   delete:
 *     summary: Delete feedback
 *     tags: [Feedback]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Feedback ID
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
 *       404:
 *         description: Feedback not found
 */
router.delete('/:id', auth, async (req, res, next) => { try { const deleted = await Feedback.findByIdAndDelete(req.params.id); if (!deleted) return res.status(404).json({ message: 'Feedback not found' }); res.json({ message: 'Feedback deleted' }); } catch (err) { next(err); } });

module.exports = router;
