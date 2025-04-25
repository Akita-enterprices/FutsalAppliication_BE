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
 *     tags: 
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *               - file
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the admin.
 *               idNumber:
 *                 type: string
 *                 description: Identification number of the admin.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the admin.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password for admin login.
 *               nicOrPassport:
 *                 type: string
 *                 description: NIC or Passport number.
 *               futsalName:
 *                 type: string
 *                 description: Name of the futsal court.
 *               address:
 *                 type: string
 *                 description: Address of the court.
 *               dayRate:
 *                 type: number
 *                 format: float
 *                 description: Daytime rental rate.
 *               nightRate:
 *                 type: number
 *                 format: float
 *                 description: Nighttime rental rate.
 *               capacity:
 *                 type: integer
 *                 description: Maximum capacity of the court.
 *               length:
 *                 type: number
 *                 format: float
 *                 description: Length of the court in meters.
 *               width:
 *                 type: number
 *                 format: float
 *                 description: Width of the court in meters.
 *               specification:
 *                 type: string
 *                 description: Specifications of the court.
 *               agreeTerms:
 *                 type: boolean
 *                 description: Agreement to terms and conditions.
 *               file:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Images of the futsal court.
 *     responses:
 *       201:
 *         description: Admin registered successfully. Super Admin and Admin receive verification emails.
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
 *                     verificationToken:
 *                       type: string
 *       400:
 *         description: Bad request, missing required fields or invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
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
 * /api/admin/addCourt:
 *   post:
 *     summary: Add a new futsal court
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []  # If authentication is required
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

/**
 * @swagger
 * /api/admin/getCourts:
 *   get:
 *     summary: Get courts by admin ID
 *     description: Retrieves all futsal courts associated with the logged-in admin.
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved courts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courts:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Admin not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/admin/:
 *   get:
 *     summary: Get all admins
 *     description: Retrieves a list of all registered admins along with their courts and images.
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: Successfully retrieved all admins.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/admin/changePassword:
 *   put:
 *     summary: Change admin password
 *     description: Allows an admin to change their password after verifying the old password.
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
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
 *                 description: The current password of the admin.
 *               newPassword:
 *                 type: string
 *                 description: The new password (minimum 8 characters).
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request, incorrect old password or weak new password.
 *       401:
 *         description: Unauthorized, missing or invalid token.
 *       403:
 *         description: Forbidden, invalid token.
 *       404:
 *         description: Admin not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/admin/update:
 *   put:
 *     summary: Update admin information
 *     description: Allows an authenticated admin to update their name and email.
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the admin.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The new email address for the admin.
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin updated successfully
 *                 admin:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *       400:
 *         description: Bad Request – Email already in use
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email is already in use
 *       401:
 *         description: Unauthorized – No token provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized: No token provided"
 *       403:
 *         description: Forbidden – Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden: Invalid token"
 *       404:
 *         description: Not Found – Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin not found"
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
   * /api/updateCourt/{courtId}:
   *   put:
   *     summary: Update court details by ID
   *     description: Allows an authenticated admin to update a futsal court's details, excluding `idNumber`.
   *     tags: [Admin]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: courtId
   *         required: true
   *         description: The ID of the court to update.
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
   *                 example: "Elite Futsal Arena"
   *               address:
   *                 type: string
   *                 example: "456 New Street, City Center"
   *               dayRate:
   *                 type: number
   *                 example: 2800
   *               nightRate:
   *                 type: number
   *                 example: 3500
   *               capacity:
   *                 type: number
   *                 example: 20
   *               length:
   *                 type: number
   *                 example: 12
   *               width:
   *                 type: number
   *                 example: 12
   *               specification:
   *                 type: string
   *                 example: "New synthetic turf with floodlights"
   *               agreeTerms:
   *                 type: boolean
   *                 example: true
   *               images:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     imageId:
   *                       type: string
   *                       example: "67d99c4a92cbc79a190ec305"
   *                     newImage:
   *                       type: string
   *                       example: "https://res.cloudinary.com/demo/image/upload/v1234567890/newimage1.jpg"
   *     responses:
   *       200:
   *         description: Court updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Court updated successfully"
   *                 updatedCourt:
   *                   type: object
   *       400:
   *         description: Invalid request (e.g., trying to update `idNumber` or incorrect image index)
   *       401:
   *         description: Unauthorized - No token provided
   *       403:
   *         description: Forbidden - Admin does not own the court
   *       404:
   *         description: Court or Admin not found
   *       500:
   *         description: Server error
   */

