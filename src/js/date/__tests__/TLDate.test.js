import { TLDate, BigDate, makeDate, parseDate } from "../TLDate"
import { Language } from "../../language/Language"
import { validDateConfig } from "../DateUtil";

function date_dict(d) {
    return {
        'milliseconds': d.data.date_obj.getMilliseconds(),
        'seconds': d.data.date_obj.getSeconds(),
        'minutes': d.data.date_obj.getMinutes(),
        'hours': d.data.date_obj.getHours(),
        'day': d.data.date_obj.getDate(),
        'month': d.data.date_obj.getMonth(), // 0-11 remember
        'year': d.data.date_obj.getYear()
    }
}

function date_parts_match(a, b, parts) {
    a = date_dict(a);
    b = date_dict(b);
    for (var i = 0; i < parts.length; i++) {
        if (a[parts[i]] != b[parts[i]]) return false;
    };
    return true;
}


test("Don't allow comparison with JS Dates", () => {
    var refdate = makeDate({ year: 2000, month: 6, day: 21 });
    var jsdate = new Date();
    expect(() => { refdate.isBefore(jsdate) }).toThrow();
})

test("before and after", () => {
    var refdate = makeDate({ year: 2000, month: 6, day: 21 });
    var jsdate = makeDate(new Date());

    expect(refdate.isBefore(jsdate)).toBeTruthy();
    expect(jsdate.isAfter(refdate)).toBeTruthy();

})

test("small dates are human so time is UNIX Epoch based", () => {
    var smalldate = makeDate({ year: 2015 });
    expect(smalldate.getTime()).toBe(1420070400000)
})

test("big dates are cosmological", () => {
    var bigdate = makeDate({ year: 1000000 });
    expect(bigdate.getTime()).toBe(1000000)
})

test("display_text overrides other formatting", () => {
    var cdate = makeDate({ year: 2014, display_date: "hello" });
    expect(cdate.getDisplayDate()).toBe('hello')

})

test("handle years in the first century CE correctly", () => {
    var date = makeDate({ year: 75 });
    expect(date.getDisplayDate()).toBe("75")
})

test("test three-part parseDate", () => {
    var d = parseDate('2014-08-20');
    expect(d.year).toBe('2014')
    expect(d.month).toBe('08')
    expect(d.day).toBe('20')

})

test("test two-part parseDate", () => {
    var d = parseDate('2014-08');
    expect(d.year).toBe('2014')
    expect(d.month).toBe('08')
    expect(d.day).toBeFalsy()

})

test("test one-part parseDate", () => {
    var d = parseDate('2014');
    expect(d.year).toBe('2014')
    expect(d.month).toBeFalsy()
    expect(d.day).toBeFalsy()

})

test("test negative-year parseDate", () => {
    var d = parseDate('-6');
    expect(d.year).toBe('-6')
    expect(d.month).toBeFalsy()
    expect(d.day).toBeFalsy()

})

test("test old Timeline format parse date", () => {
    var d = parseDate('11/10/2018 11:00:00')
    expect(d.year).toBe('2018')
    expect(d.month).toBe('11')
    expect(d.day).toBe('10')
    expect(d.hour).toBe('11')
    expect(d.minute).toBe('00')
    expect(d.second).toBe('00')
    expect(d.millisecond).toBeFalsy()

    var d = parseDate('11/17/2018 11:15:23.6')
    expect(d.year).toBe('2018')
    expect(d.month).toBe('11')
    expect(d.day).toBe('17')
    expect(d.hour).toBe('11')
    expect(d.minute).toBe('15')
    expect(d.second).toBe('23')
    expect(d.millisecond).toBe('6')

})

test("findBestFormat tests", () => {
    var date = new TLDate({ 'year': 1975, month: 7 })
    expect(date.findBestFormat()).toBe("month")
    expect(date.findBestFormat(true)).toBe("month_short") // "Expect a different format key for short (legacy)")
    expect(date.findBestFormat('short')).toBe('month_short') //'"Expect a different format key for short (explicit)")

})

