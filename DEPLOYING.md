#Deploying TimelineJS3

TimelineJS3 conforms to Knight Lab standard practices for deploying javascript libraries and "static" sites.

As such, to follow these instructions, you must have local copies of the [fablib](https://github.com/NUKnightLab/fablib) and [cdn.knightlab.com](https://github.com/NUKnightLab/cdn.knightlab.com) repositories checked out on your filesystem, "next to" your TimelineJS3 repository (that is, all three repositories should have the same parent directory).  Of course, you must also have authorization to write to the appropriate S3 buckets

#Deploying changes to the JavaScript

To deploy a new version of TimelineJS3, enter the following command:
```
  fab stage
```
You will be prompted for a version number. Choose a version number which is higher than any previously assigned. Use your discretion or ask advice about whether to increment the minor version or the patch version. (We generally follow [semantic versioning](http://semver.org/) principles.)

The `fab stage` process will compile the javascript and less files and copy assets to the appropriate directory in the `cdn.knightlab.com` repository.

> **Note:** this does *not* deploy the new code. There is one more step--you must switch to the CDN repository, commit the new code, and deploy the repository. See the end of this section for details. 

If you are ready for your newly deployed version to be automatically available to most TimelineJS3 users, execute:
```
  fab stage_latest
```
If you do this separately from `fab stage`, you will be asked which previous version should be copied into the `latest` directory in the `cdn` repository. If, as is common, you do them both at once, then fab carries the newly assigned version and doesn't ask. That is, executing `fab stage stage_latest` is a simple and efficient way to "release" a new version of the code and make it available for users who follow the default path for embedding timelines.

If you are working on changes which are still being actively tested, but you wish to deploy them for testing from the development website or otherwise publish them, execute:
```
  fab stage_dev
```
To put it all in one place, a typical deployment operation would look like this:
```
  fab stage stage_latest
  # (version number prompt and lots of console logging)
  cd ../cdn.knightlab.com
  git add app/libs/timelinejs3
  git commit -m "a coherent commit message"
  git pull
  git push
  fab deploy 
```


#Deploying changes to the website

To deploy changes to the website which explains TimelineJS3 and hosts the "authoring tool," use the command
```
fab deploy:prd
```

This will compile the website templates and push them to the S3 buckets. It is unrelated to the javascript, so can be done independently. Or, contrariwise, if you are intending to change both, be sure to follow both processes.

There is a variant for deploying a version of the site which can be reached on the open internet but which is not yet ready for regular public consumption:
```
fab deploy:stg
```
