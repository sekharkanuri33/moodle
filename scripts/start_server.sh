#!/bin/bash
export MOODLE_DOCKER_WWWROOT=/moodle-wwdata
export MOODLE_DOCKER_DB=pgsql
/usr/bin/compose down
cp /moodle/moodle-docker/config.docker-template.php $MOODLE_DOCKER_WWWROOT/config.php
/usr/bin/compose up -d
