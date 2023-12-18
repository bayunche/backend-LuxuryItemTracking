#! /bin/bash

nohup geth --datadir ./node1/data --port 2001   --http --http.port 8548 --allow-insecure-unlock    --rpc.enabledeprecatedpersonal  > node1output.log 2>&1 &

nohup geth --datadir ./node2/data --port 2002  --authrpc.port 8560 --http --http.port 8549 --allow-insecure-unlock    --rpc.enabledeprecatedpersonal  > node2output.log 2>&1 &

nohup geth --datadir ./node3/data --port 2003 --authrpc.port 8559  --http --http.port 8550 --allow-insecure-unlock    --rpc.enabledeprecatedpersonal   > node3output.log 2>&1 &
