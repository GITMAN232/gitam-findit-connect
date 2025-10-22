# Admin Portal Setup Guide

## 🚀 Quick Start

Your Lost & Found platform now has a complete admin system! Follow these steps to get started:

### 1. Create Your First Admin User

**Option A: Via Admin Setup Page (Easiest)**
1. Login to your account
2. Visit: `/admin-setup`
3. Your user ID will be pre-filled
4. Click "Create Admin User"

**Option B: Via Supabase SQL**
1. Go to your Supabase SQL Editor
2. Run this query with your user ID:
```sql
INSERT INTO user_roles (user_id, role) 
VALUES ('your-user-id-here', 'admin');
```

To find your user ID:
- Check the Supabase Dashboard → Authentication → Users
- Or check your browser console when logged in

### 2. Access the Admin Portal

Once you have admin access:
- Navigate to `/admin` or click the "Admin" link in the navbar
- You'll see the Admin Shield icon in the navigation

## 📋 Admin Portal Features

### Dashboard (`/admin`)
- Overview statistics
- Pending submissions count
- Live items count
- Claims pending review
- Items resolved today

### Pending Submissions (`/admin/pending`)
- Review new lost/found item submissions
- Approve or reject items
- Add admin notes
- Filter by type (lost/found)

### Live Items (`/admin/live`)
- View all approved listings
- Mark items as resolved
- Archive completed cases

### Claims Management (`/admin/claims`)
- Review ownership claims
- View uploaded evidence (photos, PDFs, invoices)
- Read claimant explanations
- Approve or reject claims with notes

### Activity Logs (`/admin/activity`)
- Track all admin actions
- View approval/rejection history
- Monitor system activity

### Users Management (`/admin/users`)
- Grant or revoke admin access
- Manage user roles

## 🔔 Features for Regular Users

### Claim System
- **"Claim This Item" button** appears on found items for logged-in users
- Users can upload evidence (images/PDFs up to 5MB each)
- Provide explanation of ownership
- Get notified when claim is approved/rejected

### Notifications
- **Notification bell** in navbar shows unread count
- Real-time notifications for:
  - Submission approved
  - Submission rejected
  - Claim approved
  - Claim rejected

### Approval Workflow
- New submissions default to "pending" status
- Only approved items appear in public listings
- Users see status badges in "My Reports"
- Automatic redirect to My Reports after submission

## 🔐 Security Features

All security policies are in place:
- ✅ Admin role system with secure RLS
- ✅ Claims require authentication
- ✅ Evidence storage with user-specific folders
- ✅ Activity logging for all admin actions
- ✅ Notifications with proper access control

## 🎯 Status Values

Items can have these statuses:
- `pending` - Awaiting admin review
- `approved` - Live on the platform
- `rejected` - Not approved by admin
- `claimed` - Someone has claimed the item
- `resolved` - Case closed/item returned

## 📝 Testing the System

1. **Create a test submission** (as regular user)
   - Report a lost or found item
   - Check "My Reports" - should show "pending"

2. **Review as admin**
   - Go to Admin Portal → Pending Submissions
   - Approve the item
   - Check that it now appears in public listings

3. **Test claim flow**
   - As a different user, view a found item
   - Click "Claim This Item"
   - Upload evidence and explanation
   - As admin, review in Claims Management

4. **Check notifications**
   - Bell icon shows unread count
   - Click to see notification details
   - Mark as read

## 🚧 First-Time Setup Checklist

- [ ] Create first admin user
- [ ] Test submitting an item
- [ ] Approve a submission as admin
- [ ] Test claiming an item
- [ ] Review claim as admin
- [ ] Check notifications work
- [ ] Configure email notifications (optional - requires Resend)

## 📧 Optional: Email Notifications

To enable email notifications:
1. Sign up at [Resend.com](https://resend.com)
2. Verify your domain
3. Create an API key
4. Add `RESEND_API_KEY` as a Supabase Edge Function secret
5. Update the edge function to send emails

## 🆘 Troubleshooting

**"Access Denied" when visiting /admin**
- Verify your user has the admin role in `user_roles` table
- Check that the RLS policies are active

**Items not showing in listings**
- Items must be "approved" status to show publicly
- Check the admin portal to approve pending items

**Claims not working**
- User must be logged in to claim items
- Check storage policies for claim-evidence bucket

**Notifications not appearing**
- Check browser console for errors
- Verify RLS policies on notifications table
- Real-time subscriptions require proper Supabase connection

## 📚 Database Tables

### Core Tables
- `user_roles` - Admin permissions
- `lost_objects` - Lost items (full details)
- `found_objects` - Found items (full details)
- `claims` - Ownership claims with evidence
- `notifications` - User notifications
- `activity_logs` - Admin action tracking

### Public Views
- `public_lost_objects` - Approved lost items (no contact info)
- `public_found_objects` - Approved found items (no contact info)

## 🎨 Customization

### Colors
The admin portal uses your existing theme:
- Maroon for primary actions
- Blue for informational badges
- Green for approved status
- Red for rejected/destructive actions

### Adding More Admin Features
Extend the admin portal by:
1. Add new pages in `src/pages/admin/`
2. Add routes in `src/App.tsx`
3. Add menu items in `src/components/admin/AdminSidebar.tsx`

---

**Need Help?** Check the Supabase logs or browser console for detailed error messages.
