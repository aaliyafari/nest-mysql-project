# 🪑 WORKSPACE SMART BOOKING

A NestJS + TypeORM REST API for managing shared workspaces in multiple locations.

---

## ⚙️ Features

- Full CRUD for booking shared work desks
- Relation with Location entity
- Swagger API documentation
- TypeORM migrations and seeders
- DTO validation with `class-validator`
- MySQL support (or any TypeORM-compatible DB)

---

## 📦 Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **ORM:** [TypeORM](https://typeorm.io/)
- **DB:** MySQL
- **Docs:** Swagger (via `@nestjs/swagger`)
- **Validation:** class-validator

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/desk-management-api.git
cd desk-management-api
```

### 2. Install dependencies
```bash
npm install
```
###  3. create .env in the root
``` bash
PORT=3000
JWT_SECRET=your_secret_key
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_DATABASE=your_mysql_name
```
### 4. Run migrations and seeders
``` bash
npm run migration:run
npm run seed:dev
```

### 5. Start the server
``` bash
npm run start:dev
```

### 6. Api Documentation
```
http://localhost:3000/api
```
