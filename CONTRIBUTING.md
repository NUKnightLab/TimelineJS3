# Contributing to TimelineJS

TimelineJS is open source software. Knight Lab appreciates contributions to the code and to the translations that support publishing timelines in other languages.

Please be aware that TimelineJS is designed to make digital storytelling simple. Historically, we've chosen not to pursue certain features which **could** be added to TimelineJS because we felt that they diverged from our design principles. If you have ambitious ideas for changes, you should start a conversation about the idea in [GitHub issues](https://github.com/NUKnightLab/TimelineJS3/issues) using the "feature proposal" label. 

Translations, bug fixes and features proposed and endorsed by Knight Lab should be contributed as [GitHub pull requests](https://help.github.com/articles/using-pull-requests/).

If you run into challenges trying to set up for contribution, post a [GitHub issue](https://github.com/NUKnightLab/TimelineJS3/issues).

## What contributions are welcome?

In general, it's probably a good idea to start a conversation in [a GitHub issue](https://github.com/NUKnightLab/TimelineJS3/issues) to verify that you're on the right path. This is even more important for new features, but even for bugs, you can avoid wasted effort by checking in with us first.

## Working with the Code

TimelineJS uses `node`/`npm`-based build tools for development and deployment. The previous python-based build system is obsolete and incompatible with the new model.

In order to clone or download the TimelineJS3 envrionment, use the following command:

    git clone https://github.com/NUKnightLab/TimelineJS3.git

The reference version of `node` used with these tools is `v13.9.0`, although we use `nvm`, and if the version in `.nvmrc` is different than this document, that version takes precedence. (It's unlikely to be an issue since only the dev/build tooling uses `node`.)

Once you've cloned the repository, run `npm install`. Assuming there are no errors, you should be able to run `npm start` and, after a few moments, a window should open in your default browser with a timeline.  

Timeline uses `webpack` for bundling, and uses the `webpack-dev-server` as part of the `start` script. This means that you should be able to make edits to the source javascript and less files and they will automatically compile, and the browser should reload.

### Testing

Timeline has a modest suite of tests implemented using `jest`. You can run them using `npm test`. We'd love to have more tests, but have not yet determined a good way to run unit tests against the visual details of timelines. (Let us know if you have suggestions!)  It's a good idea to occasionally run `npm test` to make sure you haven't messed anything up.

There's also a script, `npm run disttest`, which attempts to simulate the environment in which TimelineJS is deployed. When executed, it runs the `dist` script and then opens a web browser on the `embed` HTML page which is used with the builder on timeline.knightlab.com. There are small differences in how files are deployed compared to running the `disttest` so more substantial changes should be deployed to the `dev` path on `cdn.knightlab.com` and tested further there.

