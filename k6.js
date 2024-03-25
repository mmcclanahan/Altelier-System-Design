
import http from 'k6/http';
import { sleep } from 'k6';

///productDetailsName

export const options = {
  stages: [
    { duration: '5s', target: 0 },
    { duration: '5s', target: 10 },
    { duration: '5s', target: 100 }
    //{ duration: '10s', target: 1000 },
  ],
};

export default () => {
  const random = Math.floor(Math.random() * 1000000);
  http.get(`http://localhost:3001/productDetails/${random}`);
  sleep(1);
}