# Mock API functions
def get_last_market_price(product):
    market_prices = {
        "IAG": 242.70,
        "VODAFONE": 71.24,
        "EASYJET": 516.50,
        "SHELL": 2551.00,
        "BT GROUP": 150.25
    }
    return market_prices.get(product, 0)

def can_counterparty_trade(counterparty, product):
    allowed_pairs = {
        ("HSBC", "IAG"): True,
        ("INVESTORPRO LTD", "VODAFONE"): True,
        ("ACME FUND" ,"EASYJET"): True,
        ("BARCLAYS", "SHELL"): True,
        ("HSBC", "BT GROUP"): True
    }
    return allowed_pairs.get((counterparty, product), False)

# Validation functions
def validate_quantity(quantity):
    return isinstance(quantity, int) and 1 <= quantity <= 100000
    

def validate_price(price, product):
    try:
        price = float(price)  # Convert price to float
    except ValueError:
        return False  # If conversion fails, return False
    
    last_price = get_last_market_price(product)
    if last_price is None:
        return False  # Invalid product
    return abs(price - last_price) <= 0.5

def validate_counterparty(counterparty, product):
    return can_counterparty_trade(counterparty, product)

# Combine all validations
def validate_trade(trade_data):
    quantity_valid = validate_quantity(trade_data["quantity"])
    price_valid = validate_price(trade_data["price"], trade_data["product"])
    counterparty_valid = validate_counterparty(trade_data["counterparty"], trade_data["product"])
    return quantity_valid and price_valid and counterparty_valid

