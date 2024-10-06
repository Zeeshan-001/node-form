const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = temp.replace(/{%IMAGE%}/g, product.image);
  output = temp.replace(/{%PRICE%}/g, product.price);
  output = temp.replace(/{%FROM%}/g, product.from);
  output = temp.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = temp.replace(/{%QUANTITY%}/g, product.quantity);
  output = temp.replace(/{%DESCRIPTION%}/g, product.description);
  output = temp.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  return output;
};

// read Data async, This Top level Code just Run One Time
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");

const dataObj = JSON.parse(data);

// This Code Would run Many Times
const server = http.createServer((req, res) => {
  const pathName = req.url;

  // Overview Page
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardHtml = dataObj.map((el) => replaceTemplate(tempCard, el));
    res.end(tempOverview);

    // Product Page
  } else if (pathName === "/product") {
    res.end("Product");

    // Send Data To Browser
  } else if (pathName === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    // Not Found
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page not Found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listning to Request on Port 8000");
});
