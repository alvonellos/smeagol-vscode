#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Create Smeagol VS Code Icon"""

from PIL import Image, ImageDraw

# Create a 128x128 icon with a dark background
size = 128
img = Image.new('RGB', (size, size), color='#0a0a0a')
draw = ImageDraw.Draw(img)

# Smeagol's head (dark ellipse)
draw.ellipse([20, 15, 108, 95], fill='#2a2a2a', outline='#404040', width=2)

# Left eye (glowing green)
draw.ellipse([35, 30, 50, 50], fill='#00ff00')
draw.ellipse([37, 32, 48, 48], fill='#00ff88')
draw.ellipse([45, 35, 48, 38], fill='#ffffff')

# Right eye (glowing green)  
draw.ellipse([78, 30, 93, 50], fill='#00ff00')
draw.ellipse([80, 32, 91, 48], fill='#00ff88')
draw.ellipse([88, 35, 91, 38], fill='#ffffff')

# Nose
draw.polygon([(64, 50), (62, 60), (66, 60)], fill='#1a1a1a', outline='#303030')

# Mouth/grin
draw.arc([38, 55, 90, 75], 0, 180, fill='#303030', width=2)

# Ears
draw.ellipse([10, 25, 25, 60], fill='#1a1a1a', outline='#303030', width=1)
draw.ellipse([103, 25, 118, 60], fill='#1a1a1a', outline='#303030', width=1)

# Code pattern on chest - colorful brackets
draw.line([30, 75, 35, 85], fill='#ff00ff', width=2)
draw.line([35, 75, 30, 85], fill='#ff00ff', width=2)

draw.line([93, 75, 98, 85], fill='#00ffff', width=2)
draw.line([98, 75, 93, 85], fill='#00ffff', width=2)

draw.polygon([(60, 75), (65, 80), (60, 85)], fill='#00ff00', outline='#00ff00')

# Bottom accent bar
draw.rectangle([10, 115, 118, 117], fill='#ff00ff')

img.save('icons/smeagol-icon.png')
print("✓ PNG icon created: icons/smeagol-icon.png (128x128)")
