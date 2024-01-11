#! /bin/bash
pm2 start /root/ddnwork/client/server.js --name "ddn-client" --output /root/ddnwork/client/logs/out.log --error /root/ddnwork/client/logs/err.log --time

pm2 list 