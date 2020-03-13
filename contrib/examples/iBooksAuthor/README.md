# iBooks Author Widget Example for TimelineJS3

It appears that in order to embed HTML in iBooks Author, you will need to create an HTML widget. Specifications for the iBook HTML widget format are here: https://support.apple.com/en-us/HT204433

The included example contains the specified .html, and .plist files and a Default.png file. Note: iBook is not an officially supported platform for Timeline. Our ability to help with this will be minimal. Also, this example is not well tested at all, but at first glance it appears to be working. Do this at your own risk. Be sure to let us know if you learn anything useful along the way -- we will try to include such information here as appropriate.

## Usage

First, you need to be familiar with the iBook Author application, as well as the concept of widgets used in that application. Please see the specification link above for detailed information about the requirements for an HTML widget.

To embed the example Timeline into your iBook:

 * within the Author select Widgets > HTML.
 * in the Widget dialog, select the `Choose ...` button and navigate to select contrib/examples/iBooksAuthor/TimelinJS.wdgt, and select `Insert`

Your widget is embedded and ready to go. Select the `Preview` button to preview your iBook and see the widget in action.

## Customizing


### Set your spreadsheet as the source

Presumably, you want to use your own Timeline. Edit the index.html file to specify your own Timeline spreadsheet. For more information about Javascript-embedded Timelines, see the docs here: https://timeline.knightlab.com/docs/instantiate-a-timeline.html.

Alternatively, you could specify your data via JSON as also documented in the link above.

### Accessing the widget files

NOTE: The Mac finder will probably not allow you to navigate into the .wdgt folder. You may need to either temporarily rename the folder, or access the files in other ways, such as via the terminal. The folder name, however, must be changed back to a .wdgt name to work with the Author.

### Regarding height and width

I did not find that the iBook Author did a very good job with handling percentage based dimension settings, so this example uses explicit height and width settings in both the plist specification and the index.html file.

Also, I found that matching the sizes in the plist and the html files tended to cutoff the edges of the Timeline, so you will notice that the plist dimensions are slightly larger than the html dimensions.

You will likely want to experiment with the dimensions a bit to find what works for you. I have no experience with the iBook Author, and have no idea if it does any kind of responsive layout work. Again, this example is not well tested and you will want to test for the various viewports you expect to be supporting.
