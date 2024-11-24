# Soar Server

Soar is a platform designed to help people achieve their financial goals by offering innovative financial and property investment solutions. The platform provides tools to simplify and streamline the user experience, making it easier for users to manage their finances and investments.

## Features

- **User Authentication**: Register, login, and manage user accounts with JWT-based authentication
- **Credit Card Management**: Manage and track credit card transactions and details
- **Transactions**: Handle user transactions and manage financial data
- **Analytics**: Provide analytics and insights to users for better decision-making
- **Cloud Integration**: Use Cloudinary for file uploads and media storage
- **File Upload**: Secure file upload functionality with Express file upload
- **Rate Limiting**: Protect the API from abuse with rate limiting
- **Error Handling**: Graceful error handling with custom middleware
- **Environment Configuration**: Store sensitive data in environment variables using `.env` files

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Cloudinary](https://cloudinary.com/) account for media storage

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/AbhishekKolge/soar-server.git
cd soar-server
```

### 2. Install dependencies

Using pnpm:
```bash
pnpm install
```

Or using npm:
```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file in the root directory and add the following:

```env
DATABASE_URL="your_database_url"
NODE_ENV="development"
PORT="8000"
APP_NAME="Soar"
CLOUD_API_KEY="your_cloudinary_api_key"
CLOUD_API_SECRET="your_cloudinary_api_secret"
CLOUD_NAME="your_cloud_name"
EMAIL_FROM_ID="your_email@example.com"
EMAIL_FROM_NAME="Soar"
FRONT_END_ORIGIN="http://localhost:5173"
JWT_SECRET="your_jwt_secret"
SENDGRID_API_KEY="your_sendgrid_api_key"
SENDGRID_HOST="smtp.sendgrid.net"
SENDGRID_PORT="587"
SENDGRID_USER="apikey"
TEST_USER_ID=""
TOKEN_EXPIRATION_TIME="3600000"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_CALLBACK_URL="/api/v1/auth/google/callback"
ENCRYPT_IV="your_encryption_iv"
ENCRYPT_KEY="your_encryption_key"
```

### 4. Setup Prisma and Database

1. Install Prisma CLI globally (if not already installed):
```bash
npm install -g prisma
# or
pnpm add -g prisma
```

2. Initialize Prisma in your project:
```bash
npx prisma init
```

3. Update your database schema in `prisma/schema.prisma`. The project includes models for users, accounts, transactions, and other features.

4. Create and apply database migrations:
```bash
# Generate migration files
npx prisma migrate dev --name init
```

5. Generate Prisma Client:
```bash
npx prisma generate
```

6. (Optional) View your database with Prisma Studio:
```bash
npx prisma studio
```

### 5. Run the application

Development mode:
```bash
pnpm run dev
# or
npm run dev
```

Production mode:
```bash
pnpm run start
# or
npm run start
```

### 6. Seed the data for countries and banks

```bash
pnpm run seed
```

## System Architecture

### Diagrams

#### User Flow Diagram
View the detailed user flow diagram here:
[User Flow Diagram](https://app.eraser.io/workspace/2nWABkioYzntAg8KWpXi?origin=share)

#### Database Design Diagram
View the complete database design here:
[Database Design Diagram](https://app.eraser.io/workspace/WSpKHr0oA2YXewPsdLHG?origin=share)

## API Documentation

### Postman Collection

[![View API Documentation](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/17221325/2sAYBSkYh2)

### Available Endpoints

#### Auth Routes
- `POST /api/v1/auth/register` - Register a new user
  - Body: `{ name, username, email, password, dob, contactNumber }`
  - Returns: User object with token

- `POST /api/v1/auth/verify` - Verify user email
  - Body: `{ verificationCode }`
  - Returns: Success message

- `POST /api/v1/auth/forgot-password` - Initiate forgot password process
  - Body: `{ email }`
  - Returns: Success message

- `POST /api/v1/auth/reset-password` - Reset the user's password
  - Body: `{ resetPasswordCode, password }`
  - Returns: Success message

- `POST /api/v1/auth/login` - Login with credentials
  - Body: `{ email, password }`
  - Returns: User object with token

- `GET /api/v1/auth/google` - Initiate Google OAuth2 authentication
- `GET /api/v1/auth/google/callback` - Google OAuth2 callback

#### User Routes
- `GET /api/v1/user/show-me` - Get current user's details
  - Headers: `Authorization: Bearer <token>`
  - Returns: User profile details

- `POST /api/v1/user/profile-image` - Upload profile image
  - Headers: `Authorization: Bearer <token>`
  - Body: Form data with image file
  - Returns: Updated user object

- `DELETE /api/v1/user/profile-image` - Remove profile image
  - Headers: `Authorization: Bearer <token>`
  - Returns: Success message

- `PATCH /api/v1/user/` - Update user details
  - Headers: `Authorization: Bearer <token>`
  - Body: Updated user fields
  - Returns: Updated user object

- `DELETE /api/v1/user/` - Delete user account
  - Headers: `Authorization: Bearer <token>`
  - Returns: Success message

#### Security Settings
- `GET /api/v1/user/security` - Get security settings
  - Headers: `Authorization: Bearer <token>`
  - Returns: Security settings object

- `PATCH /api/v1/user/security` - Update security settings
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ twoFactorAuth }`
  - Returns: Updated security settings

#### Preferences
- `GET /api/v1/user/preference` - Get preferences
  - Headers: `Authorization: Bearer <token>`
  - Returns: User preferences

- `PATCH /api/v1/user/preference` - Update preferences
  - Headers: `Authorization: Bearer <token>`
  - Body: Updated preference fields
  - Returns: Updated preferences

#### Account Routes
- `GET /api/v1/account` - Get account details
  - Headers: `Authorization: Bearer <token>`
  - Returns: Array of user accounts

- `POST /api/v1/account` - Add new account
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ number, name, bankId }`
  - Returns: Created account object

- `PATCH /api/v1/account/:id` - Update account
  - Headers: `Authorization: Bearer <token>`
  - Params: `id` - Account ID
  - Body: Updated account fields
  - Returns: Updated account object

- `DELETE /api/v1/account/:id` - Delete account
  - Headers: `Authorization: Bearer <token>`
  - Params: `id` - Account ID
  - Returns: Success message

#### Credit Card Routes
- `GET /api/v1/credit-card` - Get credit card details
  - Headers: `Authorization: Bearer <token>`
  - Returns: Array of user credit cards

- `POST /api/v1/credit-card` - Add new credit card
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ number, name, validity, pin }`
  - Returns: Created card object

- `PATCH /api/v1/credit-card/:id` - Update credit card
  - Headers: `Authorization: Bearer <token>`
  - Params: `id` - Card ID
  - Body: Updated card fields
  - Returns: Updated card object

- `DELETE /api/v1/credit-card/:id` - Delete credit card
  - Headers: `Authorization: Bearer <token>`
  - Params: `id` - Card ID
  - Returns: Success message

#### Transaction Routes
- `GET /api/v1/transaction` - Get transaction history
  - Headers: `Authorization: Bearer <token>`
  - Query Params: 
    - `page` (optional) - Page number
    - `limit` (optional) - Items per page
  - Returns: Paginated transaction list

- `POST /api/v1/transaction/transfer/:id` - Transfer amount
  - Headers: `Authorization: Bearer <token>`
  - Params: `id` - Card or Account ID
  - Body: `{ amount, recipient, note, category }`
  - Returns: Transaction details

#### Analytics Routes
- `GET /api/v1/analytics/activity` - Get weekly activity
  - Headers: `Authorization: Bearer <token>`
  - Returns: Weekly activity statistics

- `GET /api/v1/analytics/expense` - Get expense statistics
  - Headers: `Authorization: Bearer <token>`
  - Returns: Expense breakdown by category

- `GET /api/v1/analytics/balance` - Get balance history
  - Headers: `Authorization: Bearer <token>`
  - Returns: Historical balance data

#### Utils Routes
- `GET /api/v1/utils/countries` - Get countries list
  - Returns: Array of countries

- `GET /api/v1/utils/banks` - Get banks list
  - Returns: Array of banks

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Database

The project uses Prisma as the ORM with PostgreSQL. Key models include:

To view the complete schema, check `prisma/schema.prisma` in the project files.

### Database Relationships

- User ↔ Address: One-to-one
- User ↔ Cards: One-to-many
- User ↔ Accounts: One-to-many
- Card ↔ Transactions: One-to-many
- Account ↔ Transactions: One-to-many
- Bank ↔ Accounts: One-to-many
- Country ↔ Addresses: One-to-many

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: JWT, Passport.js (Google OAuth2)
- **Cloud Storage**: Cloudinary
- **Error Handling**: Express-async-errors, custom error handler
- **Rate Limiting**: Express-rate-limit
- **File Upload**: express-fileupload
- **API Documentation**: Custom API endpoints

## Contact

- **Author**: Abhishek Kolge
- **Email**: abhishekkolge96@gmail.com