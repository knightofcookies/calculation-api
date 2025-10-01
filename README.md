# Numerical Calculations API
A secure, role-based REST API for performing numerical calculations, featuring JWT authentication, request/response logging to a database, and an admin-only endpoint for viewing logs.

## Features
- Secure Endpoints: Uses JSON Web Tokens (JWT) for authentication.
- Role-Based Access Control: Differentiates between user and admin roles.
- Users can access calculation endpoints.
- Admins can access a paginated log of all API requests.
- Comprehensive Logging: Every API request and its response is logged to a SQLite database.
- API Documentation: Full OpenAPI (Swagger) specification available for easy testing and integration.
- Complete Test Suite: Includes unit and integration tests using Jest and Supertest.

## Setup and Installation
1. Clone the repository:
```
git clone https://github.com/knightofcookies/calculation-api.git
cd calculation-api
```
2. Install dependencies:
```
npm install
```
3. Create the environment file:
Create a `.env` file in the root of the project and add the following variables.
```
PORT="3579"
SQLITE_DATABASE="users.db"
TEST_SQLITE_DATABASE="test-users.db"
DEFAULT_ADMIN_EMAIL="admin@example.com"
DEFAULT_ADMIN_PASSWORD="adminpassword"
JWT_SECRET="some_secret_key_that_is_long_and_random"
```

## Running the Application
1. Start the server:
This command will start the Express server, connect to the database, and synchronize the models. A default admin user (`admin@example.com` with password `adminpassword`) will be created on the first run.
```
npm start
```
The server will be running at `http://localhost:3579`.

2. Run in development mode:
For development, you can use `nodemon` to automatically restart the server on file changes.
```
npm run dev
```

## API Usage and Endpoints
The full, interactive API documentation is available via Swagger UI. Once the server is running, navigate to:
```
http://localhost:3579/api-docs
```

### Authentication Flow

1. Register a user:
  - `POST /auth/register`
  - Body: `{ "email": "user@example.com", "password": "password123" }`

2. Log in to get a token:
  - `POST /auth/login`
  - Body: `{ "email": "user@example.com", "password": "password123" }`
  - This will return a JWT token.

### Using Protected Endpoints

To access any of the `/calc` or `/admin` endpoints, include the JWT in the Authorization header:
`Authorization: Bearer <your_jwt_token>`

## Testing
### Unit & Integration Tests
The project uses Jest for testing. The test suite will automatically use a separate SQLite database (`test-users.db`) and resets it before running to ensure a clean environment.

To run all tests:
```
npm test
```

### Performance Testing

We use `autocannon` for performance benchmarking.

1. Install autocannon:
```
npm install -g autocannon
```
2. Run the benchmark:
First, get a valid JWT token by logging in. Then, run the command below, replacing `YOUR_JWT_TOKEN` with the actual token.
```
autocannon -c 100 -d 10 -H "Authorization: Bearer YOUR_JWT_TOKEN" 'http://localhost:3579/calc/add?a=10&b=20'
```

### Sample Performance Report

This report shows the results of running the test against the API with logging enabled. The server handles an average of ~1,600 requests per second with an average latency of ~62ms under this load.
```

Running 10s test @ http://localhost:3579/calc/add?a=10&b=20
100 connections


┌─────────┬───────┬───────┬───────┬───────┬──────────┬──────────┬────────┐
│ Stat    │ 2.5%  │ 50%   │ 97.5% │ 99%   │ Avg      │ Stdev    │ Max    │
├─────────┼───────┼───────┼───────┼───────┼──────────┼──────────┼────────┤
│ Latency │ 32 ms │ 69 ms │ 86 ms │ 91 ms │ 62.23 ms │ 17.45 ms │ 125 ms │
└─────────┴───────┴───────┴───────┴───────┴──────────┴──────────┴────────┘
┌───────────┬────────┬────────┬────────┬────────┬──────────┬─────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%    │ 97.5%  │ Avg      │ Stdev   │ Min    │
├───────────┼────────┼────────┼────────┼────────┼──────────┼─────────┼────────┤
│ Req/Sec   │ 1,353  │ 1,353  │ 1,602  │ 1,764  │ 1,589.37 │ 104.3   │ 1,353  │
├───────────┼────────┼────────┼────────┼────────┼──────────┼─────────┼────────┤
│ Bytes/Sec │ 334 kB │ 334 kB │ 396 kB │ 436 kB │ 393 kB   │ 25.7 kB │ 334 kB │
└───────────┴────────┴────────┴────────┴────────┴──────────┴─────────┴────────┘

Req/Bytes counts sampled once per second.
# of samples: 11

18k requests in 11.02s, 4.32 MB read
```
