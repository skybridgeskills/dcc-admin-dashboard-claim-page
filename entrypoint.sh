#!/bin/bash
set -e

if [ -z "$S3_BUCKET" ]; then
    echo "Error: S3_BUCKET environment variable is not set"
    echo "Please set the S3_BUCKET environment variable to the name of your S3 bucket"
    exit 1
fi

echo "Starting S3 sync from bucket: $S3_BUCKET"

aws s3 sync s3://$S3_BUCKET/ /usr/share/nginx/brand/ --delete

echo "S3 sync completed"

exec "$@"
