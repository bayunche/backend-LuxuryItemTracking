#! /bin/bash
pm2 start "n run 20.9.0 ./client/server.js "  --name "ddn-client" --output ./client/logs/out.log --error ./client/logs/err.log --time

pm2 list 