#!/usr/bin/env bash
command -v aws >/dev/null 2>&1 || { echo >&2 "You must have the 'aws' command line tool installed."; exit 1; }

target="$1"

case $target in
  stg)
  BUCKET=timeline.knilab.com
  NPM_SCRIPT='build_dev'
    ;;
  prd)
  BUCKET=timeline.knightlab.com
  NPM_SCRIPT='build'
  ;;
  *)
  echo You must specify either 'prd' or 'stg' 1>&2
  exit 1
  ;;
esac

npm run $NPM_SCRIPT && aws s3 sync --only-show-errors --acl public-read _site s3://$BUCKET
if [ $? -ne 0 ]; then
  echo "Deployment failed." >&2
  exit 1
else
  echo "Deployment to s3://$BUCKET successful."
fi
