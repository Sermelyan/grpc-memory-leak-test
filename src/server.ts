import { setTimeout } from 'timers/promises';

import { createServer } from 'nice-grpc';

import { once } from 'events';
import { Ping, Pong, TestDefinition, TestServiceImplementation } from './pb/test.js';

class SImpl implements TestServiceImplementation {
    async req(request: Ping): Promise<Pong> {
        if (request.text.length % 2 === 0) {
            await setTimeout(1000);
        }
        return { accepted: new Date() };
    }
}

const s = createServer();
s.add(TestDefinition, new SImpl());
try {
    await s.listen('127.0.0.1:8000');
    await Promise.race([once(process, 'SIGINT'), once(process, 'SIGTERM')]);
    await s.shutdown();
} catch (err) {
    console.error(err);
    s.forceShutdown();
}
