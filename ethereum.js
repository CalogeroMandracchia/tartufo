const fs = require('fs');
const Web3 = require('web3');
const solc = require('solc');

const connect = async socket => {
    try {
        const web3 = new Web3(socket);
        console.log(`connected to ${socket}`);
        const accounts = await web3.eth.getAccounts();
        console.log("Accounts available:");
        accounts.map((value, key) => console.log(` ${key} -> ${value}`))
        const coinbase = await web3.eth.getCoinbase();
        web3.eth.defaultAccount = coinbase;
        console.log(`Coinbase: ${coinbase}`);
        console.log(`DefaultAccount: ${web3.eth.defaultAccount}`);
        return web3;
    } catch(err) {
        console.log(err);
    }
}

const compile = (pathContract) => {
    const _findImports = path => {
        console.log(`importing contract: ${path}`);
        const data = fs.readFileSync(path, 'utf8');
        return { contents: data };
    }
    const input = { [pathContract]: fs.readFileSync(pathContract, 'utf8')};
    const output = solc.compile({ sources: input }, 1, _findImports);
    return output;
}

const createContract = (web3, jsonInterface) => {
    const smartContract = new web3.eth.Contract(jsonInterface, web3.eth.defaultAccount);
    return smartContract;
}

const deploy = async (contract, fromAccount, data, args=[], gas=6000000, gasPrice=1) => {
    try {
        console.log(`deploying..`);

        const onSend =  (error, transactionHash) => { if(error) { console.log(`onSend error: ${error}`);} }
        const onError =  error => console.log(`onError: ${error}`);
        const onTxHash = transactionHash => console.log(`onTxHash: ${transactionHash}`);
        const onReceipt = receipt => console.log(`onReceipt: ${receipt.contractAddress}`);
        const onConfirmation = (confirmationNumber, receipt) => console.log(`onConfirmation: ${confirmationNumber}, ${receipt.blockNumber}`);
       
        const { options: { address } } = await contract.deploy({data: data, arguments: args})
            .send({from: fromAccount, gas: gas, gasPrice: gasPrice}, onSend)
            .on('error', onError)
            .on('transactionHash', onTxHash)
            .on('receipt', onReceipt)
            .on('confirmation', onConfirmation)
        console.log(`onResolve: ${address}`);
        console.log(`deployed in ${address}`);
        return address;
    } catch (err) {
        console.log(err);
    }
}

const compileDeploy = async (web3, pathFolder, pathContract, gas, gasPrice) => {
    try {
        const output = compile(`${pathFolder}${pathContract}`);
        const keyContract = `${pathFolder}${pathContract}:${pathContract.slice(0, -4)}`;
        const myContract = createContract(web3, JSON.parse(output.contracts[keyContract].interface));
        const addr = await deploy(myContract, web3.eth.defaultAccount, output.contracts[keyContract].bytecode, gas, gasPrice);
        myContract.options.address = addr;
        return myContract;
    } catch(err) {
        console.log(err)
    }
}

/* linking
const linker = require('solc/linker');
output.contracts["contracts/Uno.sol:Uno"].bytecode = linker.linkBytecode(output.contracts["contracts/Uno.sol:Uno"].bytecode, { 'SafeMath.sol': contractAddress })
*/

module.exports = {
    connect,
    compile,
    createContract,
    deploy,
    compileDeploy
}