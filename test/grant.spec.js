import chai from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

const { expect } = chai;

let result,app;

before(() => {
  app = proxyquire('../app',{
    
  });
});