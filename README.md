# tartufo

Do you want to help improve this module? Open an [issue](https://github.com/CalogeroMandracchia/tartufo/issues)! Thanks! 

```js

    const web3 = await connect("ws://localhost:7545");

    const [ pathFolder, pathContract ] = [ 'contracts/', 'Example.sol'];

    const myContract = await compileDeploy(web3, pathFolder, pathContract, [], 6000000, 1);

    //that's it! Now you can call all your methods!
    myContract.methods.myMethod(123).call({ /* ... */};

```

With tartufo you can forget about compiling, migrating, ... 
You just need to specify the main contract and the folder containing all the others smart contracts required from the main one.

That's right, tartufo **will __automatically__ find all the __dependencies__!**

No more intermediate products, from *.sol directly to myContract of web3!!


## Installation

Tartufo is built upon two main npm modules:


[solc](https://www.npmjs.com/package/solc) 0.4.24+



[web3](https://www.npmjs.com/package/web3) 1.0.0-beta.34+

If you are on Windows you must have a toolchain for compiling C++.


I highly recommend using this great module that will do everything automatically:


[windows-build-tools](https://www.npmjs.com/package/windows-build-tools)


Finally simply install tartufo.

```sh
$ npm install tartufo --save
```
**Please** refer to this guide for web3 since I'm using the latest version:  [web3 1.0](http://web3js.readthedocs.io/en/1.0/index.html)

## API

Every function is a promise so it must be awaited.

```js
const { connect, compile, createContract, deploy, compileDeploy } = require("tartufo");


//socket can be WebSocket, HTTP or IPC
const web3 = await connect(socket);

//pathContract is the path of the main contract, it must be with the first letter uppercase.
//the folder containing the path must have all the *.sol imported from the main.
//output is an object representing the compiled source
const output = await compile(pathContract);

//web3 is valid instance, the one returned from the method connect(socket)
//jsonInterface is taken from: JSON.parse(output.contracts[keyContract].interface)
const smartContract = await createContract(web3, jsonInterface);

/*
contract: smartContract instance of web3
fromAccount: where the money comes from ;) - an address, like web3.eth.defaultAccount
data: the bytecode of the smartcontract, taken from output.contracts[keyContract].bytecode
args: optional argument to pass to the constructor when the smartContract is deployed
*/
const web3 = await deploy(contract, fromAccount, data, args=[], gas=6000000, gasPrice=1);

//when you are lazy just like me ;)
const myContract = await compileDeploy(web3, pathFolder, pathContract, args, gas, gasprice);
```

### Full example:

```js

const { connect, compileDeploy } = require('tartufo');

const main = async () => {
    try {
        const socket = "ws://localhost:7545";
        const web3 = await connect(socket);
        
        const [ pathFolder, pathContract ] = [ 'contracts/', 'Example.sol'];
        
        const myContract = await compileDeploy(web3, pathFolder, pathContract, [], 6000000, 1);

        const params = {
            from: web3.eth.defaultAccount,
            gas: 1000000},
            (error, result) => { /* ... */ }
        }

        myContract.methods.myMethod(123).call(params);

    } catch(err) {
        console.log(err);
    }
}

main();
```

#### Requirements

[Node.js](http://nodejs.org/) 6.3.1+


## License

[MIT](LICENSE)