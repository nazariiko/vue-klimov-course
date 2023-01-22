/* eslint-disable prettier/prettier */
const API_KEY =
  "05e8c69fc16aafd7d4653c40af648e50d594f9cbbcf999243c6c6c28e737ce44";

const tickersHandlers = new Map();

export const getAllCoins = async () => {
  const respone = await fetch(
    `https://min-api.cryptocompare.com/data/all/coinlist?api_key=${API_KEY}`
  );
  const data = await respone.json();
  const coins = Object.keys(data.Data);
  return coins;
};

export const subscribeToTicker = (tickerName, cb) => {
  tickersHandlers.set(tickerName, cb)
}

export const unsubscribeFromTicker = (tickerName, cb) => {
  tickersHandlers.delete(tickerName)
  cb('unsubscribed')
}

const updateTickers = async () => {
  const tickersHandlersObj = Object.fromEntries(tickersHandlers)
  const tickerSymbols = Object.keys(tickersHandlersObj).join(',')
  if (!tickerSymbols.length) {
    return
  }

  const response = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickerSymbols}&tsyms=USD&api_key=${API_KEY}`)
  const tickersData = await response.json()
  Object.entries(tickersHandlersObj).forEach(([ticker, cb]) => {
    const newPrice = tickersData[ticker]['USD']
    cb(newPrice)
  })
}

const interval = setInterval(() => {
  updateTickers()
}, 5000);

window.onbeforeunload = () => {
  clearInterval(interval)
}



