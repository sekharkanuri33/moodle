#!/bin/bash
#!/bin/bash
export MOODLE_DOCKER_WWWROOT=/moodle-wwdata
export MOODLE_DOCKER_DB=pgsql
yum install -y telnet
echo 3 > /proc/sys/vm/dropcaches
rm -rf /moodle-wwdata/*

