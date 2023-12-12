#! /bin/bash

service mysql start 

# 设置额外的参数
extraArgs="-e 1200 --db /root/ddnwork/ganacheDB"

# 启动 ganache-cli
nohup ganache-cli $extraArgs > ganache-log.txt &

truffle compile

truffle migrate --network advanced

pm2 start /root/ddnwork/client/server.js --name "ddn-client"

pm2 list 

