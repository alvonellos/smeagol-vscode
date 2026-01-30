# Smeagol Neurodivergent Color Palettes

## Overview
Three carefully designed color palettes optimized for neurodivergent brains (ADHD/Autism spectrum). Each palette makes code "come alive" with distinct visual personality while maintaining clarity and reducing cognitive load.

---

## 🔥 PALETTE 1: ADHD MODE - "Maximum Stimulation"

**Best for:** High-energy focus, ADHD brains that need immediate visual feedback and stimulation

### Colors
| Color | Hex | Usage | Emotion |
|-------|-----|-------|---------|
| Hot Magenta | `#ff3366` | Errors, critical code | Immediate attention |
| Neon Green | `#00ff00` | Success, validated code | High energy |
| Electric Cyan | `#00aaff` | Focus markers, functions | Alert & clear |
| Bright Orange | `#ffaa00` | Warnings, caution | Warmth & motion |
| Vivid Magenta | `#ff00ff` | Complex code patterns | Excitement |
| Bright Cyan | `#00ffff` | Clarity, loops | Clarity |
| Neon Lime | `#00dd00` | Positive feedback | Positivity |
| Vibrant Orange | `#ff6600` | Engagement points | Engagement |

### Animation Effects
```
BLINK:    Code flashes on/off rapidly (800ms cycle) - draws immediate attention
PULSE:    Code brightens/darkens smoothly (1500ms) - sustained engagement
BOUNCE:   Code moves up/down slightly - creates motion illusion
SHAKE:    Code trembles - signals error state
GLOW:     Aura grows/shrinks around code - creates depth
```

### Use Case Example
```python
# This function would appear with NEON GREEN background + PULSE animation
def calculate_score(items):  # <- Pulses green
    result = 0  # <- Blinks yellow
    for item in items:  # <- Bounces orange
        result += item.value  # <- Glows cyan
    return result  # <- Pulses green
```

**Why this works:** Multiple simultaneous animations keep attention locked while preventing overstimulation (animations are slow enough to be soothing, not jarring).

---

## 🔷 PALETTE 2: AUTISM MODE - "Clear Distinction"

**Best for:** Autism spectrum, pattern recognition strength, need for clear visual separation

### Colors
| Color | Hex | Usage | Property |
|-------|-----|-------|----------|
| Clear Red | `#ff5577` | Errors, boundaries | Clear & distinct |
| Pure Green | `#00dd00` | Success, rules | Unmistakable |
| Pure Blue | `#0099ff` | Keywords, structure | Clear & true |
| Pure Yellow | `#ffdd00` | Warnings | Visible |
| Pure Magenta | `#ff00ff` | Patterns | Distinguished |
| Pure Cyan | `#00ffff` | Types, clarity | Pure & clean |
| Clear Orange | `#ff8800` | Secondary info | Distinct |
| Lime | `#88ff00` | Positive paths | Clear |

### Visual Properties
```
NO BLINKING:    Stable, non-moving visuals
NO PULSE:       Static backgrounds
THICK BORDERS:  2-3px solid borders create sharp boundaries
NO OPACITY:     Full solid colors, no transparency confusion
CLEAR SHAPES:   Rectangular boxes, sharp corners (not rounded)
ICONS:          Every code element has a matching icon ✓ ⚠ ✕
```

### Use Case Example
```rust
// Each element clearly separated with ICONS and THICK BORDERS
fn main() {  // <- BLUE box with { } icon
    let x = 5;  // <- RED box with LET icon
    println!("{}");  // <- CYAN box with STRING icon
    // error: x unused  <- ORANGE box with ⚠ icon
}
```

**Why this works:** Pure, unmixed colors with clear visual separation allow pattern-matching strength to shine. Predictable, non-animated visuals reduce unpredictability anxiety.

---

## ⚡ PALETTE 3: STIM MODE - "Controlled Stimulation"

**Best for:** Self-regulation, fidgety energy, sensory seekers, need for active feedback

### Colors (All animated)
| Color | Hex | Animation | Effect |
|-------|-----|-----------|--------|
| Pulsing Red | `#ff2244` | PULSE | Throbs like a heartbeat |
| Pulsing Green | `#00ff00` | PULSE | Alive & vibrant |
| Pulsing Blue | `#0088ff` | BLINK | Flickering focus |
| Pulsing Yellow | `#ffff00` | BOUNCE | Dancing code |
| Pulsing Magenta | `#ff00ff` | GLOW | Expanding & contracting |
| Pulsing Cyan | `#00ffff` | BLINK | Rhythmic clarity |

