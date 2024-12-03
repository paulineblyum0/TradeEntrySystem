import React, { useState, useEffect } from "react";
import { Tabs, Tab, Container, Row, Col, Form, Button } from "react-bootstrap";
import Blotter from "./blotter"; // Import Blotter
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";



const App = () => {
    const [key, setKey] = useState("tradeEntry"); // State for toggling tabs

    // State for trade entry system
    const [traders, setTraders] = useState([]);
    const [books, setBooks] = useState([]);
    const [products, setProducts] = useState([]);
    const [counterparties, setCounterparties] = useState([]);
    const [form, setForm] = useState({
        trader: "",
        book: "",
        product: "",
        counterparty: "",
        direction: "",
        quantity: "",
        price: "",
    });

    // Mock API calls to populate dropdowns
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [traderRes, bookRes, productRes, counterpartyRes] = await Promise.all([
                    axios.get("http://localhost:8000/getTraderNameList"),
                    axios.get("http://localhost:8000/getTraderBookList"),
                    axios.get("http://localhost:8000/getProductList"),
                    axios.get("http://localhost:8000/getCounterpartyList"),
                ]);
                setTraders(traderRes.data);
                setBooks(bookRes.data);
                setProducts(productRes.data);
                setCounterparties(counterpartyRes.data);
            } catch (error) {
                console.error("Error fetching dropdown data:", error.response?.data || error.message);
                alert("Failed to load dropdown data. Please try again.");
            }
        };
    
        fetchDropdownData();
    }, []);
    const handleChange = (e) => {
        // Update the form state based on input changes
        setForm({
            ...form, // Spread the existing state
            [e.target.name]: e.target.value, // Dynamically set the key-value pair
        });
    };
    const setDirection = (direction) => {
        setForm({
            ...form, // Preserve the existing form state
            direction: form.direction === direction ? "" : direction, // Toggle direction
        });
    };
    
    

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.direction) {
            alert("Please select a direction (Buy or Sell) before submitting.");
            return;
        }
        try {
            console.log("Form State Before Submission:", form);

            const formattedForm = {
                trader_name: form.trader,
                trader_book: form.book,
                product: form.product,
                counterparty: form.counterparty,
                direction: form.direction,
                quantity: parseInt(form.quantity, 10), // Ensure quantity is an integer
                price: parseFloat(form.price), // Ensure price is a float
            };
            
            console.log("Formatted Payload:", formattedForm);
            const response = await axios.post("http://localhost:8000/trade", formattedForm);
            alert("Trade submitted successfully!");
            setForm({
                trader: "",
                book: "",
                product: "",
                counterparty: "",
                direction: "",
                quantity: "",
                price: ""
            });
        } catch (error) {
            console.error("Error submitting trade:", error.response?.data || error.message);
            alert("Failed to submit trade. Please try again.");
        }
    }

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Trade Capture System</h1>

            {/* Tabs to Toggle Between Trade Entry and Blotter */}
            <Tabs
                id="trade-capture-tabs"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
                variant="pills"
                justify
            >
                {/* Trade Entry Tab */}
                <Tab eventKey="tradeEntry" title="Trade Entry">
                    <div className="mt-4">
                        <h2 className="text-center mb-4">Trade Entry</h2>
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Trader</Form.Label>
                                        <Form.Select
                                            name="trader"
                                            value={form.trader}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Trader</option>
                                            {traders.map((trader, index) => (
                                                <option key={index} value={trader}>
                                                    {trader}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Book</Form.Label>
                                        <Form.Select
                                            name="book"
                                            value={form.book}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Book</option>
                                            {books.map((book, index) => (
                                                <option key={index} value={book}>
                                                    {book}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Product</Form.Label>
                                        <Form.Select
                                            name="product"
                                            value={form.product}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Product</option>
                                            {products.map((product, index) => (
                                                <option key={index} value={product}>
                                                    {product}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Counterparty</Form.Label>
                                        <Form.Select
                                            name="counterparty"
                                            value={form.counterparty}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Counterparty</option>
                                            {counterparties.map((cp, index) => (
                                                <option key={index} value={cp}>
                                                    {cp}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Quantity</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="quantity"
                                            placeholder="Enter Quantity"
                                            value={form.quantity}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Price</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="price"
                                            placeholder="Enter Price"
                                            value={form.price}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col>
                                    <Button
                                        variant={
                                            form.direction === "Buy"
                                                ? "success"
                                                : "outline-success"
                                        }
                                        className="w-100"
                                        onClick={() => setDirection("Buy")}
                                    >
                                        Buy
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        variant={
                                            form.direction === "Sell"
                                                ? "danger"
                                                : "outline-danger"
                                        }
                                        className="w-100"
                                        onClick={() => setDirection("Sell")}
                                    >
                                        Sell
                                    </Button>
                                </Col>
                            </Row>
                            <Button variant="dark" type="submit" className="w-100">
                                Submit Trade
                            </Button>
                        </Form>
                    </div>
                </Tab>

                {/* Blotter Tab */}
                <Tab eventKey="blotter" title="Blotter">
                    <div className="mt-4">
                        
                        <Blotter />
                    </div>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default App;
