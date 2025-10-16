import asyncio
import aiohttp
import time
from concurrent.futures import ThreadPoolExecutor

async def test_concurrent_registration():
    """Test concurrent registration with same username"""
    
    # Test data with same username
    user_data = {
        "name": "Test",
        "surname": "User", 
        "email": "test@example.com",
        "username": "testuser1",  # Same username
        "password": "password123",
        "confirm_password": "password123",
        "address": "Test City"
    }
    
    async def register_user(session, user_id):
        # Modify email to be unique per request
        user_data_copy = user_data.copy()
        user_data_copy["email"] = f"test{user_id}@example.com"
        
        try:
            async with session.post(
                "http://localhost:8000/users/", 
                json=user_data_copy
            ) as response:
                result = await response.json()
                return {
                    "user_id": user_id,
                    "status": response.status,
                    "response": result
                }
        except Exception as e:
            return {
                "user_id": user_id,
                "status": "error",
                "error": str(e)
            }
    
    # Send 10 concurrent requests
    async with aiohttp.ClientSession() as session:
        tasks = [register_user(session, i) for i in range(10)]
        results = await asyncio.gather(*tasks)
    
    # Analyze results
    successful = [r for r in results if r["status"] == 200]
    failed = [r for r in results if r["status"] != 200]
    
    print(f"Successful registrations: {len(successful)}")
    print(f"Failed registrations: {len(failed)}")
    
    # Check if any duplicate usernames were created
    if len(successful) > 1:
        print("❌ RACE CONDITION DETECTED: Multiple users with same username!")
    else:
        print("✅ No race condition detected")

# Run the test
asyncio.run(test_concurrent_registration())