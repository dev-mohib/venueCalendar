const urlparse = require("url");
const superagent = require("superagent");
const cheerio = require("cheerio");
const moment = require("moment");

const venues = [
  {
    businessid: 5785, 
    url_slug: "rich-table",
    resy_city_code:"sf",
  },
  {
    businessid:  746,
    url_slug: "ju-ni",
    resy_city_code: "sf"
  },
];

async function venueSearch(venue,date) {

    const url = "https://api.resy.com/4/find";
    let body=await superagent
    .get(url)
    .query({
        day: date,
        lat: 37.776581,  //expermiental values
        long:  -122.438823,
        //num_seats:2,
        party_size: 3,
        venue_id: venue.businessid
    })
    .set("Authorization", 'ResyAPI "VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"')
    .send({})
    .then(res => {
        return res.body;
    })
    .catch((err) => {
        console.log(`not working its an error ${err}`);
    });
  return body
}


async function doit() {
    for (let i = 0; i < venues.length; i++) {
        let r = await venueSearch(venues[i], moment().format("YYYY-MM-DD"));
        for (let index = 0; index < r.results.venues.length; index++) {
          console.log(`\n\nid is :${r.results.venues[index].venue.id.resy}\nurl slug is : ${r.results.venues[index].venue.url_slug} \ncity code is : ${r.results.venues[index].venue.location.code}\nName is : ${r.results.venues[index].venue.name}\nBill is :${r.results.venues[index].venue.average_bill_size}\nlocation is : lat : ${r.results.venues[0].venue.location.geo.lat} lon : ${r.results.venues[0].venue.location.geo.lon} `);
          
      }

       
    }
}

doit();
