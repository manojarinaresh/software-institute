# How to Add Premium Videos to Paid Tutorials Folder

## 📁 Location
Premium paid videos are located in: `learning.html` (Lines ~170-320)

Look for the section: **"PAID VIDEO TUTORIALS FOLDER"**

---

## 🎥 Adding Your YouTube Videos

### Step 1: Get Your YouTube Video ID
1. Go to your YouTube video
2. Copy the video ID from the URL
   - Example: `https://youtube.com/watch?v=ABC123XYZ456`
   - Video ID is: `ABC123XYZ456`

### Step 2: Replace Placeholder IDs in learning.html

Find and replace these placeholders with your actual video IDs:

| Placeholder | Video Title | Line # (approx) |
|------------|-------------|-----------------|
| `YOUR_VIDEO_ID_1` | Advanced AWS Deployment | ~190 |
| `YOUR_VIDEO_ID_2` | Docker & Kubernetes Mastery | ~210 |
| `YOUR_VIDEO_ID_3` | CI/CD Pipeline Setup | ~230 |
| `YOUR_VIDEO_ID_4` | Terraform & Infrastructure as Code | ~250 |
| `YOUR_VIDEO_ID_5` | DevOps Security Best Practices | ~270 |

### Example:
**Before:**
```html
<button class="btn btn-small btn-video" 
        data-video="YOUR_VIDEO_ID_1" 
        data-video-type="youtube">
    Watch Video
</button>
```

**After:**
```html
<button class="btn btn-small btn-video" 
        data-video="ABC123XYZ456" 
        data-video-type="youtube">
    Watch Video
</button>
```

---

## ➕ Adding More Videos (Beyond 5)

### Template for New Video Card:
```html
<!-- ========== PREMIUM VIDEO 6 ========== -->
<div class="video-card">
    <div class="video-thumbnail">
        <div class="play-button">▶</div>
        <div class="resource-icon" style="font-size: 60px; padding: 40px;">🎥</div>
        <span style="position: absolute; top: 10px; right: 10px; background: #f5576c; color: white; padding: 5px 10px; border-radius: 5px; font-size: 12px;">Premium</span>
    </div>
    <div class="video-info">
        <h5>🚀 Your Video Title Here</h5>
        <p>Your video description here</p>
        <div class="video-meta">
            <span>⏱️ Full Tutorial</span>
            <span class="not-started">○ Not Started</span>
        </div>
        <button class="btn btn-small btn-video" 
                data-video="YOUR_YOUTUBE_VIDEO_ID" 
                data-video-type="youtube">
            Watch Video
        </button>
    </div>
</div>
```

### Steps to Add:
1. Copy the template above
2. Paste it in `learning.html` at the section: **"ADD MORE VIDEOS HERE"** (around line 295)
3. Update:
   - Video title (e.g., `Monitoring with Prometheus`)
   - Description (e.g., `Infrastructure monitoring and alerting`)
   - `YOUR_YOUTUBE_VIDEO_ID` with actual ID
4. Update video count in the header:
   ```html
   <span style="color: white;">🔐 Premium Videos: 6</span>
   ```

---

## 📝 Current Video Structure

### Free Videos (Always Accessible):
1. **DevOps Demo 1** - `WWSwcmwQhRI`
2. **Git Session 1** - `QpXXR-tmPos`

### Premium Videos (Subscription Required):
1. **Advanced AWS Services** - `YOUR_VIDEO_ID_1` ⬅️ Replace this
2. **Docker & Kubernetes Mastery** - `YOUR_VIDEO_ID_2` ⬅️ Replace this
3. **CI/CD Pipeline Setup** - `YOUR_VIDEO_ID_3` ⬅️ Replace this
4. **Terraform & Infrastructure as Code** - `YOUR_VIDEO_ID_4` ⬅️ Replace this
5. **DevOps Security Best Practices** - `YOUR_VIDEO_ID_5` ⬅️ Replace this

---

## 🔄 After Making Changes

1. Save `learning.html`
2. Commit to git:
   ```bash
   git add learning.html
   git commit -m "Add premium video IDs"
   git push
   ```
3. Wait 2-3 minutes for GitHub Pages to deploy
4. Test: Login → Subscribe → Check if videos play correctly

---

## 💡 Tips

- **Video Titles**: Keep them clear and descriptive (50 chars max recommended)
- **Descriptions**: One line summary (80 chars max recommended)
- **Video IDs**: Must be valid YouTube video IDs (11 characters)
- **Count**: Always update the video count when adding/removing videos
- **Testing**: Always test videos after uploading to ensure they play correctly

---

## 🆘 Troubleshooting

**Video not playing?**
- Check if video ID is correct
- Ensure video is public or unlisted on YouTube
- Check browser console for errors

**Wrong number of videos showing?**
- Update the count in module header: `Premium Videos: X`

**Videos not visible to subscribers?**
- Check subscription status in admin dashboard
- Verify user has active subscription in database
- Clear browser cache and reload

---

## 📞 Support
If you need help adding videos, check the admin dashboard or contact support at info@manojtechnologies.in
