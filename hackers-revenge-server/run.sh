#!/bin/bash

## Run rails web server
bin/start_web &

## Run sidekiq
bin/start_worker &

# Wait for any process to exit
wait

# Exit with status of process that exited first
exit $?