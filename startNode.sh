#! /bin/bash

geth --datadir ./ddnNode/node2/data --port 2002 --authrpc.port 8549 --authrpc.port 8548 --miner.etherbase="0xBBF11088Ef7Da563F836d52c24C2D88546568496"

geth --datadir ./ddnNode/node1/data --port 2001 --authrpc.port 8550 --authrpc.port 8547 --miner.etherbase="0x7600A6e5307cC17Ef8CbFcE0F5D356274818745f" 