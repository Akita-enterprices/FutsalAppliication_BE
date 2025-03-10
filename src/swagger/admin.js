/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       required:
 *         - name
 *         - idNumber
 *         - futsalName
 *         - address
 *         - dayRate
 *         - nightRate
 *         - capacity
 *         - length
 *         - width
 *         - specification
 *         - agreeTerms
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the admin
 *         name:
 *           type: string
 *           description: Admin's full name
 *         idNumber:
 *           type: string
 *           description: Admin's identification number
 *         futsalName:
 *           type: string
 *           description: Name of the futsal venue
 *         address:
 *           type: string
 *           description: Address of the futsal venue
 *         dayRate:
 *           type: number
 *           description: Day rate for booking
 *         nightRate:
 *           type: number
 *           description: Night rate for booking
 *         capacity:
 *           type: number
 *           description: Venue capacity
 *         length:
 *           type: number
 *           description: Length of the venue
 *         width:
 *           type: number
 *           description: Width of the venue
 *         specification:
 *           type: string
 *           description: Specifications of the venue
 *         agreeTerms:
 *           type: boolean
 *           description: Agreement to terms and conditions
 *         email:
 *           type: string
 *           format: email
 *           description: Admin's email
 *         password:
 *           type: string
 *           description: Admin's password (hashed)
 *         fileName:
 *           type: array
 *           items:
 *             type: string
 *           description: List of image file IDs
 */

/**
 * @swagger
 * /api/admin/register:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admin]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               idNumber:
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
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               file:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Bad request, missing required fields
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns a JWT token
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin:
 *   get:
 *     summary: Get all admins
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all admins
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/{id}:
 *   get:
 *     summary: Get admin by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The admin ID
 *     responses:
 *       200:
 *         description: Admin details returned
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/{id}:
 *   put:
 *     summary: Update admin details
 *     tags: [Admin]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The admin ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               idNumber:
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
 *                 nullable: true
 *               length:
 *                 type: number
 *                 nullable: true
 *               width:
 *                 type: number
 *                 nullable: true
 *               specification:
 *                 type: string
 *               agreeTerms:
 *                 type: boolean
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               file:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/{id}:
 *   delete:
 *     summary: Delete an admin
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The admin ID
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */
