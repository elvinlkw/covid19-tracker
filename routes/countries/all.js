const express = require('express');
const request = require('request');
const router = express.Router();

// @route   GET /api/countries/all
// @desc    Get covid19 information of all countries
// @access  Public
router.get('/all', async (req, res) => {
  try {
    const options = {
      uri: `https://corona.lmao.ninja/v2/countries`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    }

    request(options, (error, response, body) => {
      if(error) console.log(error);

      if(response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No Data Found' });
      }

      return res.json(JSON.parse(body));
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;