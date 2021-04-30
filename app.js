const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 3000;

const isCidr = require("is-cidr");
const toRegexRange = require("to-regex-range");
const morgan = require("morgan");

//app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname))

app.get("/", (req, res) => res.sendFile('index.html', {root: __dirname }))

app.post("/", (req, res) => {
  console.log(req.body);

  if (isCidr.v4(req.body.cidr)) {
    const Netmask = require("netmask").Netmask;
    const block = new Netmask(req.body.cidr);
    console.log(block);
    const ipStart = block.base.split(".");
    const ipEnd = block.size > 2 ? block.broadcast.split(".") : block.last.split(".") ;

    const ipArray = [ipStart, ipEnd];

    const rangeA = toRegexRange(ipArray[0][0], ipArray[1][0]);
    const rangeB = toRegexRange(ipArray[0][1], ipArray[1][1]);
    const rangeC = toRegexRange(ipArray[0][2], ipArray[1][2]);
    const rangeD = toRegexRange(ipArray[0][3], ipArray[1][3]);

    const ipRegExp = `^${rangeA}\\.${rangeB}\\.${rangeC}\\.${rangeD}\$`;
    res.send(ipRegExp);
  } else {
    res.send("INVALID CIDRv4");
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
