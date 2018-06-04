#!/bin/bash
#!/bin/bash
export MOODLE_DOCKER_WWWROOT=/moodle-wwdata
export MOODLE_DOCKER_DB=pgsql
yum install -y telnet
rm -rf /moodle-wwdata/*
mv /tmp/new/* /moodle-wwdata
rm -rf /tmp/new/*
