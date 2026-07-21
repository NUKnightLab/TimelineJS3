"""
    Convert a CSV file in the format of the sample Google Sheet into usable Timeline JSON.
    Currently inflexible about time formats: if "Time" or "End Time" are included, values must
    be in 24-hour time and must include hours, minutes, and seconds. Milliseconds are not 
    supported. Adjust the time format string in populate time if necessary.

    Minimal input checking is conducted besides time formats. Values for the "Background" column
    are treated as URLs if they begin with http or https; otherwise they are treated by colors. 
    If you are trying to use this with other kinds of URLs, you'll need to adjust the pattern test.

    Otherwise, check against the JSON documentation at http://timeline.knightlab.com/docs/json-format.html
"""
import json, csv
import sys
from datetime import datetime

HEADERS = [
'Year',
'Month',
'Day',
'Time',
'End Year',
'End Month',
'End Day',
'End Time',
'Display Date',
'Headline',
'Text',
'Media',
'Media Credit',
'Media Caption',
'Media Thumbnail',
'Type',
'Group',
'Background',
]


def populate_time(time_str, target_dict):
    try:
        parsed = datetime.strptime(time_str, '%H:%M:%S')
        target_dict['hour'] = parsed.hour
        target_dict['minute'] = parsed.minute
        target_dict['second'] = parsed.second
    except ValueError:
        print(f"Invalid time string: {time_str}; must use %H:%M:%S format")


def main(csv_filename,json_filename=None):
    print(f"Reading data from {csv_filename}")
    out = {
        'events': []
    }
    with open(csv_filename) as f:
        r = csv.DictReader(f)
        for csv_row in r:
            json_row = {
                'media': {},
                'start_date': {},
                'end_date': {},
                'text': {}
            }
            json_row['media']['url'] = csv_row['Media']
            json_row['media']['credit'] = csv_row['Media Credit']
            json_row['media']['caption'] = csv_row['Media Caption']
            json_row['media']['thumbnail'] = csv_row['Media Thumbnail']

            json_row['text']['headline'] = csv_row['Headline']
            json_row['text']['text'] = csv_row['Text']

            json_row['start_date']['year'] = csv_row['Year']
            json_row['start_date']['month'] = csv_row['Month']
            json_row['start_date']['day'] = csv_row['Day']
            if csv_row['Time']:
                populate_time(csv_row['Time'],json_row['start_date'])
            if csv_row['Display Date']:
                json_row['start_date']['display_date'] = csv_row['Display Date']

            json_row['end_date']['year'] = csv_row['End Year']
            json_row['end_date']['month'] = csv_row['End Month']
            json_row['end_date']['day'] = csv_row['End Day']
            if csv_row['Time']:
                populate_time(csv_row['End Time'], json_row['end_date'])
            # type, group, background
            json_row['group'] = csv_row['Group']
            if csv_row['Background']:
                if csv_row['Background'].startswith('http'):
                    json_row['background'] = {'url': csv_row['Background']}
                else:
                    json_row['background'] = {'color': csv_row['Background']}
            if csv_row['Type'] == 'title':
                out['title'] = json_row
            elif csv_row['Type'] == 'era':
                out.get('eras',[]).append(json_row)
            else:
                out['events'].append(json_row)
            
    if json_filename:
        json.dump(out,open(json_filename,'w'),indent=2)
    else:
        json.dump(out,sys.stdout,indent=2)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} input_filename.csv [output_filename.json]\nIf output_filename is not specified, will dump to standard out") 
    main(*sys.argv[1:])
