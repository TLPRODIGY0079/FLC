# Photo Upload Setup Guide

## Issue: Photos Not Displaying

If photos are uploading but not showing in the dashboard, you need to set up Supabase Storage properly.

## Quick Fix (5 minutes)

### Step 1: Create Storage Bucket

1. **Go to Supabase Dashboard:**
   - Navigate to: https://ornqdhmxzitnfhwqrhxq.supabase.co
   - Click on "Storage" in the left sidebar

2. **Create New Bucket:**
   - Click "New bucket"
   - **Name:** `ministry-photos`
   - **Public bucket:** ✅ Check this box (important!)
   - Click "Create bucket"

### Step 2: Set Bucket Permissions

1. **In the Storage section:**
   - Click on the `ministry-photos` bucket
   - Click on "Policies" tab
   - Click "New policy"

2. **Create Upload Policy:**
   - Click "Create a policy from scratch"
   - **Policy name:** `Enable upload for authenticated users`
   - **Allowed operation:** INSERT
   - **Target roles:** authenticated
   - **Policy definition:**
   ```sql
   (bucket_id = 'ministry-photos'::text)
   ```
   - Click "Review" then "Save policy"

3. **Create View Policy:**
   - Click "New policy" again
   - **Policy name:** `Enable public viewing`
   - **Allowed operation:** SELECT
   - **Target roles:** public, authenticated
   - **Policy definition:**
   ```sql
   (bucket_id = 'ministry-photos'::text)
   ```
   - Click "Review" then "Save policy"

### Step 3: Test Photo Upload

1. Start your app: `npm run dev`
2. Go to "Submit Report" page
3. Click "Click to upload photos"
4. Select images from your device
5. Fill in the form and click "Submit Report"
6. Go to Dashboard
7. Photos should now be visible! 🎉

## Alternative: SQL Script Method

If you prefer SQL, run this in the Supabase SQL Editor:

```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('ministry-photos', 'ministry-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for authenticated users to upload
CREATE POLICY "Enable upload for authenticated users"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'ministry-photos');

-- Create policy for public viewing
CREATE POLICY "Enable public viewing"
ON storage.objects FOR SELECT
TO public, authenticated
USING (bucket_id = 'ministry-photos');
```

## Verify Setup

### Check if bucket exists:
1. Go to Storage in Supabase Dashboard
2. You should see `ministry-photos` bucket
3. The bucket should show a 🌍 icon (indicates public)

### Check if photos are uploading:
1. Submit a test report with photos
2. Go to Storage → ministry-photos
3. You should see uploaded files in the `reports/` folder

### Check if photos are displaying:
1. Go to Dashboard
2. Recent Ministry Reports section should show actual photos
3. Recent Activity should show submitted reports with details

## Troubleshooting

### Photos upload but don't display:
**Issue:** Bucket is not public
**Fix:** Make bucket public in Storage settings

### "Error uploading photo":
**Issue:** No storage policies set
**Fix:** Add the INSERT policy for authenticated users

### Photos show as broken images:
**Issue:** Incorrect public URL format
**Fix:** Ensure bucket is public and check the `getPublicUrl()` call

### "Bucket not found" error:
**Issue:** Bucket name mismatch
**Fix:** Ensure bucket name is exactly `ministry-photos` (no spaces)

## What Changed in the Code

### 1. SummaryCards.jsx
- Now fetches real data from `reports` table
- Shows **0** when no reports exist (instead of hardcoded "45")
- Dynamically calculates totals:
  - Souls Won (sum of all `souls_won`)
  - Members Visited (sum of all `members_visited`)
  - Calls Made (sum of all `calls_made`)
  - Fellowships Held (count of `activity_type = 'fellowship'`)

### 2. RecentActivity.jsx
- Now fetches real submitted reports
- Shows actual leader names from profiles
- Displays real activity details (souls won, members visited, calls made)
- Shows location and time ago (e.g., "2 hours ago")
- Shows "No recent activities" when empty

### 3. Dashboard.jsx
- Photos now display properly when bucket is set up
- Shows actual uploaded photos from reports
- Falls back to placeholder icon if no photo

## Expected Behavior

### Before Submission:
- **Souls Won:** 0
- **Members Visited:** 0
- **Calls Made:** 0
- **Fellowships Held:** 0
- **Recent Activity:** "No recent activities"

### After Submitting Report:
- **Stats cards:** Update with submitted numbers
- **Recent Activity:** Shows the new submission with:
  - Leader name
  - Activity type badge
  - Statistics (e.g., "3 Souls Won - 5 Members Visited")
  - Location
  - Time ago
- **Ministry Reports:** Shows uploaded photos

## Success Checklist

- [ ] Storage bucket `ministry-photos` created
- [ ] Bucket is set to public
- [ ] Upload policy created for authenticated users
- [ ] View policy created for public access
- [ ] Test report submitted successfully
- [ ] Photos visible in Dashboard
- [ ] Stats cards show correct numbers (0 or actual count)
- [ ] Recent Activity shows submitted reports

**Status: Ready to Use! 📸**

Need help? The photos are stored in:
`Storage → ministry-photos → reports/`
