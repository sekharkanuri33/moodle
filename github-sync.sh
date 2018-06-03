#!/bin/bash

### Courtesy: https://gist.github.com/sangeeths/9467061
MOODLE_BRANCH=${1:-MOODLE_34_STABLE}

printf "\n\nUpdating $MOODLE_BRANCH with updates from remote moodle core";

# Get the name of the current Git branch and then ensure that only
# feature branches are synced with github
CURRENT_BRANCH=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')

# Only push this update to the server if the current branch is the Master branch
if [ "${CURRENT_BRANCH}" != "master" ]
then
    if git config remote.sync.url > /dev/null; 
    then 
        :
    else
        printf "Remote not found - attempt creation"

        # Now add Github repo as a new remote in Bitbucket called "sync"
        git remote add sync git@github.com:moodle/moodle.git

        if git config remote.sync.url > /dev/null; 
        then
            :
        else
            printf "Remote could not be created"
            exit 1;
        fi
    fi

    if git branch --list $MOODLE_BRANCH > /dev/null;
    then
        if [ "${CURRENT_BRANCH}" != "${MOODLE_BRANCH}" ]
        then
            git checkout $MOODLE_BRANCH
        fi
        git pull sync $MOODLE_BRANCH
    else 
        # Setup a local branch called "github" track the "sync" remote's branch
        git branch --track $MOODLE_BRANCH sync/$MOODLE_BRANCH
    fi

    git push origin $MOODLE_BRANCH
    printf "$MOODLE_BRANCH has been updated with the latest updates from  remote moodle core"

    git checkout $CURRENT_BRANCH
else
    printf "Will not sync with master. Please create a feature branch and try again."
    exit 1
fi

printf "Process Complete\n\n"

read -p "Would you like to pull $MOODLE_BRANCH into the current branch? (Y/N)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    git pull origin $MOODLE_BRANCH
fi


