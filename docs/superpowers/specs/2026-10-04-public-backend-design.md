# Public Backend Rebuild Design

**Date:** 2026-10-04  
**Status:** Approved

## Goal

Restore the Sellerpintar article-management application after the company-provided API became unavailable. Deploy the existing Next.js application publicly on Vercel with a persistent backend and database.

## Scope

- Preserve the existing admin and user frontend flows.
- Keep registration for both `Admin` and `User` roles.
- Replace calls to the unavailable external API with same-origin Next.js API routes.
- Persist users, categories, and articles in Neon PostgreSQL.
- Secure the public application before deployment by updating Next.js within its 15.x release line, then running dependency audit, linting, and a production build.

## Architecture

```text
Browser
  └─ Next.js frontend
       └─ Next.js Route Handlers (/api/*)
            └─ Prisma ORM
                 └─ Neon PostgreSQL
```

Vercel hosts the single Next.js application. Neon hosts PostgreSQL. The frontend only calls relative `/api` URLs, so it does not need a separate backend URL or CORS configuration.

## Data Model

### User

- `id`: generated primary key
- `username`: required and unique
- `passwordHash`: required; never return it from API responses
- `role`: `Admin` or `User`
- `createdAt`, `updatedAt`

### Category

- `id`: generated primary key
- `name`: required
- `userId`: required creator reference to `User`
- `createdAt`, `updatedAt`

### Article

- `id`: generated primary key
- `title`: required
- `content`: required rich-text HTML
- `imageUrl`: optional
- `userId`: required author reference to `User`
- `categoryId`: required category reference to `Category`
- `createdAt`, `updatedAt`

The database enforces the user/category/article relationships through foreign keys. Category and article deletion behavior must be explicit: categories cannot be deleted while articles still reference them, and articles are hard-deleted by their owner/admin.

## Authentication and Authorization

- `POST /api/auth/register` accepts username, password, and role.
- `POST /api/auth/login` validates credentials and returns a signed JWT and role.
- The frontend continues to set its existing `token` and `role` cookies, preserving its middleware contract.
- All authenticated requests use `Authorization: Bearer <token>`.
- The JWT contains a user ID and role, has an expiration, and is validated server-side for each protected route.
- Admin-only endpoints: create/update/delete categories and create/update/delete articles.
- Public/user endpoints: list/filter/search article data and view an article detail.
- Profile endpoint returns the authenticated user’s safe fields only.
- Passwords are hashed with bcrypt before persistence.

## API Contract

The replacement preserves the current client-facing contract where possible:

- `GET /api/articles?page&limit&category&title` returns paginated articles with category and author information.
- `GET /api/articles?articleId=<id>` returns a single article.
- `POST /api/articles`, `PUT /api/articles/:id`, and `DELETE /api/articles/:id` manage articles for admins.
- `GET /api/categories?page&limit&search` returns paginated categories.
- `POST /api/categories`, `PUT /api/categories/:id`, and `DELETE /api/categories/:id` manage categories for admins.
- `GET /api/auth/profile` returns the logged-in user profile.

Requests are validated at the API boundary. Invalid data receives a 400 response, missing authentication receives 401, insufficient role/ownership receives 403, missing resources receive 404, and conflicts such as duplicate usernames receive 409.

## Image Uploads

Image upload is deliberately excluded from the initial public rebuild. The original repository states it was not connected to article data, and the UI already has an image fallback. `Article.imageUrl` remains available for a future Cloudinary or Vercel Blob integration.

## Frontend Integration

- Change the current hardcoded external API base URL to relative `/api` calls.
- Preserve the existing pages, forms, pagination, filtering, and route middleware behavior.
- Normalize service errors only as needed for useful existing toast messages; avoid unrelated UI refactoring.

## Configuration and Deployment

Local development uses `.env` and deployment uses Vercel environment variables:

- `DATABASE_URL`: Neon pooled PostgreSQL connection string
- `JWT_SECRET`: long, random signing secret

Commit `.env.example` with variable names only. Never commit real values.

Deployment flow:

1. Create Neon project/database and copy its pooled connection string.
2. Apply Prisma migration against Neon.
3. Add `DATABASE_URL` and `JWT_SECRET` in Vercel Project Settings for Production and Preview.
4. Push the GitHub repository and import it into Vercel.
5. Deploy, verify registration/login, admin CRUD, and public article browsing using the Vercel URL.

## Verification

Before public deployment:

1. Upgrade Next.js to the latest secure compatible 15.x version and align `eslint-config-next`.
2. Run `npm audit` and address production-relevant findings without force upgrades.
3. Run `npm run lint` (or the migrated ESLint command if the version upgrade requires it).
4. Run `npm run build`.
5. Add focused route/data-access tests for authentication, authorization, validation, and article/category CRUD.
6. Manually smoke-test the deployed flow with fresh admin and user registrations.

## Deferred Work

- Image storage/upload integration
- Email verification and password-reset flow
- Role assignment restrictions and admin bootstrap policy
- Rate limiting, audit logs, and observability
- A Next.js 16 migration

These are intentionally deferred because they are not required to restore the recruitment project as a public portfolio demo.
