# TradeEntrySystem

This is a full stack project to create a banking Trade Entry System

## Technologies Used

1. Frontend - React.js
2. Backend - Python, FastAPI
3. Database - PostgresSQL

## Validation

There were several conditions that a trade had to satisfy before it could be admitter to the repository (validation.py):
1. Quantity is an integer between 1 and 100000
2. Price is within a tolerance of 0.5 from the previous market price
3. Counterparty is allowed to trade the product
