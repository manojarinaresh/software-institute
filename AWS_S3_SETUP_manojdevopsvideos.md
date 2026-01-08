# AWS S3 Setup Guide - manojdevopsvideos

## Your Bucket: `manojdevopsvideos`

---

## 🚀 Quick Setup (For Testing)

### Step 1: Make Bucket Public (Testing Only)

1. Go to **AWS S3 Console** → Select `manojdevopsvideos`
2. Click **Permissions** tab
3. **Block Public Access**:
   - Click "Edit"
   - ❌ Uncheck "Block all public access"
   - ✅ Save changes
   - Type "confirm"

### Step 2: Add Bucket Policy

In **Permissions** → **Bucket Policy**, paste:

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

Click **Save changes**

### Step 3: Add CORS Configuration

In **Permissions** → **CORS**, paste:

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

Click **Save changes**

---

## 📤 Upload Your Videos

### Method 1: AWS Console (Small Files)

1. Click **Upload** button
2. Add files or drag & drop
3. Click **Upload**

### Method 2: AWS CLI (Bulk Upload - Recommended for 50GB)

#### Install AWS CLI:
```bash
# Windows (PowerShell)
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi

# Verify installation
aws --version
```

#### Configure AWS CLI:
```bash
aws configure
# Enter:
# AWS Access Key ID: [Your key]
# AWS Secret Access Key: [Your secret]
# Default region: us-east-1 (or your region)
# Default output format: json
```

#### Upload Commands:

```bash
# Upload single file
aws s3 cp my-video.mp4 s3://manojdevopsvideos/

# Upload with public-read permission
aws s3 cp my-video.mp4 s3://manojdevopsvideos/ --acl public-read

# Upload entire folder (preserves structure)
aws s3 sync C:\path\to\videos s3://manojdevopsvideos/courses/

# Upload folder with public access
aws s3 sync C:\path\to\videos s3://manojdevopsvideos/courses/ --acl public-read

# Example: Upload web development videos
aws s3 sync "C:\Videos\WebDev" s3://manojdevopsvideos/web-dev/ --acl public-read
```

---

## 🔗 Your Video URLs

After uploading, your videos will be accessible at:

### Format 1 (Virtual-hosted style):
```
https://manojdevopsvideos.s3.amazonaws.com/VIDEO-NAME.mp4
```

### Format 2 (With region):
```
https://manojdevopsvideos.s3.REGION.amazonaws.com/VIDEO-NAME.mp4
```

### Examples:
```
https://manojdevopsvideos.s3.amazonaws.com/intro-course.mp4
https://manojdevopsvideos.s3.amazonaws.com/web-dev/html-basics.mp4
https://manojdevopsvideos.s3.amazonaws.com/python/python-intro.mp4
```

---

## 🎓 Add Videos to Learning Portal

### Update learning.html:

```html
<div class="video-card">
    <div class="video-thumbnail">
        <div class="play-button">▶</div>
        <img src="images/thumbnails/your-thumbnail.jpg" alt="Course">
    </div>
    <div class="video-info">
        <h5>Your Course Title</h5>
        <p>Course description</p>
        <div class="video-meta">
            <span>⏱️ 60 min</span>
            <span class="not-started">○ Not Started</span>
        </div>
        <button class="btn btn-small btn-video" 
                data-video-url="https://manojdevopsvideos.s3.amazonaws.com/your-video.mp4" 
                data-video-type="mp4">
            Watch Video
        </button>
    </div>
</div>
```

---

## 🧪 Test Your Setup

1. **Upload a test video:**
   ```bash
   aws s3 cp test.mp4 s3://manojdevopsvideos/test.mp4 --acl public-read
   ```

2. **Access in browser:**
   ```
   https://manojdevopsvideos.s3.amazonaws.com/test.mp4
   ```

3. **Add to learning portal:**
   ```html
   <button class="btn btn-small btn-video" 
           data-video-url="https://manojdevopsvideos.s3.amazonaws.com/test.mp4" 
           data-video-type="mp4">
       Test Video
   </button>
   ```

---

## 📁 Recommended Folder Structure

```
manojdevopsvideos/
├── web-dev/
│   ├── html-basics.mp4
│   ├── css-advanced.mp4
│   └── javascript-intro.mp4
├── python/
│   ├── python-fundamentals.mp4
│   ├── data-science.mp4
│   └── django-course.mp4
├── devops/
│   ├── docker-basics.mp4
│   ├── kubernetes.mp4
│   └── ci-cd.mp4
└── thumbnails/
    ├── html-basics.jpg
    ├── css-advanced.jpg
    └── javascript-intro.jpg
```

---

## 🔒 Security for Production (Later)

Once you're ready to protect your content:

### 1. Make Bucket Private Again
- Turn ON "Block all public access"
- Remove the public bucket policy

### 2. Use Signed URLs (Server-side)
- Generate temporary URLs (valid for 1 hour)
- Check subscription before generating
- URLs expire automatically

### 3. Example with Node.js:
```javascript
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

function getSignedUrl(videoKey) {
  return s3.getSignedUrl('getObject', {
    Bucket: 'manojdevopsvideos',
    Key: videoKey,
    Expires: 3600 // 1 hour
  });
}
```

---

## 💰 Cost Estimate

For your 50GB bucket:

**Storage:** $0.023 per GB = **$1.15/month**

**Data Transfer (out to internet):**
- First 1GB: Free
- Next 9.999TB: $0.09 per GB
- 50GB downloads = **$4.50**

**Total:** ~$6-10/month depending on views

---

## ⚡ Performance Tips

### Enable CloudFront CDN (Optional):

1. Go to **CloudFront** in AWS Console
2. Create Distribution
3. Origin Domain: `manojdevopsvideos.s3.amazonaws.com`
4. Wait 15-20 minutes for deployment

**Benefits:**
- Faster video loading
- Lower S3 data transfer costs
- Better user experience worldwide

**Your CloudFront URL:**
```
https://XXXXX.cloudfront.net/video.mp4
```

---

## 🛠️ Troubleshooting

### Video not playing?
1. Check CORS is configured
2. Verify file is publicly accessible (try URL in browser)
3. Check file format (MP4 with H.264 codec works best)

### Access Denied error?
1. Ensure bucket policy is applied
2. Check "Block Public Access" is OFF
3. Verify ACL is set to public-read

### Slow loading?
1. Enable CloudFront CDN
2. Compress videos (use HandBrake)
3. Choose region closest to users

---

## ✅ Ready to Go!

Your setup commands:
```bash
# 1. Upload your videos
aws s3 sync C:\path\to\your\videos s3://manojdevopsvideos/courses/ --acl public-read

# 2. List uploaded files
aws s3 ls s3://manojdevopsvideos/ --recursive

# 3. Your video URL format
https://manojdevopsvideos.s3.amazonaws.com/courses/VIDEO-NAME.mp4
```

Start uploading and update `learning.html` with your video URLs! 🚀
