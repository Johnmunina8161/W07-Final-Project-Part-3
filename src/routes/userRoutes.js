const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', auth, async (req, res, next) => { try { const users = await User.find().select('-oauthId'); res.json(users); } catch (err) { next(err); } });

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User data
 *       404:
 *         description: User not found
 */
router.get('/:id', auth, async (req, res, next) => { try { const user = await User.findById(req.params.id); if (!user) return res.status(404).json({ message: 'User not found' }); res.json(user); } catch (err) { next(err); } });

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - oauthProvider
 *               - oauthId
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               oauthProvider:
 *                 type: string
 *               oauthId:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Email already exists
 */
router.post('/', async (req, res, next) => {
  try {
    const { name, email, oauthProvider, oauthId } = req.body;
    if (!name || !email || !oauthProvider || !oauthId) return res.status(400).json({ message: 'Missing required fields' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already exists' });
    const user = new User({ name, email, oauthProvider, oauthId });
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               oauthProvider:
 *                 type: string
 *               oauthId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put('/:id', auth, async (req, res, next) => { try { const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!updated) return res.status(404).json({ message: 'User not found' }); res.json(updated); } catch (err) { next(err); } });

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/:id', auth, async (req, res, next) => { try { const deleted = await User.findByIdAndDelete(req.params.id); if (!deleted) return res.status(404).json({ message: 'User not found' }); res.json({ message: 'User deleted' }); } catch (err) { next(err); } });

module.exports = router;
