                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                # TechEniac Digital Connect Web Screen

A mobile-first, responsive, non-scrollable digital connect web screen for **TechEniac**.

## 🎨 Design Specifications
- **Brand Colors**:
  - Crisp White: `#FFFFFF`
  - Electric Blue: `#425EF9`
  - Obsidian Navy: `#000921`
  - Slate Label: `#7C8BA6`
  - Light Background: `#F4F7FD` / Radial Light Ice-Blue Gradient
- **Typography**: 
  - Brand & Tagline: **General Sans** (weights 400, 500, 600, 700) bundled in `./fonts/`.
  - Cards & Labels: **Plus Jakarta Sans** (weights 400, 500) thin & clean typography so entire phone numbers and titles fit without truncation.
- **Tagline**: Left-aligned stacked `Think` (`#000921`), `Build` (`#425EF9`), `Grow` (`#000921`) with enhanced letter spacing and punchy font size.
- **Interactive Touch & Scrape Contrast Animation**:
  - Upper white body: Touch/scrape creates dynamic glowing Electric Blue (`#425EF9`) fluid trails and ripples.
  - Lower blue footer: Touch/scrape creates dynamic glowing Pure White (`#FFFFFF`) wave flares and ripples.
  - Cards: Contrast radial spotlight tracking finger drag across cards.
- **Background Watermark Birds**: Two TechEniac bird outlines positioned on top-right and bottom-left at 50% opacity, matching brand aesthetic.
- **LinkedIn Brand Asset**: Official, authentic rounded blue LinkedIn tile icon with white "in".
- **Card Action**: Diagonal up-right arrow `↗` (`#425EF9`, 2.5px stroke) across all cards.
- **Card Layout**: Compact horizontal padding and optimized icon size to display full numbers (`+91 81400 85842`, `+91 84012 84730`) completely.

---

## 📐 Layout & Motion Animations
1. **Splash Screen Choreography**:
   - Electric Blue (`#425EF9`) backdrop.
   - Pure White bird SVG drawn with stitched thread paths and white shine sweep.
   - Flying bird scales and glides seamlessly into the centered header logo while backdrop dissolves to crisp white.
2. **Centered Header**:
   - Electric Blue TechEniac Logo (`logos/logo.svg` in `#425EF9`).
3. **Hero Tagline**:
   - Stacked `Think` (`#000921`), `Build` (`#425EF9`), `Grow` (`#000921`) in General Sans Bold, centered with balanced line spacing.
4. **Card Grid Alignment**:
   - **Hero Full-Width Card**:
     - **Our Website**: `techeniac.com` (`https://techeniac.com/`) with globe icon & diagonal arrow `↗`.
   - **Row 2 (2 Columns)**:
     - **LinkedIn**: `Connect with us` (`https://www.linkedin.com/company/techeniac-services-llp/`) & diagonal arrow `↗`.
     - **Instagram**: `Follow us` (`https://www.instagram.com/life_at_techeniac`) & diagonal arrow `↗`.
   - **Row 3 (2 Columns)**:
     - **Sales**: `+91 81400 85842` (`tel:+918140085842`) with phone icon & diagonal arrow `↗`.
     - **HR**: `+91 84012 84730` (`tel:+918401284730`) with users icon & diagonal arrow `↗`.
   - **Row 4 (2 Columns)**:
     - **WhatsApp**: `+91 81400 85842` (`https://api.whatsapp.com/send?phone=+918140085842&text=Hello`) with WhatsApp icon & diagonal arrow `↗`.
     - **Email**: `buzz@techeniac.com` (`mailto:buzz@techeniac.com`) with mail icon & diagonal arrow `↗`.
   - Reduced corner radius (`14px`) and increased card heights across all cards.
5. **Animated Wavy Footer**:
   - Layered organic Electric Blue fluid waves with continuous undulating flow (clean, bubble-free).
   - Location Pin with ripple pulse animation linking to Ahmedabad HQ on Google Maps:
     `1501 Westport, near Taj Hotel, Sindhubhavan Road, Ahmedabad, Gujarat 380059.`

---

## 🚀 How to Run Offline
Open [index.html](file:///home/hetvi/Desktop/Hetvi/Projects/expo/withoutbubbles/index.html) directly in any browser:
```bash
google-chrome index.html
# or with python
python3 -m http.server 3000
```
