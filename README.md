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
git clone https://github.com/yourusername/soar-server.git
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

### 6. Seed the database (Optional)

```bash
pnpm run seed
```

## API Documentation

### Auth Routes
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/verify` - Verify user email
- `POST /api/v1/auth/forgot-password` - Initiate forgot password process
- `POST /api/v1/auth/reset-password` - Reset the user's password
- `POST /api/v1/auth/login` - Login with credentials
- `GET /api/v1/auth/google` - Initiate Google OAuth2 authentication
- `GET /api/v1/auth/google/callback` - Google OAuth2 callback

### User Routes
- `GET /api/v1/user/show-me` - Get current user's details
- `POST /api/v1/user/profile-image` - Upload profile image
- `DELETE /api/v1/user/profile-image` - Remove profile image
- `PATCH /api/v1/user/` - Update user details
- `DELETE /api/v1/user/` - Delete user account
- `GET /api/v1/user/security` - Get security settings
- `PATCH /api/v1/user/security` - Update security settings
- `GET /api/v1/user/preference` - Get preferences
- `PATCH /api/v1/user/preference` - Update preferences

### Account Routes
- `GET /api/v1/account` - Get account details
- `POST /api/v1/account` - Add new account
- `PATCH /api/v1/account/:id` - Update account
- `DELETE /api/v1/account/:id` - Delete account

### Credit Card Routes
- `GET /api/v1/credit-card` - Get credit card details
- `POST /api/v1/credit-card` - Add new credit card
- `PATCH /api/v1/credit-card/:id` - Update credit card
- `DELETE /api/v1/credit-card/:id` - Delete credit card

### Transaction Routes
- `GET /api/v1/transaction` - Get transaction history
- `POST /api/v1/transaction/transfer/:id` - Transfer amount

### Analytics Routes
- `GET /api/v1/analytics/activity` - Get weekly activity
- `GET /api/v1/analytics/expense` - Get expense statistics
- `GET /api/v1/analytics/balance` - Get balance history

### Utils Routes
- `GET /api/v1/utils/countries` - Get countries list
- `GET /api/v1/utils/banks` - Get banks list

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