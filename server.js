const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.get('/rates', async (req, res) => {
  try {
    const { data } = await axios.get('https://sarafi.af/exchange-rates/sarai-shahzada');
    const $ = cheerio.load(data);
    const rows = $('.rate-table tbody tr');

    const rates = [];
    rows.each((i, row) => {
      const cols = $(row).find('td');
      const currency = $(cols[0]).text().trim();
      const buy = $(cols[1]).text().trim();
      const sell = $(cols[2]).text().trim();
      if (currency) rates.push({ currency, buy, sell });
    });
    res.json(rates);

  } catch (err) {
    res.status(500).json({ error: 'Error getting rates', details: err.message, stack: err.stack });
  }
});

// برای Render باید 0.0.0.0 و PORT از env بگیریم
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
