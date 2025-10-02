# Database Migration Guide for Vercel Deployment

This guide helps you migrate from SQLite to a cloud database for production deployment on Vercel.

## Why Migrate?

SQLite isn't ideal for Vercel because:
- Vercel's serverless functions have read-only filesystems
- Data stored in `/tmp` is temporary and lost between deployments
- No data persistence across function invocations

## Recommended Database Solutions

### 1. Vercel Postgres (Recommended)

**Setup:**
1. Go to your Vercel dashboard
2. Select your project
3. Go to Storage tab
4. Create a new Postgres database
5. Copy the connection details

**Environment Variables:**
```bash
POSTGRES_URL="postgres://username:password@host:port/database"
```

### 2. Supabase (Free tier available)

**Setup:**
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > Database
4. Copy connection string

**Environment Variables:**
```bash
DATABASE_URL="postgresql://username:password@host:port/database"
```

### 3. PlanetScale (MySQL-compatible)

**Setup:**
1. Create account at [planetscale.com](https://planetscale.com)
2. Create new database
3. Create branch and get connection details

**Environment Variables:**
```bash
DATABASE_URL="mysql://username:password@host:port/database"
```

## Code Changes Required

After setting up your cloud database, you'll need to:

1. **Install database driver:**
```bash
# For PostgreSQL
npm install pg

# For MySQL
npm install mysql2
```

2. **Update database connection:**
Replace SQLite code with cloud database connection.

3. **Update schema:**
Convert SQLite schema to your chosen database format.

## Migration Steps

1. Export existing SQLite data (if any)
2. Set up cloud database
3. Update environment variables
4. Modify database connection code
5. Test locally
6. Deploy to Vercel

## Need Help?

Contact your development team or refer to:
- [Vercel Database Documentation](https://vercel.com/docs/storage)
- [Next.js Database Examples](https://github.com/vercel/next.js/tree/canary/examples)