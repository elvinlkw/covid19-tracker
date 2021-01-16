const express = require('express');
const axios = require('axios');
const request = require('request');
const router = express.Router();

// @route   GET api/ontario
// @desc    Get number of cases
// @access  Public
router.get('/', async (req, res) => {
  try {
    const resource = req.query.resource;
    const resourceObj = {
      all: 'ed270bb8-340b-41f9-a7c6-e8ef587e6d11',
      region: '8a88fe6d-d8fb-41a3-9d04-f0550a44999f'
    }

    const options = {
      uri: `https://data.ontario.ca/api/3/action/datastore_search?resource_id=${resourceObj[resource]}&limit=9999999`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    }

    request(options, (error, response, body) => {
      if(error) console.log(error);

      if(response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No Data Found' });
      }

      return res.json(JSON.parse(body).result.records);
    });

  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;