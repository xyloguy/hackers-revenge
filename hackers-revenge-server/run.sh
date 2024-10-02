#!/bin/bash

bin/setup

## Run rails web server
bundle exec rails s -b [::] &

## Run sidekiq
bundle exec sidekiq -q default &

# Wait for any process to exit
wait

# Exit with status of process that exited first
exit $?