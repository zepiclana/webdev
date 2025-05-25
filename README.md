# Energy Efficiency Project

A simple Node.js application that displays information about energy-efficient products.

## How to Run

1. Make sure you have Node.js installed (version 14 or higher recommended)
2. Create a folder called `images` in the root directory
3. Download some product images and place them in the `images` folder (make sure the filenames match those in data.json)
4. Run the server:

\`\`\`bash
node server.js
\`\`\`

5. Open your browser and go to http://localhost:8000

## Project Structure

- `server.js` - The main server file
- `data.json` - Product data
- `templates/` - HTML templates
  - `overview.html` - Main page template
  - `card.html` - Product card template
  - `product.html` - Product detail page template
- `images/` - Folder for product images (you need to create this)

## Features

- Overview page with all energy-efficient products
- Detailed product pages
- Simple API endpoint at /api
