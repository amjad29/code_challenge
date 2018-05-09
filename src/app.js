import Express from 'express';
import bodyParser from 'body-parser';
//import grant from './api/grant';
//import revoke from './api/revoke';
const app = new Express();

function toCallBack(promise) {
  return function () {
    const done = arguments[arguments.length - 1];
    promise.apply(this, arguments).then(() => done()).catch((err) => done(err));
  };
}

app.use(bodyParser.json());

// app.put('/grant', toCallBack(grant));

// app.put('/revoke', toCallBack(revoke));

export default app;