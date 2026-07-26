const axios = require('axios');
const http = require('http');
const https = require('https');

// Custom agent for connection pooling
const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 100 });

const API_URL = 'http://localhost:5000/api/health';
const CONCURRENCY_LEVELS = [10, 25, 50, 100];

async function runLoadTest(concurrency) {
  console.log(`\nStarting Load Test with ${concurrency} concurrent requests...`);
  const promises = [];
  const startTime = Date.now();
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < concurrency; i++) {
    promises.push(
      axios.get(API_URL, { httpAgent, timeout: 5000 })
        .then(() => { successCount++; })
        .catch(() => { errorCount++; })
    );
  }

  await Promise.allSettled(promises);
  const duration = Date.now() - startTime;
  
  console.log(`Results for ${concurrency} concurrent requests:`);
  console.log(`Time taken: ${duration}ms`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed/Timeout: ${errorCount}`);
  console.log(`Throughput: ${((successCount / duration) * 1000).toFixed(2)} req/sec`);
}

async function start() {
  for (const level of CONCURRENCY_LEVELS) {
    await runLoadTest(level);
    // Cool down
    await new Promise(r => setTimeout(r, 1000));
  }
}

start();
