#!/bin/sh

# Set the API URL. Use the `API_HOST` environment variable if available; default to "localhost".
API_HOST="${API_HOST:-localhost}"
API_URL="http://$API_HOST:3001/api/parking/park"

# List of vehicle requests (newline-separated)
vehicles='
{"vehicleId": "CAR001", "vehicleType": "compact"}
{"vehicleId": "CAR002", "vehicleType": "compact"}
{"vehicleId": "CAR003", "vehicleType": "compact"}
{"vehicleId": "TRUCK001", "vehicleType": "large"}
{"vehicleId": "TRUCK002", "vehicleType": "large"}
{"vehicleId": "BIKE001", "vehicleType": "motorcycle"}
{"vehicleId": "BIKE002", "vehicleType": "motorcycle"}
{"vehicleId": "BIKE003", "vehicleType": "motorcycle"}
{"vehicleId": "EV001", "vehicleType": "ev"}
{"vehicleId": "EV002", "vehicleType": "ev"}
{"vehicleId": "EV003", "vehicleType": "ev"}
'

# Loop through each vehicle and send a parking request
echo "$vehicles" | while read -r vehicle; do
  if [ -n "$vehicle" ]; then
    echo "Parking vehicle: $vehicle"
    curl -X POST "$API_URL" \
      -H "Content-Type: application/json" \
      -d "$vehicle"
    echo -e "\n"
  fi
done
