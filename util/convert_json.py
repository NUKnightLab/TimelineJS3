#!/usr/bin/env python
import json
import sys
import re

if len(sys.argv) != 2:
    print "Usage: %s [file.json]" % sys.argv[0]
    sys.exit(0)
def process_date(date_str):
    if re.match("^\d{4}$", date_str):
        return { "year": date_str}
    try:
        year,month,day = re.match("^(\d{4})[/,\-](\d+)[/,\-](\d+)$",date_str).groups()
        return { "year": year, "month": month, "day": day }
    except AttributeError:
        pass

    sys.stderr.write("*** weird date: %s\n" % date_str) 
    return {}

def process_slide(s):
    d = {"start_date": {}, "media": {}, "text": {}}
    d['text']['headline'] = s.get('headline',"")
    d['text']['text'] = s.get('text','')
    try:
        asset = s['asset']
        d['media']['url'] = asset.get('media','')
        d['media']['caption'] = asset.get('caption','')
        d['media']['credit'] = asset.get('credit','')
    except KeyError:
        pass

    d['start_date'] = process_date(s['startDate'])
    try:
        d['end_date'] = process_date(s['endDate'])
    except KeyError:
        pass

    return d
data = json.load(open(sys.argv[1]))
slides = []
newdata = { "timeline": {"slides": slides}}

timeline = data['timeline']
dates = timeline.pop('date')
if (len(timeline)):
    slides.append(process_slide(timeline))
for date in dates:
    slides.append(process_slide(date))

json.dump(newdata,sys.stdout,indent=2)


"""
The data file should be in JSON format with the following structure

{
    "timeline": {
        "slides": [
            {
                "start_date": {
                    "year":         "1900",
                    "month":        "01",
                    "day":          "05",
                    "hour":         "",
                    "minute":       "",
                    "second":       "",
                    "millisecond":  "",
                    "format":       ""
                },
                "end_date": {
                    "year":         "1900",
                    "month":        "06",
                    "day":          "07",
                    "hour":         "",
                    "minute":       "",
                    "second":       "",
                    "millisecond":  "",
                    "format":       ""
                },
                "media": {
                    "caption":  "",
                    "credit":   "",
                    "url":      "url_to_your_media.jpg",
                    "thumbnail":    "url_to_your_media.jpg"
                },
                "text": {
                    "headline": "Headline Goes Here",
                    "text":     "Your slide text goes here."
                }
            }
        ]
    }
}

"""
