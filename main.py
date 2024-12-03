from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from trade_entry_system_database import get_db_connection  # Import database connection
from validation import validate_trade  # Import the validation logic
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample data for dropdowns
traders = ["Trader A", "Trader B", "Trader C"]
books = ["Book1", "Book2", "Book3"]
products = ["IAG", "VODAFONE", "SHELL", "EASYJET", "BT GROUP"]
counterparties = ["HSBC", "BARCLAYS", "INVESTORPRO LTD", "ACME FUND"]

@app.get("/")
def read_root():
    """
    Root endpoint to confirm the API is running.
    """
    return {"message": "Trade Entry System API is running!"}

@app.post("/trade")
async def book_trade(request: Request):
    """
    Endpoint to book a trade after validation.
    """
    trade_data = await request.json()  # Parse raw JSON input from the request body
    print("Received Trade Data:", trade_data)

    # Validate trade using the validation module
    if not validate_trade(trade_data):
        raise HTTPException(status_code=400, detail="Trade validation failed. Check input fields.")

    # Insert trade into the database
    try:
        conn, cur = get_db_connection()  # Use the imported database connection
        query = """
        INSERT INTO trades (trader_name, trader_book, product, counterparty, direction, quantity, price, timestamp)
        VALUES (%s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
        """
        cur.execute(query, (
            trade_data["trader_name"],
            trade_data["trader_book"],
            trade_data["product"],
            trade_data["counterparty"],
            trade_data["direction"],
            trade_data["quantity"],
            trade_data["price"]
        ))
        conn.commit()  # Commit the transaction
        cur.close()
        conn.close()
        return {"message": "Trade booked successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@app.get("/blotter")
def get_blotter():
    """
    Endpoint to fetch all trades from the 'trades' table.
    """
    try:
        conn, cur = get_db_connection()  # Use the imported database connection
        query = "SELECT * FROM trades;"
        cur.execute(query)
        rows = cur.fetchall()
    

        trades = [
            {
                "id": row[0],
                "trader_name": row[1],
                "trader_book": row[2],
                "product": row[3],
                "counterparty": row[4],
                "direction": row[5],
                "quantity": row[6],
                "price": row[7],
                "timestamp": row[8]
            }
            for row in rows
        ]
        return {"trades": trades}
        cur.close()
        conn.close()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

# New endpoints for dropdown data
@app.get("/getTraderNameList")
async def get_trader_name_list():
    return traders

@app.get("/getTraderBookList")
async def get_trader_book_list():
    return books

@app.get("/getProductList")
async def get_product_list():
    return products

@app.get("/getCounterpartyList")
async def get_counterparty_list():
    return counterparties
