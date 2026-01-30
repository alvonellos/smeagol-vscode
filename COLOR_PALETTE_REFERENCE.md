# 🎨 VISUAL PALETTE GUIDE - Copy & Paste Your Favorite

Here are your 3 neurodivergent color palettes. Copy any hex color code and customize!

---

## 🔥 PALETTE 1: ADHD MODE - "Maximum Stimulation"

```
┌─────────────────────────────────────────────────┐
│  Hot Magenta       │ #ff3366 ██████ Urgent      │
│  Neon Green        │ #00ff00 ██████ Success     │
│  Electric Cyan     │ #00aaff ██████ Focus       │
│  Bright Orange     │ #ffaa00 ██████ Warning     │
│  Vivid Magenta     │ #ff00ff ██████ Pattern     │
│  Bright Cyan       │ #00ffff ██████ Clarity     │
│  Neon Lime         │ #00dd00 ██████ Positive    │
│  Vibrant Orange    │ #ff6600 ██████ Engagement │
└─────────────────────────────────────────────────┘
```

**Copy this to NeuroUI:**
```javascript
this.palettes.adhd = [
  "#ff3366",  // Hot magenta
  "#00ff00",  // Neon green
  "#00aaff",  // Electric cyan
  "#ffaa00",  // Bright orange
  "#ff00ff",  // Vivid magenta
  "#00ffff",  // Bright cyan
  "#00dd00",  // Neon lime
  "#ff6600",  // Vibrant orange
];
```

---

## 🔷 PALETTE 2: AUTISM MODE - "Clear Distinction"

```
┌─────────────────────────────────────────────────┐
│  Clear Red         │ #ff5577 ██████ Distinct    │
│  Pure Green        │ #00dd00 ██████ Pure        │
│  Pure Blue         │ #0099ff ██████ True        │
│  Pure Yellow       │ #ffdd00 ██████ Visible     │
│  Pure Magenta      │ #ff00ff ██████ Separated   │
│  Pure Cyan         │ #00ffff ██████ Clean       │
│  Clear Orange      │ #ff8800 ██████ Unmixed     │
│  Lime              │ #88ff00 ██████ Clear       │
└─────────────────────────────────────────────────┘
```

**Copy this to NeuroUI:**
```javascript
this.palettes.autism = [
  "#ff5577",  // Clear red
  "#00dd00",  // Pure green
  "#0099ff",  // Pure blue
  "#ffdd00",  // Pure yellow
  "#ff00ff",  // Pure magenta
  "#00ffff",  // Pure cyan
  "#ff8800",  // Clear orange
  "#88ff00",  // Lime
];
```

---

## ⚡ PALETTE 3: STIM MODE - "Controlled Hypnosis"

```
┌─────────────────────────────────────────────────┐
│  Pulsing Red       │ #ff2244 ██████ Animate     │
│  Pulsing Green     │ #00ff00 ██████ Animate     │
│  Pulsing Blue      │ #0088ff ██████ Animate     │
│  Pulsing Yellow    │ #ffff00 ██████ Animate     │
│  Pulsing Magenta   │ #ff00ff ██████ Animate     │
│  Pulsing Cyan      │ #00ffff ██████ Animate     │
│                                                  │
│ ALL COLORS ANIMATE WITH SYNCHRONIZED RHYTHM     │
└─────────────────────────────────────────────────┘
```

**Copy this to NeuroUI:**
```javascript
this.palettes.stim = [
  "#ff2244",  // Pulsing red
  "#00ff00",  // Pulsing green
  "#0088ff",  // Pulsing blue
  "#ffff00",  // Pulsing yellow
  "#ff00ff",  // Pulsing magenta
  "#00ffff",  // Pulsing cyan
];
```

---

## 🎨 HOW TO USE THESE COLORS

### In Your Code
```javascript
// Open src/neurodivergent-ui-system.js
// Find this.palettes = { ... }
// Replace the color arrays with your favorite palette

// Example: ADHD Mode
this.palettes.adhd = [
  "#ff3366",  // Change this
  "#00ff00",  // Or this
  // ... etc
];
```

### Copy-Paste Ready
Just copy the hex codes from the boxes above and paste them into your palette!

---

## 🔄 QUICK REFERENCE: Color Meanings

| Color | Hex | Meaning | Use For |
|-------|-----|---------|---------|
| **RED** | #ff5577 | Stop, error, urgent | Errors, red flags |
| **GREEN** | #00dd00 | Go, success, valid | Success, valid code |
| **BLUE** | #0099ff | Trust, calm, focus | Keywords, structure |
| **YELLOW** | #ffdd00 | Caution, attention | Warnings, watch out |
| **MAGENTA** | #ff00ff | Special, pattern | Complex structures |
| **CYAN** | #00ffff | Clarity, precision | Types, exact matches |
| **ORANGE** | #ff8800 | Warmth, secondary | Alternative paths |

---

## 💡 Tips for Customization

### Want Something Between Modes?
Mix colors from different palettes!

```javascript
// ADHD + Autism Hybrid
this.palettes.hybrid = [
  "#ff3366",  // From ADHD
  "#00dd00",  // From Autism (pure green)
  "#00aaff",  // From ADHD
  "#ffdd00",  // From Autism (pure yellow)
  "#ff00ff",  // From ADHD
  "#00ffff",  // From both
];
```

### Want Higher Contrast?
Increase saturation by adjusting values:

```javascript
// BOOST SATURATION
"#ff3366" → "#ff0044"  // More vibrant magenta
"#00dd00" → "#00ff00"  // Full green brightness
"#00aaff" → "#0099ff"  // More vibrant cyan
```

### Want Lower Energy?
Decrease saturation:

```javascript
// CALM DOWN
"#ff3366" → "#ff7799"  // Softer magenta
"#00ff00" → "#88dd00"  // Softer green
"#00aaff" → "#5588cc"  // Softer cyan
```

---

## 🧪 Test Your Palette

After changing colors:

1. **Save** the file
2. **Reload** VS Code (Ctrl+R)
3. **Open** any code file
4. **Look** at the highlights
5. **Adjust** if colors feel off

**Does it feel right?** → You've found YOUR palette! 🎉

---

## 📧 Save Your Custom Palette

Want to keep your customizations safe?

```bash
# Create a backup of your custom palette
cp src/neurodivergent-ui-system.js src/neurodivergent-ui-system-MY-PALETTE.js

# Or edit ~/.smeagol/palettes.json if it exists
# Format:
{
  "myCustom": [
    "#ff3366",
    "#00ff00",
    // ... your colors
  ]
}
```

---

## 🎯 Recommendation

### If you have ADHD:
**Start with:** ADHD MODE (stimulating + animated)
**Then try:** STIM MODE (hypnotic)
**Avoid:** Autism mode (too static)

### If you're on the autism spectrum:
**Start with:** AUTISM MODE (clear + static)
**Then try:** ADHD MODE (animated version)
**Avoid:** Too much blinking at once

### If you're not sure:
**Start with:** ADHD MODE
**Try all three:** See which feels best
**Mix them:** Create your own hybrid

---

## ✨ Your Personal Palette is Valid

There's no "wrong" palette. If colors feel good to your brain, they're RIGHT.

Want to share your custom palette? Add it to docs/PALETTES_COMMUNITY.md! 💜

Happy coding! 🎨
