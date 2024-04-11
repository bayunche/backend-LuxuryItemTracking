#! /bin/bash
pm2 start ./client/server.js --name "ddn-client" --output ./client/logs/out.log --error ./client/logs/err.log --time

pm2 list 