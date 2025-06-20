import http from "http";
import fs from "fs"
import { fileURLToPath } from "url"
import path from "path"
import { dirname } from "path"
import slugify from "slugify";

const title = "Članci o energetskoj efikasnosti";
const slug = slugify(title, {lower: true, strict: true});

console.log(slug);

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read data from file
const data = fs.readFileSync(path.join(__dirname, "data.json"), "utf-8")
const dataObj = JSON.parse(data)

// Read templates
const tempOverview = fs.readFileSync(path.join(__dirname, "templates", "overview.html"), "utf-8")
const tempCard = fs.readFileSync(path.join(__dirname, "templates", "card.html"), "utf-8")
const tempProduct = fs.readFileSync(path.join(__dirname, "templates", "product.html"), "utf-8")

// Replace template placeholders with actual data
const replaceTemplate = (temp, article) => {
 let output = temp.replace(/{%ARTICLE%}/g, article.article);
  output = output.replace(/{%AUTHOR%}/g, article.author);
  output = output.replace(/{%DATE%}/g, article.date);
  output = output.replace(/{%TEXT%}/g, article.text);
  output = output.replace(/{%IMAGE%}/g, article.image);
  output = output.replace(/{%THEME%}/g, article.theme);
  output = output.replace(/{%ID%}/g, article.id);
  output = output.replace(/{%POPULAR%}/g, article.popular ? "popular" : "");
  const badgeHTML = article.popular 
    ? `<div class="card__eco-badge">Popular</div>` 
    : "";
  output = output.replace(/{%POPULAR_BADGE%}/g, badgeHTML);

  return output;
};


// Create server
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const pathname = url.pathname
  const query = Object.fromEntries(url.searchParams)

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" })

    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join("")
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml)

    res.end(output)

    // Product page
  } else if (pathname === "/product") {
  res.writeHead(200, { "Content-type": "text/html" })
  const article = dataObj[query.id]
  const output = replaceTemplate(tempProduct, article)

  res.end(output)

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" })
    res.end(data)

    // Images
  } else if (pathname.match(/\.(jpg|jpeg|png|gif)$/)) {
    const imagePath = path.join(__dirname, pathname)

    fs.readFile(imagePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-type": "text/html" })
        res.end("<h1>Image not found!</h1>")
      } else {
        const ext = path.extname(pathname).slice(1)
        res.writeHead(200, { "Content-type": `image/${ext}` })
        res.end(data)
      }
    })

    // Not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    })
    res.end("<h1>Page not found!</h1>")
  }
})

// Start server
const port = process.env.PORT || 8000
server.listen(port, () => {
  console.log(`Listening to requests on port ${port}`)
  console.log(`Open http://localhost:${port} in your browser`)
})
