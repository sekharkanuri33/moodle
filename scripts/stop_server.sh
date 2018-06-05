#!/bin/bash
export MOODLE_DOCKER_WWWROOT=/moodle-wwdata
export MOODLE_DOCKER_DB=pgsql
rm -rf /moodle-wwdata
#isExistApp=`pgrep httpd`
#if [[ -n  $isExistApp ]]; then
#   echo "hello exit"
#fi
#isExistApp=`pgrep mysqld`
#if [[ -n  $isExistApp ]]; then
#   echo "hello exit"
#fi
