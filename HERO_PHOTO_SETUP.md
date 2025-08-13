# Hero Section Profile Photo Setup

## Current Implementation

The hero section now features a split-screen layout with:
- **Left side**: Profile photo (currently shows sophisticated placeholder with "AP" initials)
- **Right side**: Your existing text content, perfectly preserved

## Adding Your Actual Profile Photo

To replace the placeholder with your actual profile photo:

1. **Add your photo to the project:**
   ```
   client/src/assets/images/profile-photo.jpg
   ```

2. **Update the Hero component:**
   In `client/src/components/sections/Hero.tsx`, uncomment and update line 67:
   ```tsx
   <ProfilePhoto 
     size="xl"
     alt="Anand Pinisetty - Entrepreneur, Founder & CEO, Developer"
     src="/src/assets/images/profile-photo.jpg" // Uncomment and update this line
   />
   ```

3. **Recommended photo specifications:**
   - **Format**: JPG, PNG, or WebP
   - **Size**: 800x800px minimum (square aspect ratio)
   - **Quality**: High resolution for crisp display
   - **Background**: Professional headshot with clean background

## Styling Features

The profile photo includes premium styling:
- ✨ **Perfect circle shape** with border-radius: 50%
- 🏆 **Gold border** (4px) matching your site's accent color
- 💫 **Animated gradient border** that shifts colors
- 🌟 **Subtle pulse effect** with outer glow
- 📱 **Fully responsive** sizing for all devices
- 🎯 **Hover animations** with smooth scale effect

## Responsive Behavior

- **Desktop (lg+)**: Photo left, text right, side-by-side layout
- **Tablet (md)**: Slightly smaller photo, maintains split layout
- **Mobile (sm)**: Stacked layout with photo above text, centered

## Visual Effects

The profile photo container includes:
1. **Gradient border animation** using `gradientShift` keyframe
2. **Pulse glow effect** with `pulse` keyframe
3. **Hover scale effect** (1.05x on hover)
4. **Box shadow** for depth and premium feel

## Customization Options

You can adjust the ProfilePhoto component props:
- `size`: "sm" | "md" | "lg" | "xl" (currently "xl")
- `src`: Path to your profile image
- `alt`: Alternative text for accessibility
- `className`: Additional CSS classes

The design maintains perfect visual balance and preserves all your existing content while adding the sophisticated profile photo presentation you requested.
