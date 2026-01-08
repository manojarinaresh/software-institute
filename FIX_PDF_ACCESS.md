# FIX: Cannot Access PDF from S3

## Problem: Access Denied / PDF Won't Load

Your PDF at `https://manojdevopsvideos.s3.amazonaws.com/linux.pdf` is not accessible because the bucket or file doesn't have public access.

---

## 🔧 SOLUTION: Make Your PDF Publicly Accessible

### Method 1: AWS Console (Easiest)

#### Step 1: Unblock Public Access (Bucket Level)
1. Go to **AWS S3 Console**: https://s3.console.aws.amazon.com/s3/
2. Click on bucket: **manojdevopsvideos**
3. Go to **Permissions** tab
4. Find **Block public access (bucket settings)**
5. Click **Edit**
6. **Uncheck** "Block all public access"
7. Click **Save changes**
8. Type **confirm** and submit

#### Step 2: Add Bucket Policy
1. Still in **Permissions** tab
2. Scroll to **Bucket policy**
3. Click **Edit**
4. Paste this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::manojdevopsvideos/*"
    }
  ]
}
```

5. Click **Save changes**

#### Step 3: Make Individual File Public (Alternative)
If you don't want to make entire bucket public:

1. Go to **Objects** tab in your bucket
2. Find **linux.pdf**
3. Check the checkbox next to it
4. Click **Actions** → **Make public using ACL**
5. Click **Make public**

#### Step 4: Add CORS (for viewing in iframe)
1. Go to **Permissions** tab
2. Scroll to **Cross-origin resource sharing (CORS)**
3. Click **Edit**
4. Paste this:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": [],
    "MaxAgeSeconds": 3000
  }
]
```

5. Click **Save changes**

---

### Method 2: AWS CLI (Faster)

```bash
# Make the specific file public
aws s3api put-object-acl --bucket manojdevopsvideos --key linux.pdf --acl public-read

# Or re-upload with public access
aws s3 cp linux.pdf s3://manojdevopsvideos/linux.pdf --acl public-read

# Verify the file is accessible
curl -I https://manojdevopsvideos.s3.amazonaws.com/linux.pdf
```

---

## 🧪 Test Your PDF Access

### Test 1: Direct Browser Access
Open this URL in your browser:
```
https://manojdevopsvideos.s3.amazonaws.com/linux.pdf
```

**Expected Result:** PDF should display or download

**If you see "Access Denied":**
- File permissions are not set correctly
- Follow Method 1 above

### Test 2: Check with cURL
```bash
curl -I https://manojdevopsvideos.s3.amazonaws.com/linux.pdf
```

**Expected Result:**
```
HTTP/2 200
content-type: application/pdf
```

**If you see 403 Forbidden:**
- Bucket policy is missing
- Follow Step 2 above

---

## 📍 Find Your Correct S3 Region

Your URL might need the region:

```bash
# List your buckets and regions
aws s3api list-buckets --query "Buckets[?Name=='manojdevopsvideos'].[Name, Region]"
```

If your bucket is in a specific region (e.g., `us-west-2`), use:
```
https://manojdevopsvideos.s3.us-west-2.amazonaws.com/linux.pdf
```

---

## 🔍 Check Current Bucket Status

### Via AWS Console:
1. Go to bucket: **manojdevopsvideos**
2. Click on **linux.pdf**
3. Look at **Object URL** in the details
4. Copy that exact URL

### Via AWS CLI:
```bash
# Check if file exists
aws s3 ls s3://manojdevopsvideos/linux.pdf

# Get object details
aws s3api head-object --bucket manojdevopsvideos --key linux.pdf

# Check bucket location
aws s3api get-bucket-location --bucket manojdevopsvideos
```

---

## 🎯 Quick Fix Commands (Run These)

```bash
# 1. Configure AWS CLI (if not done)
aws configure

# 2. Make linux.pdf public
aws s3api put-object-acl --bucket manojdevopsvideos --key linux.pdf --acl public-read

# 3. Verify it works
curl https://manojdevopsvideos.s3.amazonaws.com/linux.pdf --output test.pdf

# If file downloaded successfully, it's working!
```

---

## Alternative: Use Presigned URLs (Temporary Access)

If you don't want to make files public permanently, generate temporary URLs:

```bash
# Generate a URL valid for 1 hour
aws s3 presign s3://manojdevopsvideos/linux.pdf --expires-in 3600
```

This gives you a temporary URL like:
```
https://manojdevopsvideos.s3.amazonaws.com/linux.pdf?X-Amz-Algorithm=...&X-Amz-Expires=3600...
```

---

## 🚨 Common Errors & Solutions

### Error: "Access Denied"
**Cause:** File doesn't have public-read permission
**Fix:** Run `aws s3api put-object-acl --bucket manojdevopsvideos --key linux.pdf --acl public-read`

### Error: "NoSuchKey"
**Cause:** File doesn't exist at that path
**Fix:** Check file name and path with `aws s3 ls s3://manojdevopsvideos/`

### Error: "AllAccessDisabled"
**Cause:** Bucket has "Block all public access" enabled
**Fix:** Unblock public access in bucket settings

### PDF Opens in Browser but Modal Won't Work
**Cause:** CORS not configured
**Fix:** Add CORS configuration (see Step 4 above)

---

## ✅ After Fixing, Test in Your Portal

1. Open: http://localhost:8080/learning.html (or your URL)
2. Find the Linux PDF card
3. Click **"View PDF"** → Should open in modal
4. Click **"Open Direct"** → Should open in new tab

---

## 💡 Pro Tip: Organize Your Files

```bash
# Create folder structure
aws s3api put-object --bucket manojdevopsvideos --key pdfs/guides/
aws s3api put-object --bucket manojdevopsvideos --key pdfs/cheatsheets/

# Move linux.pdf to organized location
aws s3 mv s3://manojdevopsvideos/linux.pdf s3://manojdevopsvideos/pdfs/guides/linux.pdf --acl public-read

# Update URL in learning.html to:
# https://manojdevopsvideos.s3.amazonaws.com/pdfs/guides/linux.pdf
```

---

## Need More Help?

Run these commands and share the output:

```bash
# 1. Check if file exists
aws s3 ls s3://manojdevopsvideos/ --recursive | grep linux.pdf

# 2. Get bucket location
aws s3api get-bucket-location --bucket manojdevopsvideos

# 3. Try to access
curl -I https://manojdevopsvideos.s3.amazonaws.com/linux.pdf
```

Once you see **HTTP 200 OK**, your PDF will work!
