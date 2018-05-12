import iflixNumberList from '../shared/accountsNumber'
import accountList from '../../data/accounts'
import fs from 'fs'

const dataRootFile = '../lib/shared/';
const companyUsers = 'companyUsers.json';
const offersList = 'offersList.json';

function existInIflixRecord(number){
  const accountIndex = iflixNumberList.accountsNumber.indexOf(parseInt(number)); 
  return { isExist: (accountIndex === -1) ? false : true, accountIndex} ;
}

function isValidPeriod(period){
  return (period &&  period > 0)? true : false;
}

function addClientToPartner(number, partnerName, period, date){
  return new Promise((resolve, reject) => {
    try {
      const data = JSON.parse(fs.readFileSync(`${dataRootFile}${companyUsers}`, 'utf8'));

      if (data && data[number]) {
        if (data[number].expireDate > date) {
          resolve(false);
        }
      }

      const expireDate = new Date(new Date(date).setMonth(new Date(date).getMonth() + period)).toISOString();
      const newRecord = new Object();

      newRecord[number] = {
        partnerName,
        expireDate
      };

      fs.writeFileSync(`${dataRootFile}${companyUsers}`, JSON.stringify({ ...data, ...newRecord }))
      resolve(true);

    } catch(error) {
      console.error('error==>', error, ', number ==>', number)
      reject(error)
    }

  });
}

function addOffer(number, companyName, accountIndex, period){
  return new Promise((resolve, reject) => {
    try {
      const data = JSON.parse(fs.readFileSync(`${dataRootFile}${offersList}`, 'utf8'));
      const user = accountList.users[accountIndex]

      if (data && data.subscriptions[user.name]) {
        if (data.subscriptions[user.name][companyName]) {
          data.subscriptions[user.name][companyName] = data.subscriptions[user.name][companyName] + period;
        } else {

          data.subscriptions[user.name] = {
            ...data.subscriptions[user.name],
            [companyName]: period
          }
        }

      } else {
        data.subscriptions = {
          ...data.subscriptions,
          [user.name]: {
            [companyName]: period
          }
        }
      }

      fs.writeFileSync(`${dataRootFile}${offersList}`, JSON.stringify({ ...data }));
      resolve(true)
    } catch(error){
      console.error('error==>', error, ', number ==>', number)
      reject(error)
    }

  })
}

export default async function (req, res) {

  const { clientsList, companyName} = req.body;

  try {

    clientsList.forEach(async (client) => {
      if (isValidPeriod(client.period)) {

        const { isExist, accountIndex } = existInIflixRecord(client.number);
        
        if (isExist && await addClientToPartner(client.number, companyName, client.period, client.date)) {
          await addOffer(client.number, companyName, accountIndex, client.period);
        }  
      } 
    });

    res.status(200).send();
  } catch(error){
    console.error('error==>', error)
    res.status(400).send();
  }


}