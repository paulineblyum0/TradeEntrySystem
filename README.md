# TradeEntrySystem

This is a full stack project to create a banking Trade Entry System

## Frontend

Using React.js
1. Trade Entry Screen (app.js) - Where traders could submit there trades
2. Blotter (blotter.js) - Display of the trades

## Backend

Using Python and FastAPI
1. Validation.py - validated that trades satisfied the requirements to be successfully booked (see below)
2. trade_entry_system_database.py - connected to the SQL database (insert and recieve trades)
3. Main.py - RestAPI endpoints

## Database

PostgresSQL database

### Validation

There were several conditions that a trade had to satisfy before it could be admitted to the repository:
1. Quantity is an integer between 1 and 100000
2. Price is within a tolerance of 0.5 from the previous market price
3. Counterparty is allowed to trade the product
