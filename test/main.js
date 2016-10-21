'use strict'

const dateFormat = (date) => {
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
}

module.exports = {
    '抓取立榮航空資訊': (browser) => {

        const departure = "KHH"
        const destination = "MZG"
        const month = '11'
        const day = '20'

        browser
            .url('https://www.uniair.com.tw/uniweb/index.aspx')
            .waitForElementPresent('body')
            // 選擇來回
            .click('.tabs a:nth-child(2)')
            .pause(500)
            // 高雄 <--> 馬公
            .click(`#CPH_Body_ddl_Timetable_F option[value="${departure}"]`)
            .waitForElementPresent(`#CPH_Body_ddl_Timetable_T option[value="${destination}"]`)
            .click(`#CPH_Body_ddl_Timetable_T option[value="${destination}"]`)
            // 航班時間
            .execute(`$('#txt_Timetable_m').val(${month})`)
            .pause(500)
            .execute(`$('#txt_Timetable_d').val(${day})`)
            // 查詢
            .click('#CPH_Body_btn_Timetable_submit')
            .waitForElementPresent('#form1')
            .waitForElementPresent('.info-table')
            .source((result) => {
                const cheerio = require("cheerio")
                const $ = cheerio.load(result.value)

                const flights = []
                const titleList = ['flightNo', 'frequency', 'departure', 'arrival', 'aircraft']

                $('.info-table tbody tr').map((f_idx, flight) => {
                    let object = {}

                    $(flight).find('td').map((i_idx, info) => {
                        object[titleList[i_idx]] = $(info).text()
                    })
                    
                    flights.push(object)
                })

                console.log(flights)
            })
            .end()
    },
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
            .end()
    }
}
