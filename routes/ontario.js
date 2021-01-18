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
      testing_locations: 'c60993bb-3988-4648-9be9-398dee480514',
      region: 'd1bfe1ad-6575-4352-8302-09ca81f7ddfc',
      vaccinations: '8a89caa9-511c-4568-af89-7f2174b4378c'
    }

    const options = {
      uri: `https://data.ontario.ca/api/3/action/datastore_search?resource_id=${resourceObj[resource]}&limit=99999999`,
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