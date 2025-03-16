/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - phone
 *         - nicOrPassport
 *         - address
 *       properties:
 *         name:
 *           type: string
 *           description: The user's full name
 *           example: "John Doe"
 *         email:
 *           type: string
 *           description: The user's email address
 *           format: email
 *           example: "johndoe@example.com"
 *         password:
 *           type: string
 *           description: The user's password
 *           format: password
 *           example: "SecurePassword123"
 *         phone:
 *           type: string
 *           description: The user's phone number
 *           example: "+94771234567"
 *         nicOrPassport:
 *           type: string
 *           description: The user's NIC or Passport number
 *           example: "987654321V"
 *         address:
 *           type: string
 *           description: The user's address
 *           example: "123, Main Street, Colombo, Sri Lanka"
 *
 *     UserProfile:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "65a8cd3e8b7a2d0012345678"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "johndoe@example.com"
 *         phone:
 *           type: string
 *           example: "+94771234567"
 *         nicOrPassport:
 *           type: string
 *           example: "987654321V"
 *         address:
 *           type: string
 *           example: "123, Main Street, Colombo, Sri Lanka"
 *
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with the provided details.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "65a8cd3e8b7a2d0012345678"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "johndoe@example.com"
 *                 phone:
 *                   type: string
 *                   example: "+94771234567"
 *                 nicOrPassport:
 *                   type: string
 *                   example: "987654321V"
 *                 address:
 *                   type: string
 *                   example: "123, Main Street, Colombo, Sri Lanka"
 *       400:
 *         description: User already exists or invalid data
 *       500:
 *         description: Server error during signup
 */

/**
 * @swagger
 * /api/auth/userLogin:
 *   post:
 *     summary: User Login
 *     description: Authenticate a user using email or NIC/Passport and password.
 *     tags: [Authentication]
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
 *                 description: User's email or NIC/Passport
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *                 example: "P@ssw0rd123"
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User authenticated successfully"
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     phone:
 *                       type: string
 *                       example: "+94712345678"
 *                     address:
 *                       type: string
 *                       example: "123, Colombo, Sri Lanka"
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get User Profile
 *     description: Fetch the authenticated user's profile using a JWT token.
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []  # Requires Bearer Token for authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "65f4c3b6e3b7a45f12345678"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *                 phone:
 *                   type: string
 *                   example: "+94712345678"
 *                 nicOrPassport:
 *                   type: string
 *                   example: "987654321V"
 *                 address:
 *                   type: string
 *                   example: "123, Colombo, Sri Lanka"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-03-15T08:30:00.123Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-03-16T10:45:30.789Z"
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error while fetching user info
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         phone:
 *           type: string
 *           description: The phone number of the user
 *         nicOrPassport:
 *           type: string
 *           description: The NIC or Passport number of the user
 */


/**
 * @swagger
 * /api/auth/getAllUsers:
 *   get:
 *     summary: Get All Users
 *     description: Retrieve a list of all registered users. Requires authentication.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []  # Requires Bearer Token for authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "65f4c3b6e3b7a45f12345678"
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   email:
 *                     type: string
 *                     example: "user@example.com"
 *                   phone:
 *                     type: string
 *                     example: "+94712345678"
 *                   nicOrPassport:
 *                     type: string
 *                     example: "987654321V"
 *                   address:
 *                     type: string
 *                     example: "123, Colombo, Sri Lanka"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-03-15T08:30:00.123Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-03-16T10:45:30.789Z"
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 *       500:
 *         description: Server error while fetching users
 */

/**
 * @swagger
 * /api/auth/users/{id}:
 *   get:
 *     summary: Get a User by ID
 *     description: Retrieve details of a specific user by their ID. Requires authentication.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []  # Requires Bearer Token for authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "65f4c3b6e3b7a45f12345678"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *                 phone:
 *                   type: string
 *                   example: "+94712345678"
 *                 nicOrPassport:
 *                   type: string
 *                   example: "987654321V"
 *                 address:
 *                   type: string
 *                   example: "123, Colombo, Sri Lanka"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-03-15T08:30:00.123Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-03-16T10:45:30.789Z"
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error while fetching user info
 */

/**
 * @swagger
 * /api/auth/updateUser:
 *   put:
 *     summary: Update authenticated user's profile
 *     description: Allows an authenticated user to update their profile details (except NIC/Passport). Requires authentication.
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []  # Requires Bearer Token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *                 description: Must be unique if changed
 *               phone:
 *                 type: string
 *                 example: "+94712345678"
 *                 description: Must be unique if changed
 *               address:
 *                 type: string
 *                 example: "123, Colombo, Sri Lanka"
 *             example:
 *               name: "John Doe"
 *               email: "john.doe@example.com"
 *               phone: "+94712345678"
 *               address: "123, Colombo, Sri Lanka"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     phone:
 *                       type: string
 *                       example: "+94712345678"
 *                     address:
 *                       type: string
 *                       example: "123, Colombo, Sri Lanka"
 *       400:
 *         description: Invalid input or duplicate email/phone
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error while updating user
 */

/**
 * @swagger
 * /api/auth/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Remove a user from the system
 *     tags: [Authentication]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
