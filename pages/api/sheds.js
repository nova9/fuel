let fs = require('fs');

export default async function handler(req, res) {
    let sheds = [];

    const today = new Date()
    const fileName = `${today.getFullYear()}-${today.getMonth()}-${today.getDay()}.json`

    if (fs.existsSync(fileName)) {
        sheds = fs.readFileSync(fileName)
        sheds = JSON.parse(sheds)
    } else {
        const urls = [...Array(500)].map((_, index) => `https://fuel.gov.lk/api/v1/sheddetails/${index + 1}/d`);

        for (let i = 0; i < 1344; i++) {
            let response;
            try {
                response = await fetch(`https://fuel.gov.lk/api/v1/sheddetails/${i + 1}/d`, {
                    headers: {
                        'Connection': 'keep-alive'
                    }
                })
            } catch (error) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                response = await fetch(`https://fuel.gov.lk/api/v1/sheddetails/${i + 1}/d`, {
                    headers: {
                        'Connection': 'keep-alive'
                    }
                })
            }
            const result = await response.json()
            sheds.push(result)
            console.log(i)
        }
        fs.writeFileSync(fileName, JSON.stringify(sheds))
    }
    // await Promise.all(urls.map(url => fetch(url)))
    //     .then(responses => Promise.all(responses.map((response) => response.json())))
    //     .then(results => {
    //         sheds = results
    //     })

    res.status(200).json(sheds)
}