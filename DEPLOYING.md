# Deploying TimelineJS3

TimelineJS3 has two independent products which can be "deployed". The deployment process requires specific access permissions, so the instructions below are not expected to be meaningful outside of Knight Lab.

* The JavaScript Library
* The Website

To deploy updates to the javascript, you must have a local copy of the [cdn.knightlab.com](https://github.com/NUKnightLab/cdn.knightlab.com) repository checked out on your filesystem, "next to" your TimelineJS3 repository.

To deploy the website, or updates to the Wordpress plugin, you must have local copies of the [fablib](https://github.com/NUKnightLab/fablib) and, for the plugin, [TimelineJS-Wordpress-Plugin](https://github.com/NUKnightLab/TimelineJS-Wordpress-Plugin) repositories checked out on your filesystem, "next to" your TimelineJS3 repository.

"Next to" means that the TimelineJS3 repository and the other repositories should have the same parent directory. Of course, you must also have authorization to write to the appropriate S3 buckets, or, for the Wordpress plugin, to the Wordpress SVN server.

## Deploying changes to the JavaScript

Before beginning to deploy, make sure all changes are thoroughly tested. Update CHANGELOG to track changes and establish the release date for the version. Update package.json to the new version number.

Deploying the JavaScript library uses `npm` scripts defined in `package.json`. To deploy to the Knight Lab CDN, use the following scripts:

* npm run stage
* npm run stage_latest
* npm run stage_dev

To stage a new release of TimelineJS, use `npm run stage_latest`. This will ask you for a version number (tag), build the code, and copy it to the appropriate versioned subdirectory of the `cdn.knightlab.com` repository, as well as copying it to the `/latest/` directory.  In the rare case when you want to tag a version, but not change `latest`, use `npm run stage` although then copying that to `/latest/` is outside the scope of these tools. 

When a new version is deployed to the CDN, it should also be published to the npmjs repository. Do this by running `npm publish`.

> **Note:** this does *not* deploy the new code. There is one more step--you must switch to the CDN repository, commit the new code, and deploy the repository.

### Updating the Wordpress plugin

The TimelineJS plugin for Wordpress is distributed with a copy of the TimelineJS code. For now, use `fab stage_wp` to copy the relevant contents of `dist` to the Wordpress plugin. It's up to you to make sure the version in `dist` is what you want to copy. More details on deploying that change are in the plugin repository.


## Deploying changes to the website

To deploy changes to the website which explains TimelineJS3 and hosts the "authoring tool," use the command
```
fab deploy:prd
```

This will compile the website templates and push them to the S3 buckets. It is unrelated to the javascript, so can be done independently. Or, contrariwise, if you are intending to change both, be sure to follow both processes.

There is a variant for deploying a version of the site which can be reached on the open internet but which is not yet ready for regular public consumption:
```
fab deploy:stg
```
