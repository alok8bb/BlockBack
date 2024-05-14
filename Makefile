-include .env
  
NETWORK_ARGS := --rpc-url $(SEPOLIA_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) -vvvv

deploy:
	@forge script script/DeployBlockBack.s.sol:DeployBlockBack $(NETWORK_ARGS)