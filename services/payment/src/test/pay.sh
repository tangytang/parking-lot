#!/bin/sh

# API endpoint for payment service
API_URL="http://localhost:3002/api/payment/process"

# Payment data as an array
payments='
{"amount": 100000, "vehicleId": "CAR001"}
{"amount": 200000, "vehicleId": "CAR002"}
{"amount": 300000, "vehicleId": "CAR003"}
{"amount": 400000, "vehicleId": "TRUCK001"}
{"amount": 500000, "vehicleId": "TRUCK002"}
{"amount": 600000, "vehicleId": "BIKE001"}
{"amount": 700000, "vehicleId": "EV001"}
{"amount": 800000, "vehicleId": "HANDI001"}
'

# Loop through each payment and send the request
echo "$payments" | while IFS= read -r payment; do
  if [ -n "$payment" ]; then
    echo "Processing payment: $payment"
    curl -X POST "$API_URL" \
      -H "Content-Type: application/json" \
      -d "$payment"
    echo "\n"
  fi
done
