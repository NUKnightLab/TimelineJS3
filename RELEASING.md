# Steps to cut a new release of the TimelineJS JavaScript library

The primary action for "releasing" TimelineJS is pushing a new version to `cdn.knightlab.com` but as of mid-2020, we also publish new versions to the `npmjs` package registry.

1. Before cutting a release, test thoroughly. Is this an opportunity to add new unit tests? Develop functional testing? If nothing else, `npm run compare` provides a way to see how some historical timelines would function with the new code. (Note that because of Google Sheets API changes, compare now compares back to the oldest release in the 3.8.x series instead of the pre-webpack version)
1. Update `package.json` to have the correct version.
1. Update `CHANGELOG` to indicate the release date. Hopefully you've been incrementally updating the file with relevant changes so that this is just editing the version "header"
1. Push all changes to GitHub
1. Execute `npm run stage_latest`, which creates both a versioned edition of the library and a copy of it in the `/latest/` directory of the CDN repository.
1. Execute `npm publish` (permissions required)
1. Change directories to the local copy of the `cdn.knightlab.com` repository, to which files were copied by the previous step
1. `git add app/libs/timeline3` to add the new version and updated `latest` to Git
1. Commit those changes with a message like "TimelineJS 3.x.x"
1. Push changes to GitHub
1. (probably) activate the virtual environment which can publish to the CDN
1. execute `fab deploy` to copy the new files up to the Knight Lab CDN
1. In an incognito/private browser, load timeline.knightlab.com and verify that the demo timeline works as expected

## Updating Wordpress Plugin

The Wordpress plugin bundles the TimelineJS code, so when a new version of the library is released, a new version of the plugin should also be published. This requires you to have a copy of [the plugin Git repository](https://github.com/NUKnightLab/TimelineJS-Wordpress-Plugin) locally in a directory adjacent to your copy of the TimelineJS repo.

1. In the TimelineJS3 repo, execute `fab stage_wp`
1. Change to the `TimelineJS-Wordpress-Plugin` directory
1. Update the plugin version in `knightlab-timeline.php` and `readme.txt`
1. Add all changed files to Github and commit them.
1. Execute `./deploy.sh`
1. When prompted, specify a commit message. If you're just updating the JS, you can say something like "Update to TimelineJS 3.x.x"



Note that releases of the JavaScript library are independent from updates to `timeline.knightlab.com`, which is deployed using `fab deploy:prd` in the python environment. 
