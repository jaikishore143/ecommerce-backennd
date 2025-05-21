#!/bin/bash

# This script tests the Cricket Glow Express API endpoints

API_URL="http://localhost:5000/api"
ADMIN_TOKEN=""
CUSTOMER_TOKEN=""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to make API requests
function make_request() {
  local method=$1
  local endpoint=$2
  local data=$3
  local token=$4
  local auth_header=""

  if [ ! -z "$token" ]; then
    auth_header="-H \"Authorization: Bearer $token\""
  fi

  if [ "$method" == "GET" ]; then
    cmd="curl -s -X $method \"$API_URL$endpoint\" $auth_header"
  else
    cmd="curl -s -X $method \"$API_URL$endpoint\" -H \"Content-Type: application/json\" $auth_header -d '$data'"
  fi

  echo -e "${BLUE}$method $endpoint${NC}"
  eval $cmd | jq '.'
  echo ""
}

# Test health endpoint
echo -e "${GREEN}Testing health endpoint...${NC}"
curl -s "http://localhost:5000/health" | jq '.'
echo ""

# Login as admin
echo -e "${GREEN}Logging in as admin...${NC}"
admin_response=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cricketglow.com","password":"admin123"}')

echo $admin_response | jq '.'
ADMIN_TOKEN=$(echo $admin_response | jq -r '.data.accessToken')
echo ""

# Login as customer
echo -e "${GREEN}Logging in as customer...${NC}"
customer_response=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@example.com","password":"customer123"}')

echo $customer_response | jq '.'
CUSTOMER_TOKEN=$(echo $customer_response | jq -r '.data.accessToken')
echo ""

# Test categories endpoints
echo -e "${GREEN}Testing categories endpoints...${NC}"
make_request "GET" "/categories" "" ""

# Test products endpoints
echo -e "${GREEN}Testing products endpoints...${NC}"
make_request "GET" "/products" "" ""
make_request "GET" "/products/featured" "" ""

# Test authenticated endpoints
echo -e "${GREEN}Testing authenticated endpoints...${NC}"
make_request "GET" "/auth/me" "" "$CUSTOMER_TOKEN"
make_request "GET" "/orders/my-orders" "" "$CUSTOMER_TOKEN"

# Test admin endpoints
echo -e "${GREEN}Testing admin endpoints...${NC}"
make_request "GET" "/users" "" "$ADMIN_TOKEN"

echo -e "${GREEN}API tests completed!${NC}"
