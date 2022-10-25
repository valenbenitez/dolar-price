import axios from "axios"

async function requestToP2P(options = {
    page: 1,
    rows: 20,
    publisherType: null,
    asset: 'USDT',
    tradeType: 'BUY',
    fiat: 'ARS',
    payTypes: [],
}) {
    const { data } = await axios.post('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', options, { headers: { 'Content-Type': 'application/json' } })
    return data
}

export default async function handler(req, res) {
    const options = {
        page: 1,
        rows: 20,
        publisherType: null,
        asset: 'USDT',
        tradeType: 'SELL',
        fiat: 'ARS',
        payTypes: []
    }
    if (req.method === 'GET') {
        const { data } = await axios.get('https://api.bluelytics.com.ar/v2/latest')
        const dataOfBuy = await requestToP2P();
        const dataOfSell = await requestToP2P(options);
        let numberOfBuyAdv = Object.keys(dataOfBuy.data).length;
        let numberOfSellAdv = Object.keys(dataOfSell.data).length;
        let totalOfBuy = 0;
        let totalOfSell = 0;
        dataOfBuy.data.forEach((adv) => {
            totalOfBuy = totalOfBuy + Number(adv.adv.price);
        });

        dataOfSell.data.forEach((adv) => {
            totalOfSell = totalOfSell + Number(adv.adv.price);
        });

        let averageOfBuy = totalOfBuy / numberOfBuyAdv;
        let averageOfSell = totalOfSell / numberOfSellAdv;
        let average = Number(((averageOfBuy + averageOfSell) / 2).toFixed(4));
        const prices = {
            p2p: average,
            blueSell: data.blue.value_sell,
            blueBuy: data.blue.value_buy
        }
        res.status(200).json(prices)
    }

    if (req.method === 'POST') {
        res.status(200).json({ req: 'POST' })
    }

}
