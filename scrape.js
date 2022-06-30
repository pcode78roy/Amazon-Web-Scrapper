//Packages
const axios = require("axios");
const cheerio = require("cheerio");
const { InstalledAddOnPage } = require("twilio/lib/rest/preview/marketplace/installedAddOn");
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Create a .env file and enter your information: 
// That is Your Twilio Account SID and Your Twilio Auth Token
// This is why dotenv dependeny is Installed
// Also dont forget to mention it in your .gitignore file 

const client = require("twilio")(accountSid, authToken);


//enter the prduct url you want
// const url =
//   "";

const product = { name: "", price: "", link: "" };

//Set interval
const handle = setInterval(scrape, 20000);

async function scrape() {
  //Fetch the data
  const { data } = await axios.get(url);
  //Load up the html
  const $ = cheerio.load(data);
  const item = $("div#dp-container");
  //Extract the data that we need
  product.name = $(item).find("h1 span#productTitle").text();
  product.link = url;
  const price = $(item)
    .find("span .a-price-whole")
    .first()
    .text()
    .replace(/[,.]/g, "");
  const priceNum = parseInt(price);
  product.price = priceNum;
  console.log(product);
  //Send an SMS
  if (priceNum < 100000) {
    client.messages
      .create({
        body: `The price of ${product.name} went below ${price}. Purchase it at ${product.link}`,
        from: "XXXXXXXXXXXX", //Your twillio Phone Number
        to: "XXXXXXXXXX", //Your Phone Number
      })
      .then((message) => {
        console.log(message);
        clearInterval(handle);
      });
  }
}

scrape();