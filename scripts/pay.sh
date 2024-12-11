curl -X POST http://localhost:3002/api/payment/process \
-H "Content-Type: application/json" \
-d '{"amount": 100000000, "vehicleId": "ABC123"}'
