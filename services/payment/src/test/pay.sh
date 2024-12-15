#!/bin/sh

# Set the API URL. Use the `API_HOST` environment variable if available; default to "localhost".
API_HOST="${API_HOST:-localhost}"
API_URL="http://$API_HOST:3002/api/payment/process"

# Payment data as an array
payments='
{"amount": 100000, "vehicleId": "CAR001", "paymentMethod": "CREDIT_CARD"}
{"amount": 200000, "vehicleId": "CAR002", "paymentMethod": "CREDIT_CARD"}
{"amount": 300000, "vehicleId": "CAR003", "paymentMethod": "CREDIT_CARD"}
{"amount": 400000, "vehicleId": "TRUCK001", "paymentMethod": "EZ_LINK"}
{"amount": 500000, "vehicleId": "TRUCK002", "paymentMethod": "EZ_LINK"}
{"amount": 600000, "vehicleId": "BIKE001", "paymentMethod": "EZ_LINK"}
{"amount": 700000, "vehicleId": "EV001", "paymentMethod": "EZ_LINK"}
{"amount": 800000, "vehicleId": "HANDI001", "paymentMethod": "EZ_LINK"}
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