test("test TLDate.floor", () => {
    expect(() => { makeDate(new Date()).floor('foobar'); }).toThrow(/invalid_scale_err/)

    var d = makeDate(new Date(1407440158306)); // Thu Aug 07 2014 14:35:58 GMT-0500 (CDT)
    var floored = d.floor('millisecond');
    var date_obj = floored.data.date_obj;
    expect(
        date_parts_match(d, floored, ['year', 'month', 'date', 'hours', 'minutes', 'seconds', 'milliseconds'])
    ).toBeTruthy()
    expect(date_obj.getTime()).toBe(d.getTime()) //'rounds to millisecond'

    var floored = d.floor('second');
    var date_obj = floored.data.date_obj;
    expect(date_parts_match(d, floored, ['year', 'month', 'date', 'hours', 'minutes', 'seconds'])).toBeTruthy() // , 'second rounding doesnt change others'
    expect(date_obj.getMilliseconds()).toBe(0)

    var floored = d.floor('minute');
    var date_obj = floored.data.date_obj;
    expect(date_parts_match(d, floored, ['year', 'month', 'date', 'hours', 'minutes'])).toBeTruthy()

    expect(date_obj.getMilliseconds()).toBe(0)
    expect(date_obj.getSeconds()).toBe(0)

    var floored = d.floor('hour');
    var date_obj = floored.data.date_obj;
    expect(date_parts_match(d, floored, ['year', 'month', 'date', 'hours'])).toBeTruthy()
    expect(date_obj.getMilliseconds()).toBe(0)
    expect(date_obj.getSeconds()).toBe(0)
    expect(date_obj.getMinutes()).toBe(0)

    var floored = d.floor('day');
    var date_obj = floored.data.date_obj;
    expect(date_parts_match(d, floored, ['year', 'month', 'date'])).toBeTruthy()
    expect(date_obj.getMilliseconds()).toBe(0)
    expect(date_obj.getSeconds()).toBe(0)
    expect(date_obj.getMinutes()).toBe(0)
    expect(date_obj.getHours()).toBe(0)

    var floored = d.floor('month');
    var date_obj = floored.data.date_obj;
    expect(date_parts_match(d, floored, ['year', 'month'])).toBeTruthy()
    expect(date_obj.getMilliseconds()).toBe(0)
    expect(date_obj.getSeconds()).toBe(0)
    expect(date_obj.getMinutes()).toBe(0)
    expect(date_obj.getHours()).toBe(0)
    expect(date_obj.getDate()).toBe(1) // months round to 1

    var floored = d.floor('year');
    var date_obj = floored.data.date_obj;
    expect(date_parts_match(d, floored, ['year'])).toBeTruthy()
    expect(date_obj.getMilliseconds()).toBe(0)
    expect(date_obj.getSeconds()).toBe(0)
    expect(date_obj.getMinutes()).toBe(0)
    expect(date_obj.getHours()).toBe(0)
    expect(date_obj.getDate()).toBe(1)
    expect(date_obj.getMonth()).toBe(0)

    var floored = d.floor('decade');
    var date_obj = floored.data.date_obj;
    expect(date_obj.getYear()).toBe(110) // "decade should round to 2010 " 

    var floored = d.floor('century');
    var date_obj = floored.data.date_obj;
    expect(date_obj.getYear()).toBe(100) // "century should round to 2000 "

    var floored = d.floor('millennium');
    var date_obj = floored.data.date_obj;
    expect(date_obj.getYear()).toBe(100) // "Should round to 2000 "

    var early_ce = makeDate(-59149708181438); // 8/14/95 (95 not 1995)
    var floored = early_ce.floor('decade');
    expect(floored.getTime()).toBe(-59326992000000) // 'Early floored dates should not go into the 20th Century')

    var age_scale = makeDate({ year: 1500000 });
    expect(() => {
            age_scale.floor('month');
        }).toThrow(/invalid_scale_err/) // 'month not valid scale for cosmo'
    expect(age_scale.floor('age').getTime()).toBe(1000000) // 'Should floor to 1M years'

    var cosmo_year = new BigDate({ 'year': 1945 });
    expect(cosmo_year.floor('decade').getTime()).toBe(1940) // 'decade should floor 1945 to 1940'
})

test("date formatting", () => {
    var msgs = Language.default;
    var d = makeDate({ year: '2014', month: '1', day: '1' })
    expect(d.getDisplayDate(msgs)).toBe("January 1, 2014")
    var d = makeDate({ year: '2014' })
    expect(d.getDisplayDate(msgs)).toBe("2014")

})

test("validDateConfig", () => {
    let d = { year: '2014', month: '1', day: '1' }
    expect(validDateConfig(d)).toBeTruthy()
    d = { year: '2014', month: '', day: '' }
    expect(validDateConfig(d)).toBeTruthy()
    d = { year: '2014', month: '1' }
    expect(validDateConfig(d)).toBeTruthy()
    d = { year: 'June 2014' }
    expect(validDateConfig(d)).toBeFalsy()

    d = { year: '2014', month: 'June', day: '' }
    expect(validDateConfig(d)).toBeFalsy()


})

test("validDateConfig field failures", () => {
    let d = {
        "year": "400",
        "month": "1",
        "day": "1",
        "hour": 0,
        "minute": 0,
        "second": null,
        "millisecond": null
    }
    expect(validDateConfig(d)).toBeTruthy()
})