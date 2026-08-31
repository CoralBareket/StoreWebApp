# Store Web App

A simple store management application for managing furniture products.
The project includes an ASP.NET Core Web API backend, Angular client,
MS SQL database and JWT authentication.

## Project Structure

```text
StoreWebApp/
├── StoreApp/                  # Angular client
├── StoreWebApi/               # ASP.NET Core Web API
│   └── Scripts/
│       ├── database.sql       # Database creation script
│       └── seed-data.sql      # Sample data
└── README.md

## Prerequisites

Before running the project, make sure the following are installed:

- .NET SDK
- Node.js
- Angular CLI
- MS SQL Server

## Database Setup

The repository includes SQL scripts for creating the required database tables and inserting sample data.

Run the provided SQL scripts against your SQL Server database before starting the application.

The seed data is safe to run more than once and includes sample furniture products.

## Backend Setup

Navigate to the backend project:

```bash
cd StoreWebApi
```

Configure the database connection string using .NET User Secrets:

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "YOUR_CONNECTION_STRING"
```

Configure the JWT secret key:

```bash
dotnet user-secrets set "Jwt:Key" "YOUR_JWT_SECRET_KEY"
```

Restore the dependencies:

```bash
dotnet restore
```

Run the backend:

```bash
dotnet run
```

The API URL will be displayed in the terminal.

Swagger can be used to view and test the available API endpoints.

## Client Setup

Navigate to the Angular project:

```bash
cd StoreApp
```

Install the dependencies:

```bash
npm install
```

Run the Angular application:

```bash
ng serve
```

Open the application in the browser: http://localhost:4200

## Authentication

The application supports:

- User registration
- User login
- JWT authentication
- Product operations

## Product Management

Authenticated users can:

- View all products
- Search products by name or category
- Create a new product
- Update an existing product

Products belong to one of the predefined furniture categories:

- Sofa
- Chair
- Table
- Bed
- Storage

## Validation

Validation is implemented on both the client and server.

Examples include:
- Username is required
- Password must be at least 6 characters
- Product name is required
- Product category must be one of the supported categories
- Price cannot be negative
- Units in stock cannot be negative

## Notes

Sensitive information such as database credentials and JWT secret keys is not committed to the repository.

These values should be configured locally using .NET User Secrets.
