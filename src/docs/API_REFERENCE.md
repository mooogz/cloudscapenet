# CloudScapeNet API Reference

## Base URL

```
https://cloudscapenet.example.com/api/v1
```

## Authentication

All API requests require Bearer token authentication:

```http
Authorization: Bearer <access_token>
```

### Getting an Access Token

```bash
curl -X POST https://cloudscapenet.example.com/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "your-client-id",
    "client_secret": "your-client-secret",
    "grant_type": "client_credentials"
  }'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

---

## Endpoints

### 1. Submit Query

Submit a natural language query to the CloudScapeNet agent for processing.

**Endpoint:** `POST /query`

**Request Body:**
```json
{
  "query": "Replicate data from Oracle to BigQuery in real-time",
  "user_id": "user-123",
  "metadata": {
    "source_system": "oracle",
    "target_system": "bigquery",
    "latency_requirement": "real-time"
  }
}
```

**Response (202 Accepted):**
```json
{
  "job_id": "job-abc123def456",
  "status": "queued",
  "created_at": "2026-01-14T10:30:00Z",
  "estimated_wait_time": 2,
  "webhook_url": "https://your-webhook.example.com/callback"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "invalid_query",
  "message": "Query must contain at least one operation verb",
  "request_id": "req-xyz789"
}
```

---

### 2. Get Job Status

Check the status of a submitted job.

**Endpoint:** `GET /job/{job_id}`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| job_id | string | Yes | Job ID returned from query submission |

**Response (200 OK):**
```json
{
  "job_id": "job-abc123def456",
  "status": "in_progress",
  "progress": 45,
  "current_step": 2,
  "total_steps": 5,
  "started_at": "2026-01-14T10:30:15Z",
  "estimated_completion": "2026-01-14T10:35:00Z",
  "agent_decision": {
    "goal": "data_replication",
    "selected_tools": [
      {
        "id": "oci_goldengate_capture",
        "name": "OCI GoldenGate Capture",
        "status": "executing",
        "progress": 60
      },
      {
        "id": "bigquery_ingest",
        "name": "BigQuery Data Load",
        "status": "waiting",
        "progress": 0
      }
    ]
  }
}
```

---

### 3. Get Job Results

Retrieve the final results and decision from a completed job.

**Endpoint:** `GET /job/{job_id}/results`

**Response (200 OK):**
```json
{
  "job_id": "job-abc123def456",
  "status": "completed",
  "final_decision": "EXECUTE",
  "confidence_score": 94.5,
  "reasoning": "All selected tools executed successfully with expected performance",
  "execution_summary": {
    "total_duration_ms": 5234,
    "tools_executed": 3,
    "tools_succeeded": 3,
    "tools_failed": 0,
    "fallbacks_triggered": 0
  },
  "tool_results": [
    {
      "tool_id": "oci_goldengate_capture",
      "tool_name": "OCI GoldenGate Capture",
      "success": true,
      "execution_time_ms": 1523,
      "data": {
        "cdc_enabled": true,
        "capture_group": "cg_oracle_to_bigquery",
        "source_records": 1250000,
        "status": "capturing_changes"
      }
    },
    {
      "tool_id": "oci_goldengate_delivery",
      "tool_name": "OCI GoldenGate Delivery",
      "success": true,
      "execution_time_ms": 2104,
      "data": {
        "delivery_active": true,
        "target_endpoint": "bigquery-project.dataset.table",
        "replication_lag_ms": 342,
        "status": "delivering"
      }
    }
  ],
  "next_actions": [
    "Monitor replication lag at https://console.example.com/monitoring",
    "Configure alerts for lag > 1 second",
    "Review dashboards in DataStudio"
  ]
}
```

---

### 4. Cancel Job

Cancel a running or queued job.

**Endpoint:** `DELETE /job/{job_id}`

**Response (200 OK):**
```json
{
  "job_id": "job-abc123def456",
  "status": "cancelled",
  "cancelled_at": "2026-01-14T10:33:00Z",
  "message": "Job cancelled successfully"
}
```

---

### 5. List Available Tools

Retrieve list of all available tools with their specifications.

**Endpoint:** `GET /tools`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | Filter by category (data_integration, time_series, etc.) |
| platform | string | Filter by supported platform (Oracle, MySQL, etc.) |
| min_reliability | number | Filter by minimum reliability percentage |

**Response (200 OK):**
```json
{
  "total": 32,
  "tools": [
    {
      "id": "oci_goldengate_capture",
      "name": "OCI GoldenGate Capture",
      "description": "Enable CDC on source database",
      "category": "data_integration",
      "endpoint": "https://goldengate-api.oracle.cloud/capture",
      "protocol": "REST",
      "latency": "real-time",
      "reliability": 99.95,
      "supports": ["Oracle", "MySQL", "PostgreSQL", "SQL Server"],
      "max_concurrent": 10,
      "parameters": [
        {
          "name": "source_db",
          "type": "string",
          "required": true,
          "description": "Connection string for source database"
        }
      ]
    },
    {
      "id": "horizondb_ingest",
      "name": "MS HorizonDB Time-Series Ingest",
      "description": "Ingest high-volume time-series data",
      "category": "time_series",
      "endpoint": "https://horizondb.microsoft.com/api/v1/ingest",
      "protocol": "REST",
      "latency": "real-time",
      "reliability": 99.99,
      "supports": ["Time-Series Data", "IoT Metrics"],
      "max_concurrent": 50
    }
  ]
}
```

---

### 6. Get Tool Details

Get detailed information about a specific tool.

**Endpoint:** `GET /tools/{tool_id}`

**Response (200 OK):**
```json
{
  "id": "horizondb_ingest",
  "name": "MS HorizonDB Time-Series Ingest",
  "description": "Ingest high-volume time-series data with adaptive compression",
  "category": "time_series",
  "endpoint": "https://horizondb.microsoft.com/api/v1/ingest",
  "protocol": "REST",
  "latency": "real-time",
  "reliability": 99.99,
  "supports": ["Time-Series Data", "IoT Metrics"],
  "max_concurrent": 50,
  "parameters": [
    {
      "name": "table_name",
      "type": "string",
      "required": true,
      "description": "Target HorizonDB table name"
    },
    {
      "name": "compression_level",
      "type": "string",
      "required": false,
      "description": "Compression strategy",
      "enum": ["none", "adaptive", "aggressive"]
    }
  ],
  "examples": {
    "basic": {
      "endpoint": "https://horizondb.microsoft.com/api/v1/ingest",
      "method": "POST",
      "body": {
        "table_name": "metrics",
        "time_column": "timestamp",
        "value_columns": ["temperature", "humidity"]
      }
    },
    "advanced": {
      "compression_level": "adaptive",
      "batch_size": 50000
    }
  },
  "performance": {
    "throughput": "millions_of_points/sec",
    "typical_latency_ms": 50,
    "max_concurrent": 50,
    "cost_per_million": 0.15
  }
}
```

---

### 7. Create Custom Workflow

Define and store a custom workflow for reuse.

**Endpoint:** `POST /workflows`

**Request Body:**
```json
{
  "name": "Oracle to BigQuery Pipeline",
  "description": "Real-time Oracle to BigQuery with metrics to HorizonDB",
  "enabled": true,
  "trigger": {
    "type": "manual",
    "schedule": null
  },
  "steps": [
    {
      "order": 1,
      "tool_id": "oci_goldengate_capture",
      "parameters": {
        "source_db": "oracle_prod",
        "capture_group": "cg_to_bigquery"
      }
    },
    {
      "order": 2,
      "tool_id": "oci_goldengate_delivery",
      "parameters": {
        "delivery_group": "dg_to_bigquery",
        "target_endpoint": "bigquery:project.dataset.table"
      }
    },
    {
      "order": 3,
      "tool_id": "horizondb_ingest",
      "parameters": {
        "table_name": "metrics",
        "compression_level": "adaptive"
      }
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "workflow_id": "wf-123abc",
  "name": "Oracle to BigQuery Pipeline",
  "created_at": "2026-01-14T10:35:00Z",
  "created_by": "user-123"
}
```

---

### 8. Execute Workflow

Execute a previously created workflow.

**Endpoint:** `POST /workflows/{workflow_id}/execute`

**Request Body:**
```json
{
  "parameters": {
    "source_db": "oracle_prod",
    "target_dataset": "analytics"
  }
}
```

**Response (202 Accepted):**
```json
{
  "job_id": "job-workflow-789xyz",
  "workflow_id": "wf-123abc",
  "status": "queued"
}
```

---

### 9. Stream Results (Server-Sent Events)

Stream real-time job execution updates.

**Endpoint:** `GET /job/{job_id}/stream`

**Response (200 OK with Content-Type: text/event-stream):**
```
data: {"event":"job_started","timestamp":"2026-01-14T10:30:15Z"}

data: {"event":"tool_started","tool_id":"oci_goldengate_capture","timestamp":"2026-01-14T10:30:16Z"}

data: {"event":"tool_progress","tool_id":"oci_goldengate_capture","progress":25,"timestamp":"2026-01-14T10:30:20Z"}

data: {"event":"tool_completed","tool_id":"oci_goldengate_capture","success":true,"execution_time_ms":1523,"timestamp":"2026-01-14T10:30:18Z"}

data: {"event":"job_completed","status":"completed","final_decision":"EXECUTE","timestamp":"2026-01-14T10:35:00Z"}
```

---

## Error Codes

| Status | Error Code | Description |
|--------|-----------|-------------|
| 400 | INVALID_QUERY | Query format invalid |
| 400 | INVALID_PARAMETERS | Required parameters missing |
| 401 | UNAUTHORIZED | Authentication failed |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Job or resource not found |
| 409 | CONFLICT | Job already exists or state conflict |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Server error |
| 503 | SERVICE_UNAVAILABLE | Service temporarily unavailable |

---

## Rate Limiting

CloudScapeNet API implements rate limiting:

- **Standard Tier**: 100 requests/minute
- **Premium Tier**: 1000 requests/minute
- **Enterprise Tier**: Custom limits

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1642153800
```

---

## Webhooks

Register webhooks to receive job completion notifications.

**Register Webhook:**
```bash
curl -X POST https://cloudscapenet.example.com/api/v1/webhooks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-webhook.example.com/callback",
    "events": ["job.completed", "job.failed"],
    "secret": "webhook-secret-key"
  }'
```

**Webhook Payload:**
```json
{
  "event": "job.completed",
  "timestamp": "2026-01-14T10:35:00Z",
  "job_id": "job-abc123def456",
  "status": "completed",
  "final_decision": "EXECUTE",
  "confidence_score": 94.5
}
```

---

## Code Examples

### Python Example

```python
import requests
import time

# Get access token
auth_response = requests.post(
    'https://cloudscapenet.example.com/auth/token',
    json={
        'client_id': 'your-client-id',
        'client_secret': 'your-client-secret',
        'grant_type': 'client_credentials'
    }
)
token = auth_response.json()['access_token']

# Submit query
headers = {'Authorization': f'Bearer {token}'}
response = requests.post(
    'https://cloudscapenet.example.com/api/v1/query',
    json={
        'query': 'Replicate data from Oracle to BigQuery in real-time',
        'metadata': {
            'source_system': 'oracle',
            'target_system': 'bigquery'
        }
    },
    headers=headers
)

job = response.json()
job_id = job['job_id']

# Poll for results
while True:
    status_response = requests.get(
        f'https://cloudscapenet.example.com/api/v1/job/{job_id}',
        headers=headers
    )
    status = status_response.json()
    
    if status['status'] in ['completed', 'failed']:
        break
    
    print(f"Progress: {status['progress']}%")
    time.sleep(2)

# Get final results
results = requests.get(
    f'https://cloudscapenet.example.com/api/v1/job/{job_id}/results',
    headers=headers
).json()

print(f"Decision: {results['final_decision']}")
print(f"Confidence: {results['confidence_score']}%")
```

### TypeScript Example

```typescript
import axios from 'axios';

interface QueryRequest {
  query: string;
  metadata?: Record<string, any>;
}

async function submitQuery(queryRequest: QueryRequest) {
  const token = await getAccessToken();
  
  const response = await axios.post(
    'https://cloudscapenet.example.com/api/v1/query',
    queryRequest,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  return response.data;
}

async function getJobResults(jobId: string) {
  const token = await getAccessToken();
  
  const response = await axios.get(
    `https://cloudscapenet.example.com/api/v1/job/${jobId}/results`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  return response.data;
}

// Usage
const job = await submitQuery({
  query: 'Replicate data from Oracle to BigQuery in real-time',
  metadata: {
    source_system: 'oracle',
    target_system: 'bigquery'
  }
});

// Poll for results
let results = await getJobResults(job.job_id);
while (results.status === 'in_progress') {
  await new Promise(resolve => setTimeout(resolve, 2000));
  results = await getJobResults(job.job_id);
}

console.log(`Decision: ${results.final_decision}`);
console.log(`Confidence: ${results.confidence_score}%`);
```

---

## SDK

Official SDKs available for:
- Python: `pip install cloudscapenet`
- TypeScript/JavaScript: `npm install cloudscapenet`
- Go: `go get github.com/cloudscapenet/sdk-go`
- Java: Maven Central Repository

---

*Last Updated: January 2026*
*API Version: v1*
*Status: Stable*
