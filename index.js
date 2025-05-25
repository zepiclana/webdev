import fs from "fs"
import http from "http"
import url from "url"

// Read data from file
const data = fs.readFileSync("./data.json", "utf-8")
const dataObj = JSON.parse(data)

// Read templates
const tempOverview = fs.readFileSync("./templates/template-overview.html", "utf-8")
const tempCard = fs.readFileSync("./templates/template-card.html", "utf-8")
const tempProduct = fs.readFileSync("./templates/template-product.html", "utf-8")

// Replace template placeholders with actual data
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
  output = output.replace(/{%IMAGE%}/g, product.image)
  output = output.replace(/{%PRICE%}/g, product.price)
  output = output.replace(/{%FROM%}/g, product.from)
  output = output.replace(/{%ENERGY_SAVINGS%}/g, product.energySavings)
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
  output = output.replace(/{%QUANTITY%}/g, product.quantity)
  output = output.replace(/{%DESCRIPTION%}/g, product.description)
  output = output.replace(/{%ID%}/g, product.id)

  if (!product.eco) output = output.replace(/{%NOT_ECO%}/g, "not-eco")
  else output = output.replace(/{%NOT_ECO%}/g, "")

  return output
}

// Create server
const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true)

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" })

    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join("")
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml)

    res.end(output)

    // Product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" })
    const product = dataObj[query.id]
    const output = replaceTemplate(tempProduct, product)

    res.end(output)

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" })
    res.end(data)

    // Not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    })
    res.end("<h1>Page not found!</h1>")
  }
})

// Start server
const port = process.env.PORT || 8000
server.listen(port, () => {
  console.log(`Listening to requests on port ${port}`)
})
