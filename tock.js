const urlparse = require('url');
const superagent = require('superagent');
const cheerio = require('cheerio');
const moment = require('moment');

const venues = [ 
    { businessid: 667, }, 
    { businessid: 1168, },
];

// return all days of the month in an array
function daysInMonth(date)  {
    let d = moment(date);
    let days =[];
    var monthDate = d.startOf('month'); // change to a date in the month of interest
    let numdays = monthDate.daysInMonth();

    for (let i = 0; i < numdays; i ++ ) {
    	 days.push(monthDate.format('YYYY-MM-DD')); 
    	 monthDate.add(1, 'day');
    };
    return days;
}

async function venueSearch(venue, date, party_size, timeOption) {
        let url = "https://www.exploretock.com/api/consumer/calendar/full";
        let tock_scope = {
            "businessId": venue.businessid,
        };

        let body = await superagent.post(url)
            .set('x-tock-scope', JSON.stringify(tock_scope))
            .set('accept-language', 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7')
            .set('content-type', 'application/json')
            .set('accept', 'application/json')
            .send({})
            .then(res => {
                return res.body;
            });

    let days = daysInMonth(date);

    let status = days.reduce( (m, i) => {
        m[i] = "closed";
        return m;
    }, {});

    body.result.openDate.map (d=> {
        if (status[d]) {
            status[d] = "soldout";
        }
    });

    let slots = body.result.ticketGroup;
    slots.forEach(function (slot) {
        if (status[slot.date]) {
        if (slot.availableTickets > 0 && !slot.isCommunal) {
            if (slot.minPurchaseSize <= party_size && slot.maxPurchaseSize >= party_size) {
                status[slot.date] = "available";
            }
        }
        }
    });
    return status;
}

async function doit() {
    for (let i = 0; i< venues.length ; i++ ) {
       let r = await venueSearch(venues[i], moment().format("YYYY-MM-DD"), 4, "dinner");
        console.log(r);
    }
};

doit();

