# Maimai Queue Management API Documentation

This directory contains comprehensive API documentation for the Maimai Queue Management System.

## 📋 Files Overview

### `api-documentation.yaml`
**OpenAPI 3.0.3 Specification** - Complete API documentation in YAML format
- **Purpose**: Formal API specification for developers
- **Use Cases**: 
  - Generate client SDKs
  - API documentation websites
  - Contract testing
  - Integration with tools like Swagger UI

### `maimai-queue-api.postman_collection.json`
**Postman Collection** - Ready-to-use API testing collection
- **Purpose**: Interactive API testing and exploration
- **Features**:
  - Pre-configured requests for all endpoints
  - Automated test scripts
  - Environment variables for easy setup
  - Workflow examples

## 🚀 Quick Start

### Option 1: Using Swagger UI
1. Copy the content from `api-documentation.yaml`
2. Visit [Swagger Editor](https://editor.swagger.io/)
3. Paste the YAML content to view interactive documentation

### Option 2: Using Postman
1. Open Postman
2. Click "Import" → "Upload Files"
3. Select `maimai-queue-api.postman_collection.json`
4. Update the `base_url` variable to your server URL
5. Start testing!

## 🔧 Configuration

### Base URL Configuration
- **Development**: `http://localhost:3000/api`
- **Production**: Update to your production domain

### Environment Variables
Set these in Postman or your API client:
- `base_url`: Your API base URL
- `queue_item_id`: Auto-populated during testing

## 📊 API Overview

### Core Endpoints

| Category | Endpoint | Method | Description |
|----------|----------|---------|-------------|
| **Queue Management** | `/queue` | GET | Get all active queue items |
| | `/queue` | POST | Add new player(s) to queue |
| | `/queue/reorder` | PUT | Bulk reorder queue items |
| | `/queue/reset` | POST | Reset queue (daily completion) |
| **Player Management** | `/queue/{id}` | GET/PUT/DELETE | Individual player operations |
| | `/queue/{id}/position` | PUT | Update player position |
| **Analytics** | `/queue/stats` | GET | Queue statistics |
| | `/queue/history` | GET | Historical data |
| **Scheduler** | `/scheduler` | GET/POST | Manage automated tasks |
| | `/cron/complete-daily` | POST | Manual daily completion |
| **System** | `/cron/afk-exclusion` | GET/POST | AFK exclusion settings |

### Player Status Flow
```
waiting → processing → completed
   ↓           ↓
  afk ←→   cancelled
   ↓
waiting (return from AFK)
```

## 🎮 Key Features

### Queue Management
- **Single & Duo Players**: Support for individual and pair entries
- **Position Management**: Drag-and-drop reordering
- **AFK Handling**: Special status for away players
- **Real-time Updates**: Live queue status

### Automated Operations
- **Daily Completion**: Automatic 10 PM queue reset
- **Scheduler Control**: Enable/disable automation
- **AFK Exclusion**: Option to exclude AFK players from daily completion

### Analytics & History
- **Real-time Statistics**: Active players, wait times, completion rates
- **Historical Data**: Completed and cancelled entries
- **Debug Information**: System troubleshooting data

## 🧪 Testing Examples

### Basic Workflow
1. **Get Queue Status**: `GET /queue`
2. **Add Player**: `POST /queue` with player data
3. **Start Playing**: `PUT /queue/{id}` with status "processing"
4. **Complete**: `PUT /queue/{id}` with status "completed"

### AFK Workflow
1. **Mark AFK**: `PUT /queue/{id}` with status "afk"
2. **Return from AFK**: `PUT /queue/{id}` with status "waiting"

### Admin Operations
1. **Enable Scheduler**: `POST /scheduler` with action "enable"
2. **Configure AFK Exclusion**: `POST /cron/afk-exclusion`
3. **Manual Daily Reset**: `POST /cron/complete-daily`

## 🔐 Authentication

Currently, the API supports:
- **Open Access**: Most endpoints are publicly accessible
- **API Key Support**: Optional `X-API-Key` header for authenticated requests
- **Future Enhancement**: JWT authentication planned

## 📝 Response Formats

### Success Response
```json
{
  "id": 123,
  "name1": "Alice",
  "name2": "Bob",
  "status": "waiting",
  "position": 5,
  "joinedAt": "2025-08-05T14:30:00.000Z"
}
```

### Error Response
```json
{
  "error": "Queue item not found"
}
```

### Statistics Response
```json
{
  "totalActive": 15,
  "waiting": 12,
  "processing": 2,
  "afk": 1,
  "averageWaitTime": 25.5
}
```

## 🛠️ Integration Examples

### JavaScript/Node.js
```javascript
// Add player to queue
const response = await fetch('http://localhost:3000/api/queue', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name1: 'Alice',
    notes: 'First time playing'
  })
});
const player = await response.json();
```

### Python
```python
import requests

# Get queue status
response = requests.get('http://localhost:3000/api/queue')
queue_data = response.json()
print(f"Current queue has {len(queue_data['queue'])} players")
```

### cURL
```bash
# Add duo players
curl -X POST http://localhost:3000/api/queue \
  -H "Content-Type: application/json" \
  -d '{"name1":"Alice","name2":"Bob","notes":"Duo players"}'
```

## 🐛 Troubleshooting

### Common Issues
1. **Connection Refused**: Check if server is running on correct port
2. **404 Errors**: Verify API endpoint URLs
3. **400 Bad Request**: Check request body format and required fields
4. **Empty Queue**: Add players using POST /queue endpoint

### Debug Endpoints
- `GET /cron/debug` - System debug information
- `GET /scheduler` - Scheduler status
- `GET /queue/stats` - Queue statistics

## 📞 Support

For questions or issues:
1. Check the API documentation in `api-documentation.yaml`
2. Test endpoints using the Postman collection
3. Review server logs for error details
4. Open an issue on the GitHub repository

## 🔄 Version History

- **v1.0.0** - Initial API documentation
  - Complete OpenAPI 3.0.3 specification
  - Comprehensive Postman collection
  - All current endpoints documented

---

**Last Updated**: August 2025  
**API Version**: 1.0.0  
**Postman Collection Version**: 1.0.0