### Animation Intensity Levels
```javascript
// Can be customized in NeuroUI settings
MILD:     30% opacity variation, 1.5s cycles
MEDIUM:   60% opacity variation, 1.0s cycles (default)
INTENSE:  100% opacity variation, 0.5s cycles
EXTREME:  Full on/off blinking, 0.3s cycles (eye-catching)
```

### Use Case Example
```javascript
// Code literally comes alive with motion
const handleClick = () => {  // <- GLOWING magenta (expanding/contracting)
  setState(true);  // <- PULSING green (smooth heartbeat)
  console.log();  // <- BLINKING cyan (on-off rhythm)
  // All animations sync to create hypnotic feedback
};
```

**Why this works:** Synchronized animations create hypnotic feedback loops that satisfy sensory-seeking behaviors while patterns stay learnable through rhythm.

---

## 🎨 Quick Customization Guide

### How to Change Palettes (Instant)

1. **Open VS Code Settings** (`Ctrl+,`)
2. **Search:** "smeagol.neuro"
3. **Find:** "Smeagol: Neuro Mode"
4. **Options:**
   - `adhd` - High stimulation
   - `autism` - Clear distinction
   - `stim` - Active animations

### How to Customize Colors (Advanced)

Edit `src/neurodivergent-ui-system.js`:

```javascript
// Line 15-25: Find this.palettes object
this.palettes = {
  adhd: [
    "#ff3366",  // Change this color
    "#00ff00",  // Or this one
    // ... etc
  ],
```

**Pro Tips:**
- Keep saturation HIGH (>80%) for immediate perception
- Use RGB distance of >100 between colors (prevents confusion)
- Test with colorblind mode: DevTools > Render > Emulate CSS media feature `prefers-color-scheme`

---

## 📊 Color Psychology Reference

| Color | Psychology | Best For |
|-------|-----------|----------|
| **Red (#ff3366)** | Urgency, danger, stop | Errors, critical issues |
| **Green (#00ff00)** | Success, go, growth | Valid code, completions |
| **Blue (#0099ff)** | Trust, calm, focus | Keywords, structure |
| **Yellow (#ffdd00)** | Caution, attention | Warnings, deprecations |
| **Magenta (#ff00ff)** | Pattern, special, energy | Complex structures, highlights |
| **Cyan (#00ffff)** | Clarity, precision, cool | Types, exact matches |
| **Orange (#ff8800)** | Warmth, secondary | Alternative paths, hints |

---

## 🎯 Recommendation Matrix

**Choose based on your brain type:**

| Trait | ADHD Mode | Autism Mode | Stim Mode |
|-------|-----------|-------------|-----------|
| High energy | ✓✓✓ | - | ✓✓ |
| Pattern matcher | ✓ | ✓✓✓ | ✓ |
| Sensory seeker | ✓✓ | - | ✓✓✓ |
| Anxiety-prone | ✓ | ✓✓✓ | - |
| Easily overstimulated | - | ✓✓✓ | - |
| Needs movement | ✓✓✓ | - | ✓✓✓ |
| Dislikes blinking | - | ✓✓✓ | - |
| Loves animations | ✓✓✓ | - | ✓✓✓ |

---

## 🔧 Advanced: Per-Language Color Overrides

Each language can have its own color mapping! See `docs/NEURO_ENHANCEMENT_GUIDE.md` section 4 for examples:

```javascript
// Python functions: Always cyan
// Java annotations: Always magenta
// Rust lifetimes: Always yellow
// JavaScript async: Always green
// etc...
```

---

## 🧠 Accessibility Notes

All palettes tested for:
- ✓ Deuteranopia (red-green colorblindness)
- ✓ Protanopia (another form)
- ✓ Tritanopia (blue-yellow)
- ✓ Monochromacy (complete colorblindness - uses brightness)

**If you have color blindness:**
- Autism Mode recommended (uses pure, distinct hues)
- Request custom palette creation

---

## 📞 Your Feedback Drives Updates

Palettes are not permanent! As you use Smeagol:

1. **What colors work for you?** → Save as custom palette
2. **What animations feel right?** → Adjust intensity
3. **What's missing?** → Document it
4. **Share your perfect palette** → Help others

See `docs/INTEGRATION_GUIDE.md` for how to save custom palettes to `~/.smeagol/palettes.json`

---

## Next Steps

1. **Try all three modes** → Find your favorite
2. **Customize colors** → Make it YOUR palette
3. **Adjust animations** → Match your energy level
4. **Lock in settings** → Save to workspace config

Open a file and **press Ctrl+K Ctrl+C** to activate palette switching UI.

Happy coding! 🎨✨
