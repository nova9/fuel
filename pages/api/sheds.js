let fs = require('fs');

export default async function handler(req, res) {
    let sheds = [];
    let fetchPromises = [];

    const today = new Date()
    const fileName = `${today.getFullYear()}-${today.getMonth()}-${today.getDay()}.json`

    if (fs.existsSync(fileName)) {
        sheds = fs.readFileSync(fileName)
        sheds = JSON.parse(sheds)
    } else {
        // const urls = [...Array(500)].map((_, index) => `https://fuel.gov.lk/api/v1/sheddetails/${index + 1}/d`);

        for (let i = 0; i < 400; i++) {
            let response = fetch(`https://fuel.gov.lk/api/v1/sheddetails/${i + 1}/d`, {
                headers: {
                    'Connection': 'keep-alive'
                }
            })
            fetchPromises.push(response)
        }

        const responses = await Promise.allSettled(fetchPromises)
        console.log('data retrieving done')
        const fulfilledResponses = responses.filter(response => response.status === 'fulfilled')
        const results = await Promise.all(fulfilledResponses.map(response => response.value.json()))

        sheds = results.map(shed => (
            {
                longitude: shed.longitude,
                latitude: shed.latitude,
                p92Capacity: shed.p92Capacity,
                p95Capacity: shed.p95Capacity,
                dcapacity: shed.dcapacity,
                sdcapacity: shed.sdcapacity,
                kcapacity: shed.kcapacity,
                shedownerupdatetoday: shed.shedownerupdatetoday
            }
        ))

        console.log(results.length)
            // .then(responses => Promise.all(responses.map((response) => response.json())))
            // .then(results => {
            //     // console.log(results)
            //     console.log(results)
            //     sheds = results
            // })
        fs.writeFileSync(fileName, JSON.stringify(sheds))
    }

    res.status(200).json(sheds)
}