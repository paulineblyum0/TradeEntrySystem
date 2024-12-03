import React, { useState, useEffect } from "react";
import { Table, Form, Row, Col } from "react-bootstrap";
import axios from "axios";


const Blotter = () => {
    // State for trades and filters
    const [trades, setTrades] = useState([]);
    const [filters, setFilters] = useState({
        trader: "",
        book: "",
        product: "",
        counterparty: "",
    });

    // Simulated trades data 
    useEffect(() => {
        const fetchTrades = async () => {
            try {
                const response = await axios.get("http://localhost:8000/blotter");
                setTrades(response.data.trades); 
            } catch (error) {
                console.error("Error fetching trades:", error.response?.data || error.message);
                alert("Failed to fetch trades. Please try again.");
            }
        };

        fetchTrades();
        const interval = setInterval(fetchTrades, 30000); // Refresh every 30 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    // Handle filter input changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    // Filtered trades based on user inputs
    const filteredTrades = trades.filter((trade) => {
        return (
            (filters.trader === "" || trade.trader_name.toLowerCase().includes(filters.trader.toLowerCase())) &&
            (filters.book === "" || trade.trader_book.toLowerCase().includes(filters.book.toLowerCase())) &&
            (filters.product === "" || trade.product.toLowerCase().includes(filters.product.toLowerCase())) &&
            (filters.counterparty === "" || trade.counterparty.toLowerCase().includes(filters.counterparty.toLowerCase()))
        );
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Trade Blotter</h2>
            
            {/* Filters */}
            <Form className="mb-3">
                <Row>
                    <Col>
                        <Form.Control
                            type="text"
                            placeholder="Filter by Trader"
                            name="trader"
                            value={filters.trader}
                            onChange={handleFilterChange}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            type="text"
                            placeholder="Filter by Book"
                            name="book"
                            value={filters.book}
                            onChange={handleFilterChange}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            type="text"
                            placeholder="Filter by Product"
                            name="product"
                            value={filters.product}
                            onChange={handleFilterChange}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            type="text"
                            placeholder="Filter by Counterparty"
                            name="counterparty"
                            value={filters.counterparty}
                            onChange={handleFilterChange}
                        />
                    </Col>
                </Row>
            </Form>

            {/* Table */}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Trader</th>
                        <th>Book</th>
                        <th>Counterparty</th>
                        <th>Product</th>
                        <th>Direction</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTrades.map((trade, index) => (
                        <tr key={index}>
                            <td>{new Date(trade.timestamp).toLocaleTimeString()}</td>
                            <td>{trade.trader_name}</td>
                            <td>{trade.trader_book}</td>
                            <td>{trade.counterparty}</td>
                            <td>{trade.product}</td>
                            <td>{trade.direction}</td>
                            <td>{trade.quantity}</td>
                            <td>{typeof trade.price === 'number' ? trade.price.toFixed(2) : trade.price}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Blotter;
