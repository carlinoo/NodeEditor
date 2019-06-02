# NodeEditor
This is a small NodeJS web editor that runs on any Linux/MacOS device. It was originally built to run on a RaspberryPi, and use it from any other device on the same network to run quick and small scripts to test things. 

![Screenshot](https://i.ibb.co/nCpTYPP/192-168-1-8-5432-1.png)
## Install
To get started, clone this repository. Then `cd` in it, and run the following commands. It is assumed you have Node installed.
```bash
npm install
cd files
npm install
cd ..
node server.js
```

## How to
You will see the port listed on the output, so go to your localhost on that port (`http://localhost:<<PORT>>`). You will see the web editor appear. You can start creating files, and running your programs. The output of each program is shown on the right panel.

## Modules
A few modules have been pre-installed by default, so that you don't need to configure anything. The list:  
`@hapi/joi`  
`commander`  
`gm`  
`lodash`  
`moment`  
`nodemailer`  
`request`  
`socket.io`  
  
If you want to install more, then do the following from the main project directory:
```bash
cd files
npm i --save <<MODULE_NAME>>
cd ..
``` 
  

