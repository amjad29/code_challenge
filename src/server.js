import app from './app';
import fs from 'fs'
import fetch from 'node-fetch';
import { copyAccountList} from '../lib/prepareData'

try {
  require('babel-polyfill');
} catch (ex) { }

const partnerList = ['amazecom', 'wondertel'];
const dataRootFile = '../data'


function lunchTheServer(){
  return new Promise(resolve => {
    app.listen('9999', (error) => {
      if (error) {
        console.log('error ==> ', error)
      } else {
        console.log(`info ==> 🌎  Listening on port 9999. Open up http://localhost:9999/ in your browser.`);
        resolve();
      }
    });
  });
}

function getPartnerRecords(){
  let dataList = fs.readdirSync(dataRootFile).map(file => file);
  
  return dataList.filter(fileName => {

    const splitArray = fileName.split('.');
    const length = splitArray.length;

    if (length > 1 && partnerList.indexOf(splitArray[0]) >= 0 && splitArray[length - 1] === 'json') {
      return true;
    }
  });
}

async function callRevockApi(revocationsList){
  await fetch('http://localhost:9999/revoke',
   { 
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
     body: JSON.stringify(revocationsList)
     });
     return;

}

async function callGrantApi(grantsList, companyName) {
  await fetch('http://localhost:9999/grant',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        clientsList: grantsList,
        companyName
      })
    });
  return;

}

async function applicationRun(){
  try{
    const server = await lunchTheServer();
    //await copyAccountList();
   
    const lists = getPartnerRecords();

    //console.log('lists==>', lists)
      
    lists.forEach(async (fileName) => {
      const data = JSON.parse(fs.readFileSync(`${dataRootFile}/${fileName}`, 'utf8'));
      const partner = fileName.split('.')[0];

      await callRevockApi(data.revocations, partner)
      await callGrantApi(data.grants, partner)    
    });


   
  }catch(error){

  }

}

applicationRun();


