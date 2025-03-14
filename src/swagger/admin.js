/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management API
 */

/**
 * @swagger
 * /api/admin/register:
 *   post:
 *     summary: Registers a new admin and futsal court
 *     description: Registers an admin with their futsal court details including images.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - idNumber
 *               - email
 *               - password
 *               - nicOrPassport
 *               - futsalName
 *               - address
 *               - dayRate
 *               - nightRate
 *               - capacity
 *               - length
 *               - width
 *               - specification
 *               - agreeTerms
 *             properties:
 *               name:
 *                 type: string
 *               idNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               nicOrPassport:
 *                 type: string
 *               futsalName:
 *                 type: string
 *               address:
 *                 type: string
 *               dayRate:
 *                 type: number
 *               nightRate:
 *                 type: number
 *               capacity:
 *                 type: number
 *               length:
 *                 type: number
 *               width:
 *                 type: number
 *               specification:
 *                 type: string
 *               agreeTerms:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Admin successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 admin:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     futsalName:
 *                       type: string
 *       400:
 *         description: Missing required fields or invalid data
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     description: Allows admins to log in by providing their username (email or NIC/Passport) and password.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin successfully authenticated and token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/change-password:
 *   put:
 *     summary: Change admin password
 *     description: Allows an authenticated admin to change their password.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid old password or new password criteria not met
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/court/{courtId}:
 *   put:
 *     summary: Update futsal court details
 *     description: Allows an admin to update their futsal court details (except `idNumber`).
 *     tags: [Court]
 *     parameters:
 *       - in: path
 *         name: courtId
 *         required: true
 *         description: The ID of the futsal court to be updated
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               futsalName:
 *                 type: string
 *               address:
 *                 type: string
 *               dayRate:
 *                 type: number
 *               nightRate:
 *                 type: number
 *               capacity:
 *                 type: number
 *               length:
 *                 type: number
 *               width:
 *                 type: number
 *               specification:
 *                 type: string
 *               fileName:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Court updated successfully
 *       400:
 *         description: Invalid data or court not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/{id}:
 *   delete:
 *     summary: Delete an admin by ID
 *     description: Allows an admin to delete their account.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Admin ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */
