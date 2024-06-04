

# 主要技术栈


	node 
	Express.js 
	Sequelize
	 truffle
	 web3
	 ethers



# App端可查看以下仓库


[bayunche/fontend-LuxuryItemTracking- (github.com)](https://github.com/bayunche/fontend-LuxuryItemTracking-)





# 运行环境

```

node >= 20.9.0
yarn >= 1.22.21
pm2 
mysql >= 8.0.0

```

# 服务器端部署（以ubuntu22为例）


首先进入项目目录运行：

```bash
yarn install
```
然后进入node服务运行

```bash
cd client
yarn install 
```

node服务启动命令如下

```bash

pm2 start "n run 20.9.0 ./client/server.js "  --name "ddn-client" --output ./client/logs/out.log --error ./client/logs/err.log --time


```

区块链部署推荐使用geth进行部署，Ganache可能出现无法持久化数据的问题。

区块链搭建和部署可以参考我的博客的搭建手册。

[八云澈的blog (hasunmiku.top)](https://www.hasunmiku.top/home)

区块链部署方式：

```bash

nohup geth --datadir ./node1/data --port 2001 --authrpc.port 8558  --http --http.port 8548  --allow-insecure-unlock    --rpc.enabledeprecatedpersonal  --http.api "eth,net,web3,personal"  > node1output.log 2>&1 &

  

nohup geth --datadir ./node2/data --port 2002  --authrpc.port 8560 --http --http.port 8549 --allow-insecure-unlock    --rpc.enabledeprecatedpersonal --http.api "eth,net,web3,personal"   > node2output.log 2>&1 &

  

nohup geth --datadir ./node3/data --port 2003 --authrpc.port 8559  --http --http.port 8550 --allow-insecure-unlock    --rpc.enabledeprecatedpersonal  --http.api "eth,net,web3,personal"  > node3output.log 2>&1 &

yarn truffle migrate --network product
```

