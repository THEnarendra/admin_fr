import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Spinner, Alert, Card, Badge, Table, Button } from "react-bootstrap";
import api from "../api";

const OrderDetails = () => {
  const { id } = useParams(); // Get orderId from URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   const fetchOrderDetails = async () => {
  //     try {
  //       // console.log(`${api}/order/${id}`);
  //       // const response = await axios.get(`${api}/order/${id}`);
  //       console.log(`http://localhost:5000/api/v1/order/${id}`);
  //       const response = await axios.get(`http://localhost:5000/api/v1/order/${id}`);
  //       console.log("response")
  //       console.log(response.data.order);
  //       setOrder(response.data.order);
  //     } catch (err) {
  //       setError("Failed to load order details.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchOrderDetails();
  // }, [id]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // console.log(`${api}/order/${id}`);
        const response = await axios.get(`${api}/order/${id}`);
        console.log("Response:", response);
        if (response.data.success) {
          setOrder(response.data.order);
        } else {
          setError(response.data.message || "Failed to load order");
        }
      } catch (err) {
        console.error("API Error:", err);
        setError(err.response?.data?.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrderDetails();
  }, [id]);

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger" className="text-center">{error}</Alert>;
  if (!order) return null; // Handle case where order is not found

  return (
    <div className="container my-4">
      <h2>Order Details</h2>
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title>
            Order #{order._id}
            <Badge bg={order.orderStatus === "Confirmed" ? "success" : "warning"} className="ms-2">
              {order.orderStatus}
            </Badge>
          </Card.Title>
          <Card.Text>
            <strong>Customer:</strong> {order.customerId?.name} <br />
            <strong>Email:</strong> {order.customerId?.email} <br />
            <strong>Phone:</strong> {order.contactNumber} <br />
            <strong>Address:</strong>{" "}
            {`${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`}{" "}
            <br />
            <strong>Payment Method:</strong> {order.paymentInfo.method} <br />
            <strong>Total Amount:</strong> ₹{order.totalAmount} <br />
            <strong>Ordered On:</strong> {new Date(order.createdAt).toLocaleDateString()}
          </Card.Text>
        </Card.Body>
      </Card>

      <h4>Ordered Products</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td>
                {item.productId?.productName}
                {item.hasVariants && (
                  <ul>
                    {item.selectedVariants.map((variant, idx) => (
                      <li key={idx}>
                        {variant.variantName}: {variant.value} (₹{variant.price})
                      </li>
                    ))}
                  </ul>
                )}
              </td>
              <td>{item.quantity}</td>
              <td>₹{item.productId?.basePrice}</td>
              <td>₹{item.productId?.basePrice * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Link to="/orders" className="btn btn-secondary mt-3">
        Back to Orders
      </Link>
    </div>
  );
};

export default OrderDetails;