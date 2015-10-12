<h1>Contributing to TimelineJS</h1>

TimelineJS is open source software. Knight Lab appreciates contributions to the code and to the translations that support publishing timelines in other languages.

Please be aware that TimelineJS is designed to make digital storytelling simple. Historically, we've chosen not to pursue certain features which **could** be added to TimelineJS because we felt that they diverged from our design principles. If you have ambitious ideas for changes, you should start a conversation about the idea in [GitHub issues](https://github.com/NUKnightLab/TimelineJS3/issues) using the "feature proposal" label. 

Translations, bug fixes and features proposed and endorsed by Knight Lab should be contributed as [GitHub pull requests](https://help.github.com/articles/using-pull-requests/).

If you run into challenges trying to set up for contribution, post a [GitHub issue](https://github.com/NUKnightLab/TimelineJS3/issues).

<h2>Working with the Code</h2>

The official way that TimelineJS code is managed uses a python-based system for compiling the javascript and CSS and managing the static site content. We strongly encourage people working on the code to use this system. However, if this is a major burden, it is also possible to use the CodeKit IDE to work on the code.

<h3>The Python Method</h3>
Our build environment is routinely used with Python 2.7. Other versions of Python may work but have not been tested. Even though we call it the `python method`, there are also dependencies on `node` libraries for preparing the CSS and Javascript files.

Generally, we recommend python projects begin with a [virtual environment](http://docs.python-guide.org/en/latest/dev/virtualenvs/) (aka virtualenv) but this is not strictly required. Whether in a virtualenv or not, you must install a few [libraries](https://github.com/NUKnightLab/TimelineJS3/blob/master/requirements.txt). The best way to do this is with the following command:

    pip install -r requirements.txt

Once the requirements are installed, here are things to know:

* ALWAYS edit code in the [/source/](https://github.com/NUKnightLab/TimelineJS3/tree/master/source) directory. Pull requests which only have changes to code in the `/build/` or `/compiled/` directory are incorrect and will not be accepted.
* use the `fab build` command to compile your changes for testing.
* use the `fab serve` command to run a local web server which mimics the official documentation web site and provides a way to load your updated javascript for testing. The URL for your local test environment is http://localhost:5000/ You can use the [make a timeline form](http://localhost:5000/#make) with Google Spreadsheets to see how your changes are working. **Remember:** you must execute `fab build` after you change javascript to see your changes on your local server. It is **not** automatic.
* You may also want to make sure that the [examples](http://localhost:5000/#examples) still work as expected after you change code.
* Don't break the unit tests. Consider adding test code for your changes. We're still working out our unit testing methodology, but before you submit pull requests, you should check http://localhost:5000/unit-tests.html and http://localhost:5000/mediatype-tests.html and verify that you haven't broken any of the tests with your changes.

<h4>node/npm</h4>
As mentioned above, developers building this code using Python must also install a handful of `node` utilities. Installing `node` and `npm` is left as an exercise for the developer, but once they are installed, make sure you do these commands:

    npm install -g less
    npm install -g uglifyjs

<h4>Check your install</h4>
You must also check out one more git repository, that our code depends on. Check this out "alongside" your TimelineJS3 directory -- they should both have the same parent folder.


    git clone https://github.com/NUKnightLab/fablib.git

After you've done the above, change into your TimeLineJS3 directory and run these commands:

	fab build
	fab serve

Then open a browser and visit http://localhost:5000/unit-tests.html . All of the unit tests should run with no errors reported. You may also want to check some of the examples, such as http://localhost:5000/examples/houston/ to make sure that things are basically working. The local webserver should load all of its javascript from your local `/build/` directory, so as you develop code, periodically execute `fab build` and then use the local server to make sure things are going well. (Again, don't forget about the unit tests!)


<h3>Working with CodeKit</h3>
TimelineJS's initial development was done with [CodeKit](https://incident57.com/codekit/), so we maintain support for that. 

Basically, just use CodeKit's "add project" feature to add the TimelineJS directory as a project. You shouldn't need to make any other changes. CodeKit is configured to build files automatically to the /compiled/ directory. There are HTML files in that directory designed to use for testing your code changes. The author of this document does not use CodeKit much, so if these instructions need improvement, please file a GitHub issue or give us a pull request.
