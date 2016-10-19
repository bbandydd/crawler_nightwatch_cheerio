const dateFormat = (date) => {
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
}

module.exports = {
    '抓取高雄威秀資訊': (browser) => {

        browser
            .url('http://www.vscinemas.com.tw/CinemaSessions.aspx?Lang=2')
            .waitForElementPresent('body')
            // 選擇高雄威秀
            .waitForElementPresent('select[name="ddlCinema"] option[value="KS"]')
            .click('select[name="ddlCinema"] option[value="KS"]')
            .waitForElementPresent('body')
            .source((result) => {
                const cheerio = require("cheerio")
                $ = cheerio.load(result.value)

                $('.PrintShowTimesFilm').map((idx, film) => {
                    console.log(film.children[0].data)
                })
            })
    }
}
