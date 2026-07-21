import { parseObjects } from '../CSV'
import * as fs from 'fs'

test("test the CSV", () => {
    let data = fs.readFileSync(`${__dirname}/parser_test.csv`, 'utf-8')
    let rows = parseObjects(data)
    expect(rows.length).toBe(3)

    // depends on file contents of course
    expect(rows[0]['title']).toBe('a good day')
    expect(rows[0]['count']).toBe('5')
    var row0_description = `let's just pile it  all in here,  commas, "quoted strings" and 
new lines!`

    expect(rows[0]['description'].trim()).toBe(row0_description.trim())
    expect(rows[1]['title']).toBe('an ok day')
    expect(rows[1]['count']).toBe('3')
    expect(rows[1]['description']).toBe('this is less ambitious')
    expect(rows[2]['title']).toBe('a day, i guess')
    expect(rows[2]['count']).toBe('2')
    expect(rows[2]['description']).toBe('what else could go wrong?')

})

test("test official CSV", () => {
    let data = fs.readFileSync(`${__dirname}/women_in_computing.csv`, 'utf-8')
    let rows = parseObjects(data)
    expect(rows.length).toBe(11)
    rows.forEach((row, idx) => {
        expect(Object.keys(row).length).toBe(18)
    })
    let title = rows[0]
    expect(title['Type']).toBe('title')
    expect(title['Background']).toMatch(/upload.wikimedia.org/)

})