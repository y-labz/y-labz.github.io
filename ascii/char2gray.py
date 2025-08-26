from PIL import Image, ImageDraw, ImageFont
import numpy as np

# Your elemental characters:
# This version was handpicked by y-labz admin :-)
chars = "金木水火土風雨雷電冰陰陽天地一二三四五六七八九十甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥、。〖〗「」〔〕『』【】（）《》〈〉"

# Settings for image size and font:
font_path = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"
img_size = 64
font_size = 48

# Dictionary to hold char: avg_grayscale
char_grayscale = {}

# Load font
font = ImageFont.truetype(font_path, font_size)

for char in chars:
    # Create a white background image
    img = Image.new('L', (img_size, img_size), color=255)  # 'L' = grayscale mode
    
    draw = ImageDraw.Draw(img)
    
    # Get size of the character
    w, h = draw.textsize(char, font=font)
    
    # Position text roughly centered
    pos = ((img_size - w) // 2, (img_size - h) // 2)
    
    # Draw the character in black
    draw.text(pos, char, font=font, fill=0)
    
    # Convert image to numpy array for calculations
    arr = np.array(img)
    
    # Calculate average grayscale (0=black, 255=white)
    avg_gray = arr.mean()
    
    char_grayscale[char] = avg_gray

    # Inside your loop, after drawing text:
    img.save(f"./{char}.png")


# Sort by grayscale ascending (darkest first)
sorted_chars = dict(sorted(char_grayscale.items(), key=lambda item: item[1]))

# Show results
for c, gray in sorted_chars.items():
    print(f"'{c}': {gray:.2f}")

# Join all sorted characters into a string
sorted_char_string = ''.join(sorted_chars.keys())

# Write to a JS file
with open("sorted_chars.js", "w", encoding="utf-8") as f:
    f.write(f'const sorted_chars = "{sorted_char_string}";\n')

