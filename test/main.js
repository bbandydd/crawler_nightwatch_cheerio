'use strict'

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
                const $ = cheerio.load(result.value)

                const films = []

                $('.PrintShowTimesFilm').map((idx, film) => {
                    const times = []
                    let target = $(film).parent().next()

                    while($(target).find('.PrintShowTimesDay').html() != null) {
                        times.push({
                            timesDay: $(target).find('.PrintShowTimesDay').text(),
                            timesSession: $(target).find('.PrintShowTimesSession').text()
                        })
                        target = $(target).next()
                    }

                    films.push({
                        name: $(film).text(),
                        times: JSON.stringify(times)
                    })
                })

                console.log(films)
            })
    }
}
