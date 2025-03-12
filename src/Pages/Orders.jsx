import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Spinner, Alert, Card, Badge } from "react-bootstrap";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/allOrders`);
        setOrders(response.data.orders);
      } catch (err) {
        setError("Failed to fetch orders.");
        console.log("erro")
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger" className="text-center">{error}</Alert>;

  return (
    <div className="container my-4">
      <h2 className="mb-3">All Orders</h2>

      {orders.length > 0 ? (
        orders.map((order) => (
          <Card key={order._id} className="mb-3 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title>
                    Order #{order._id} 
                    <Badge bg={order.orderStatus === "Confirmed" ? "success" : "warning"} className="ms-2">
                      {order.orderStatus}
                    </Badge>
                  </Card.Title>
                  <Card.Text>
                    <strong>Amount:</strong> ₹{order.totalAmount} <br />
                    <strong>Payment:</strong> {order.paymentInfo.method} <br />
                    <strong>Ordered On:</strong> {new Date(order.createdAt).toLocaleDateString()}
                  </Card.Text>
                </div>
                <Link to={`/orders/${order._id}`} className="btn btn-primary btn-sm">
                  View Details
                </Link>
              </div>
            </Card.Body>
          </Card>
        ))
      ) : (
        <Alert variant="info" className="text-center">No Orders Found</Alert>
      )}
    </div>
  );
};

export default OrdersList;
