# Video Upload & Hosting Guide - Skyedge Technologies

## 🎥 How to Upload Your Own Videos (50GB+)

### Recommended Solution: Cloud Storage + CDN

For 50GB of video content, here are your best options:

---

## Option 1: AWS S3 + CloudFront (Best for Large Storage)

### Setup Steps:

1. **Create AWS Account** (aws.amazon.com)
   - Free tier: 5GB storage for 12 months

2. **Create S3 Bucket**
   ```bash
   Bucket name: manojdevopsvideos (YOUR BUCKET)
   Region: us-east-1 (or closest to your users)
   Block all public access: OFF (for testing) or ON (for production with signed URLs)
   ```

3. **Upload Videos**
   - Use AWS Console, CLI, or S3 Browser
   - Organize in folders: `/web-dev/`, `/python/`, `/java/`

4. **Set CORS Policy** (in S3 bucket permissions)
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "HEAD"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": []
     }
   ]
   ```

5. **Get Video URLs**
   ```
   https://manojdevopsvideos.s3.amazonaws.com/web-dev/html-basics.mp4
   https://manojdevopsvideos.s3.us-east-1.amazonaws.com/course-name/video.mp4
   ```

### Pricing Estimate (50GB):
- Storage: ~$1.15/month
- Data transfer: ~$4.50 per 50GB downloaded
- **Total: ~$5-10/month** depending on views

---

## Option 2: Google Cloud Storage (Alternative)

### Setup:
1. Create GCP account (cloud.google.com)
2. Create bucket
3. Upload videos
4. Make public or use signed URLs

### Pricing (50GB):
- Storage: ~$1/month
- Network egress: ~$6/100GB

---

## Option 3: Cloudflare Stream (Best for Pay-Per-Use)

### Features:
- Automatic encoding
- Adaptive bitrate streaming
- Analytics
- No bandwidth charges

### Pricing:
- $5 per 1000 minutes stored
- $1 per 1000 minutes delivered
- For 50GB (~80 hours): **~$24/month + delivery**

Website: https://www.cloudflare.com/products/cloudflare-stream/

---

## Option 4: Vimeo Business (Easiest but Pricier)

### Plans:
- **Vimeo Plus**: $7/month (250GB/year upload, 5GB storage)
- **Vimeo Pro**: $20/month (1TB/year upload, 20GB storage)  
- **Vimeo Business**: $50/month (5TB/year, unlimited storage) ✅ **Best for 50GB**
- **Vimeo Premium**: $75/month (7TB/year)

### Features:
- Privacy controls (password, domain restriction)
- No ads
- Customizable player
- Analytics
- Easy embed codes

Website: https://vimeo.com/upgrade

---

## Option 5: Self-Hosting (Your Own Server)

### Requirements:
- Web server with 50GB+ storage
- Good bandwidth (important!)
- SSL certificate
- Video streaming capability

### Setup with Apache/Nginx:
```nginx
location /videos/ {
    alias /var/www/videos/;
    mp4;
    mp4_buffer_size 1M;
    mp4_max_buffer_size 5M;
}
```

### Pros:
- Full control
- One-time cost

### Cons:
- Bandwidth limitations
- No adaptive streaming by default
- Server maintenance

---

## Implementation in Learning Portal

### Method 1: Direct MP4 Links (Self-hosted or S3)

Update your video cards in `learning.html`:

```html
<div class="video-card">
    <div class="video-thumbnail">
        <div class="play-button">▶</div>
        <img src="/images/thumbnails/html-basics.jpg" alt="HTML Basics">
    </div>
    <div class="video-info">
        <h5>HTML Fundamentals</h5>
        <p>Learn the basics of HTML structure and elements</p>
        <div class="video-meta">
            <span>⏱️ 45 min</span>
            <span class="completed">✓ Completed</span>
        </div>
        <button class="btn btn-small btn-video" 
                data-video-url="https://your-bucket.s3.amazonaws.com/web-dev/html-basics.mp4" 
                data-video-type="mp4">
            Watch Video
        </button>
    </div>
</div>
```

### Method 2: Vimeo Embed

```html
<button class="btn btn-small btn-video" 
        data-video="123456789" 
        data-video-type="vimeo">
    Watch Video
</button>
```

### Method 3: Mixed Sources (YouTube + Your Videos)

```html
<!-- YouTube Video -->
<button class="btn btn-small btn-video" 
        data-video="HcOc7P5BMi4" 
        data-video-type="youtube">
    Watch Video
</button>

<!-- Your Hosted Video -->
<button class="btn btn-small btn-video" 
        data-video-url="https://videos.skyedge.com/course1.mp4" 
        data-video-type="mp4">
    Watch Video
</button>

<!-- Vimeo Video -->
<button class="btn btn-small btn-video" 
        data-video="123456789" 
        data-video-type="vimeo">
    Watch Video
</button>
```

---

## Updated JavaScript (Add to script.js)

I'll create an updated version that supports multiple video sources.

---

## Recommendation for Your 50GB

### **Best Choice: AWS S3 + CloudFront**

1. **Lowest cost**: ~$5-15/month
2. **Scalable**: Pay only for what you use
3. **Fast**: CDN distribution
4. **Reliable**: 99.99% uptime

### Setup Process:
1. Sign up for AWS ✓
2. Create S3 bucket: **manojdevopsvideos** ✓
3. Upload your 50GB of videos (use AWS CLI for bulk upload)
4. Enable CloudFront (optional but recommended)
5. Update `learning.html` with S3 URLs
6. Test video playback

### Your Bucket URLs:
```
https://manojdevopsvideos.s3.amazonaws.com/VIDEO-NAME.mp4
https://manojdevopsvideos.s3.REGION.amazonaws.com/VIDEO-NAME.mp4
```

---

## Video Compression Tips

Before uploading 50GB, consider compressing:

### Use HandBrake (Free):
- Reduce file size by 50-70%
- Maintain good quality
- H.264 codec, MP4 format
- Resolution: 1080p or 720p

### Benefits:
- 50GB → 15-25GB
- Faster loading
- Lower bandwidth costs
- Better user experience

---

## Security Considerations

### For Paid Content:
1. **AWS Signed URLs**: Time-limited access
2. **Vimeo Privacy**: Domain restriction
3. **HLS Encryption**: Encrypted streaming
4. **Token-based Auth**: Verify subscription before serving

---

## Need Help with Setup?

I can create code to:
1. Support multiple video sources (YouTube, S3, Vimeo)
2. Add AWS S3 signed URL generation
3. Implement video upload admin panel
4. Add progress tracking for your hosted videos

Let me know which hosting option you prefer, and I'll update the code accordingly!
