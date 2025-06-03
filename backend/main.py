from fastapi import FastAPI, Query, Path, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Union
from datetime import datetime, timedelta
import random
import uuid

app = FastAPI(title="Metrics Dashboard API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class User(BaseModel):
    id: str
    name: str
    avatar: Optional[str] = None

class Metric(BaseModel):
    value: float
    unit: str
    timestamp: str
    user_id: str

class Alert(BaseModel):
    id: str
    type: str  # 'warning', 'error', 'info'
    message: str
    timestamp: str
    user_id: str
    acknowledged: bool = False

class Task(BaseModel):
    id: str
    name: str
    start_time: str
    end_time: Optional[str] = None
    status: str  # 'running', 'completed', 'failed'
    user_id: str

# Mock data
users = [
    User(id="1", name="Rithika", avatar="https://i.pravatar.cc/150?u=rithika"),
    User(id="2", name="Alex", avatar="https://i.pravatar.cc/150?u=alex"),
    User(id="3", name="Maya", avatar="https://i.pravatar.cc/150?u=maya"),
    User(id="4", name="Javier", avatar="https://i.pravatar.cc/150?u=javier"),
]

# Helper functions
def get_random_value(min_val: float, max_val: float, decimals: int = 2) -> float:
    """Generate a random value between min and max with specified decimal places"""
    return round(random.uniform(min_val, max_val), decimals)

def get_current_timestamp() -> str:
    """Get current time as formatted string"""
    return datetime.now().strftime("%H:%M:%S")

def generate_metrics_for_user(user_id: str) -> Dict[str, Metric]:
    """Generate current metrics for a user"""
    return {
        "cpu": Metric(
            value=get_random_value(10, 90),
            unit="%",
            timestamp=get_current_timestamp(),
            user_id=user_id
        ),
        "memory": Metric(
            value=get_random_value(1, 16),
            unit="GB",
            timestamp=get_current_timestamp(),
            user_id=user_id
        ),
        "disk": Metric(
            value=get_random_value(10, 90),
            unit="%",
            timestamp=get_current_timestamp(),
            user_id=user_id
        ),
        "network": Metric(
            value=get_random_value(0, 100),
            unit="%",
            timestamp=get_current_timestamp(),
            user_id=user_id
        ),
        "temperature": Metric(
            value=get_random_value(35, 75),
            unit="°C",
            timestamp=get_current_timestamp(),
            user_id=user_id
        ),
    }

def generate_historical_data(metric_type: str, user_id: str, time_range: str = "1h") -> List[Metric]:
    """Generate historical metrics data for a specific type and user"""
    data = []
    now = datetime.now()
    
    # Determine parameters based on metric type
    if metric_type == "memory":
        min_val, max_val, unit = 1, 16, "GB"
    elif metric_type == "temperature":
        min_val, max_val, unit = 35, 75, "°C"
    else:  # cpu, disk, network
        min_val, max_val, unit = 10, 90, "%"
    
    # Determine number of data points based on time range
    if time_range == "1h":
        # 5-second intervals for 1 hour = 720 points
        points = 720
        interval = timedelta(seconds=5)
    elif time_range == "6h":
        # 30-second intervals for 6 hours = 720 points
        points = 720
        interval = timedelta(seconds=30)
    elif time_range == "24h":
        # 2-minute intervals for 24 hours = 720 points
        points = 720
        interval = timedelta(minutes=2)
    else:
        # Default to 1 hour
        points = 720
        interval = timedelta(seconds=5)
    
    # Generate data points
    for i in range(points):
        past_time = now - (points - i) * interval
        data.append(
            Metric(
                value=get_random_value(min_val, max_val),
                unit=unit,
                timestamp=past_time.strftime("%H:%M:%S"),
                user_id=user_id
            )
        )
    
    return data

def generate_alerts(user_id: str) -> List[Alert]:
    """Generate random alerts for a user"""
    alert_types = ["warning", "error", "info"]
    alert_messages = [
        "High CPU usage detected",
        "Memory approaching capacity",
        "Disk space running low",
        "Network congestion detected",
        "Temperature exceeding normal range",
    ]
    
    alerts = []
    now = datetime.now()
    
    # Generate 0-3 random alerts
    count = random.randint(0, 3)
    
    for i in range(count):
        alert_time = now - timedelta(seconds=random.randint(0, 3600))
        alerts.append(
            Alert(
                id=f"alert-{user_id}-{i}",
                type=random.choice(alert_types),
                message=random.choice(alert_messages),
                timestamp=alert_time.strftime("%H:%M:%S"),
                user_id=user_id,
                acknowledged=random.random() > 0.5
            )
        )
    
    return alerts

def generate_tasks(user_id: str) -> List[Task]:
    """Generate random tasks for a user"""
    task_names = [
        "System Backup",
        "Database Optimization",
        "Security Scan",
        "Update Installation",
        "Log Analysis",
    ]
    
    tasks = []
    now = datetime.now()
    
    # Generate 0-3 random tasks
    count = random.randint(0, 3)
    
    for i in range(count):
        start_time = now - timedelta(seconds=random.randint(0, 3600))
        
        # Some tasks might still be running
        is_running = random.random() > 0.7
        
        if is_running:
            end_time = None
            status = "running"
        else:
            end_time = (start_time + timedelta(seconds=random.randint(300, 1800))).strftime("%H:%M:%S")
            status = "completed" if random.random() > 0.2 else "failed"
        
        tasks.append(
            Task(
                id=f"task-{user_id}-{i}",
                name=random.choice(task_names),
                start_time=start_time.strftime("%H:%M:%S"),
                end_time=end_time,
                status=status,
                user_id=user_id
            )
        )
    
    return tasks

# API routes
@app.get("/")
async def root():
    return {"message": "Welcome to the Metrics Dashboard API"}

@app.get("/api/users", response_model=List[User])
async def get_users():
    """Get all users"""
    return users

@app.get("/api/users/{user_id}", response_model=User)
async def get_user(user_id: str = Path(..., description="The ID of the user to get")):
    """Get a specific user by ID"""
    for user in users:
        if user.id == user_id:
            return user
    raise HTTPException(status_code=404, detail="User not found")

@app.get("/api/metrics/current", response_model=Dict[str, Metric])
async def get_current_metrics(user_id: Optional[str] = Query(None, description="Filter metrics by user ID")):
    """Get current metrics, optionally filtered by user ID"""
    if user_id:
        # Check if user exists
        user_exists = any(user.id == user_id for user in users)
        if not user_exists:
            raise HTTPException(status_code=404, detail="User not found")
        return generate_metrics_for_user(user_id)
    else:
        # Return metrics for first user if no user specified
        return generate_metrics_for_user(users[0].id)

@app.get("/api/metrics/history/{metric_type}", response_model=List[Metric])
async def get_metrics_history(
    metric_type: str = Path(..., description="Type of metric (cpu, memory, disk, network, temperature)"),
    user_id: Optional[str] = Query(None, description="Filter metrics by user ID"),
    time_range: str = Query("1h", description="Time range (1h, 6h, 24h)")
):
    """Get historical metrics data for a specific type, optionally filtered by user ID and time range"""
    # Validate metric type
    valid_types = ["cpu", "memory", "disk", "network", "temperature"]
    if metric_type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Invalid metric type. Must be one of: {', '.join(valid_types)}")
    
    # Validate time range
    valid_ranges = ["1h", "6h", "24h"]
    if time_range not in valid_ranges:
        raise HTTPException(status_code=400, detail=f"Invalid time range. Must be one of: {', '.join(valid_ranges)}")
    
    if user_id:
        # Check if user exists
        user_exists = any(user.id == user_id for user in users)
        if not user_exists:
            raise HTTPException(status_code=404, detail="User not found")
        return generate_historical_data(metric_type, user_id, time_range)
    else:
        # Return data for first user if no user specified
        return generate_historical_data(metric_type, users[0].id, time_range)

@app.get("/api/alerts", response_model=List[Alert])
async def get_alerts(user_id: Optional[str] = Query(None, description="Filter alerts by user ID")):
    """Get alerts, optionally filtered by user ID"""
    if user_id:
        # Check if user exists
        user_exists = any(user.id == user_id for user in users)
        if not user_exists:
            raise HTTPException(status_code=404, detail="User not found")
        return generate_alerts(user_id)
    else:
        # Return alerts for first user if no user specified
        return generate_alerts(users[0].id)

@app.put("/api/alerts/{alert_id}/acknowledge")
async def acknowledge_alert(alert_id: str = Path(..., description="The ID of the alert to acknowledge")):
    """Acknowledge an alert"""
    # In a real app, this would update the alert in the database
    return {"message": f"Alert {alert_id} acknowledged"}

@app.get("/api/tasks", response_model=List[Task])
async def get_tasks(user_id: Optional[str] = Query(None, description="Filter tasks by user ID")):
    """Get tasks, optionally filtered by user ID"""
    if user_id:
        # Check if user exists
        user_exists = any(user.id == user_id for user in users)
        if not user_exists:
            raise HTTPException(status_code=404, detail="User not found")
        return generate_tasks(user_id)
    else:
        # Return tasks for first user if no user specified
        return generate_tasks(users[0].id)

@app.get("/api/export/metrics")
async def export_metrics(
    user_id: Optional[str] = Query(None, description="Filter metrics by user ID"),
    format: str = Query("csv", description="Export format (csv, json)")
):
    """Export metrics data, optionally filtered by user ID"""
    # In a real app, this would generate and return a file
    return {
        "message": f"Metrics data exported in {format} format",
        "user_id": user_id,
        "format": format
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)