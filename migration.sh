#! /bin/bash

 service mysql start 

ganache-cli -e 1200 --db /root/ddnwork/ganacheDB

pm2 start /root/ddnwork/client/server.js --name "ddn-client"

pm2 list 

