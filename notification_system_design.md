---

## Stage 4: Network Sockets & Concurrency Bottlenecks

### 1. Connection Spikes Scenario (10,000 Concurrent Connections)
When 10,000 users connect simultaneously, a single-threaded Node.js event loop will experience memory exhaustion and delayed event-loop ticks due to handling socket handshake network buffers.

### 2. Resolution Strategies
* **Horizontal Scaling (Cluster Module)**: Utilize the Node.js native `cluster` module or a process manager like **PM2** to spawn multiple server instances matching the system's total CPU core count.
* **Reverse Proxy Load Balancing**: Position an **Nginx** container or an AWS Application Load Balancer in front of the application layer to terminate SSL certificates and balance incoming socket networks evenly using a Round-Robin algorithm.
* **Redis Adapter for Socket.io**: Integrate `@socket.io/redis-adapter` backed by an independent Redis cache instance. This ensures that when a socket notification is emitted, it synchronizes seamlessly across all independent running Node.js cluster server pods.

---

## Stage 5: Reliability & Failure Mitigation (Email Outages)

### 1. Identifying System Flaws in Batch Actions
Executing a looping bulk email broadcast synchronously inline inside an active HTTP request structure risks execution timeouts, blocking network paths, and incomplete deliveries if an external email SMTP provider crashes.

### 2. Enterprise Queue Architecture
To build a resilient fallback engine, we decouple the process using an asynchronous worker queue:

```text
[Express Controller] ➔ Enqueues Task ➔ [ BullMQ / Redis Queue ] ➔ [ Background Worker Engine ] ➔ Dispatches Emails
```

### 3. Concrete Resilience Steps
* **Asynchronous Task Offloading**: The Express app records notification metadata to the database, instantly pushes a payload job item to a **BullMQ/RabbitMQ** queue, and returns an immediate `202 Accepted` response status to the client app.
* **Automatic Retries with Exponential Backoff**: Configure the worker queue to listen for external email gateway error codes. If an exception triggers, the job rescheduled automatically (e.g., Retry 1 after 5s, Retry 2 after 25s, Retry 3 after 125s).
* **Dead Letter Queue (DLQ)**: If a specific user email continuously errors out after 5 retry attempts, isolate that job tracking metadata into a secondary storage container named a Dead Letter Queue for explicit inspection by system administrators.
