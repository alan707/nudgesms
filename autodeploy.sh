#!/bin/bash

rm -rf build/
git config --global user.email "alan.mond@gmail.com"
git config --global user.name "NudgeSMS Autodeploy"
env ALLOW_DIRTY=yes bundle exec rake deploy
