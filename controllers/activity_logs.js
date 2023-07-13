const axios = require('axios');

const apiKey = 'SRsCylcX6NuHmQGWGfY';

exports.getlogs = async (req, res) => {
    const response = await axios.get('https://papertrailapp.com/api/v1/events/search', {
        headers: {
            'X-Papertrail-Token': apiKey
        },
        params: {
            q: `${req.query.searchfor}`
        }
    })
    if (!response) {
        res.status(500)
        res.json({
            success: false,
            message: "An error occured while getting log data"
        })
        return
    }
    else {
        const logs = response.data.events
        let details = []
        for(let i = 0; i< logs.length;i++){
            let msg = JSON.parse(logs[i].message)
            details.push(JSON.parse(msg.message))
        }
        res.status(200)
        res.json({
            success:true,
            data:details
        });
    }
}



