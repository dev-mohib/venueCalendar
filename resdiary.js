const urlparse = require('url');
const superagent = require('superagent');
const cheerio = require('cheerio');
const moment = require('moment');

const venues = {
        startDate: "2020-01-20T00:00:00",
        endDate: "2020-02-12T00:00:00",
        partysize: 3
}

async function AvailableDates() {
    const raw = {
        DateFrom:venues.startDate,
        DateTo: venues.endDate,
        PartySize: venues.partysize,
        ChannelCode: "ONLINE",
        PromotionId: null
        };
    const url = "https://7723fded-c4a4-4605-b717-6a890ecd2c71.resdiary.com/api/Restaurant/TheMuddlersClubBelfast/AvailabilityForDateRange";
    let body=await superagent
    .post(url)
    .send(raw)
    .set({
        "Content-Type": "application/json",
    })
    .then(res => {
         return res.body;
        //console.log(res.body)
    })
    .catch((err) => {
        console.log(`not working its an error ${err}`);
    });
  return body
}

async function doit() {
        let r = await AvailableDates();
        console.log(r.AvailableDates);
}

doit();

