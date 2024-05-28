#!/bin/bash
preCommitFile='.git/hooks/pre-commit'
prePushFile='.git/hooks/pre-push'
gitFolder='.git'

if [ ! -d $gitFolder ]
then
    echo 'git not initialized'
else
    if [ -f $preCommitFile ] && [ -z $GITHUB_ACTIONS ]
    then
        rm $preCommitFile
    fi

    if [ -f $prePushFile ] && [ -z $GITHUB_ACTIONS ]
    then
        rm $prePushFile
    fi

    if [ ! -f $preCommitFile ] && [ -z $GITHUB_ACTIONS ]
    then
        curl https://thoughtworks.github.io/talisman/install.sh > ~/install-talisman.sh
        chmod +x ~/install-talisman.sh
        ~/install-talisman.sh pre-commit
        echo 'pre-commit talisman hook installed'
    fi

    if [ ! -f $prePushFile ] && [ -z $GITHUB_ACTIONS ]
    then
        curl https://thoughtworks.github.io/talisman/install.sh > ~/install-talisman.sh
        chmod +x ~/install-talisman.sh
        ~/install-talisman.sh pre-push
        echo 'pre-push talisman hook installed'
    fi
fi