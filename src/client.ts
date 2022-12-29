import { randomInt } from 'crypto';
import { ClientError, createChannel, createClientFactory, waitForChannelReady } from 'nice-grpc';
import { deadlineMiddleware } from 'nice-grpc-client-middleware-deadline';
import { getHeapSpaceStatistics, getHeapStatistics } from 'v8';

import { TestClient, TestDefinition } from './pb/test.js';

const chan = createChannel('127.0.0.1:8000');
await waitForChannelReady(chan, new Date(Date.now() + 10_000));

const client: TestClient = createClientFactory()
    .use(deadlineMiddleware)
    .create(TestDefinition, chan, {
        '*': { deadline: 100 }
    });

const total = 2;
let deadlined = 0;

for (let i = 1; i < total + 1; i++) {
    console.log(i);

    try {
        await client.req({
            created: new Date(),
            text: Array.from(new Array(i), () =>
                Buffer.from(Array.from(new Array(100), () => randomInt(255))).toString('base64')
            )
        });
    } catch (err) {
        if (err instanceof ClientError && err.code === 4) {
            deadlined++;
        }
    }
}

console.log(`total: ${total}, deadline: ${deadlined}, normal: ${total - deadlined}`);

console.log(getHeapStatistics());
console.log(getHeapSpaceStatistics());
