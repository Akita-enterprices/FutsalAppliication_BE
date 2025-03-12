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
 *     summary: Register a new admin with futsal court details
 *     tags: 
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Admin's full name
 *               idNumber:
 *                 type: string
 *                 description: Admin's identification number
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Admin's email
 *               password:
 *                 type: string
 *                 description: Admin's password (hashed)
 *               nicOrPassport:
 *                 type: string
 *                 description: Admin's NIC or Passport number
 *               futsalName:
 *                 type: string
 *                 description: Name of the futsal venue
 *               address:
 *                 type: string
 *                 description: Address of the futsal venue
 *               dayRate:
 *                 type: number
 *                 description: Day rate for booking
 *               nightRate:
 *                 type: number
 *                 description: Night rate for booking
 *               capacity:
 *                 type: number
 *                 description: Venue capacity
 *               length:
 *                 type: number
 *                 description: Length of the venue
 *               width:
 *                 type: number
 *                 description: Width of the venue
 *               specification:
 *                 type: string
 *                 description: Specifications of the venue
 *               agreeTerms:
 *                 type: boolean
 *                 description: Agreement to terms and conditions (true/false)
 *               file:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload at least one image of the futsal venue
 *     responses:
 *       201:
 *         description: Admin registered successfully
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
 *                     nicOrPassport:
 *                       type: string
 *                     futsalName:
 *                       type: string
 *       400:
 *         description: Missing required fields or validation error
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
 *               username:
 *                 type: string
 *                 description: Admin's email or NIC/Passport number
 *               password:
 *                 type: string
 *                 description: Admin's password
 *     responses:
 *       200:
 *         description: Login successful, returns a JWT token and admin details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
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
 *       401:
 *         description: Invalid username or password
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
/**
 * @swagger
 * /api/admin/addCourt:
 *   post:
 *     summary: Add a new futsal court
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []  # If authentication is required
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               futsalName:
 *                 type: string
 *                 description: Name of the futsal court
 *               idNumber:
 *                 type: string
 *                 description: Admin's identification number
 *               address:
 *                 type: string
 *                 description: Address of the futsal venue
 *               dayRate:
 *                 type: number
 *                 description: Day rate for booking
 *               nightRate:
 *                 type: number
 *                 description: Night rate for booking
 *               capacity:
 *                 type: integer
 *                 description: Venue capacity
 *               length:
 *                 type: number
 *                 description: Length of the venue
 *               width:
 *                 type: number
 *                 description: Width of the venue
 *               specification:
 *                 type: string
 *                 description: Additional specifications
 *               agreeTerms:
 *                 type: boolean
 *                 description: Agreement to terms and conditions (true/false)
 *               file:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload at least one image of the futsal venue
 *     responses:
 *       201:
 *         description: Court added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Court added successfully
 *                 courts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       futsalName:
 *                         type: string
 *                       idNumber:
 *                         type: string
 *                       address:
 *                         type: string
 *                       dayRate:
 *                         type: number
 *                       nightRate:
 *                         type: number
 *                       capacity:
 *                         type: integer
 *                       length:
 *                         type: number
 *                       width:
 *                         type: number
 *                       specification:
 *                         type: string
 *                       fileName:
 *                         type: array
 *                         items:
 *                           type: string
 *                       agreeTerms:
 *                         type: boolean
 *                       isVerified:
 *                         type: boolean
 *                         example: false
 *       400:
 *         description: Missing required fields or validation error
 *       401:
 *         description: Unauthorized (if authentication is required)
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */
