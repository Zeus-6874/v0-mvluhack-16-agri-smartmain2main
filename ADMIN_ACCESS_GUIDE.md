# Admin Access Guide

## How to Access Admin Dashboard

### Step 1: Navigate to Admin Login
Go to the admin login page at: `https://your-domain.com/admin/login`

### Step 2: Login Credentials
Use the following credentials:
- **Email**: `admin@agrismart.com`
- **Password**: `Admin@123456`

### Step 3: Admin Dashboard Features
After logging in, you'll have access to:
- **Overview**: System statistics and quick actions
- **Farmers Management**: Add, view, and manage farmer data
- **Crops Management**: Add and update encyclopedia crop information
- **Disease Reports**: View all disease detection reports
- **Market Data**: Update market prices and commodity information
- **Data Export**: Export data as CSV files

### Security Notes
1. Change the default admin password after first login
2. Admin access is restricted to users with `is_admin: true` in the database
3. All admin actions are logged

### Creating Additional Admin Users
To make another user an admin:
1. Sign up the user normally through the regular signup page
2. In MongoDB, update their user document:
   \`\`\`javascript
   db.users.updateOne(
     { email: "newadmin@example.com" },
     { $set: { is_admin: true } }
   )
   \`\`\`

### Environment Variables
The admin credentials are stored in `.env.local`:
\`\`\`
ADMIN_EMAIL=admin@agrismart.com
ADMIN_PASSWORD=Admin@123456
\`\`\`

Change these in production for security.
