import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Spinner, Alert, Card, Badge, Table, Button } from "react-bootstrap";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null); // Initialize as null (not "null")
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `https://framerang-backend.vercel.app/api/v1/order/${id}`
        );
        
        if (response.data.success && response.data.order) {
          setOrder(response.data.order);
        } else {
          setError(response.data.message || "Order not found");
          setOrder(null); // Explicitly set to null if no order
        }
      } catch (err) {
        console.error("API Error:", err);
        setError(
          err.response?.data?.message || "Failed to load order details"
        );
        setOrder(null); // Ensure order is null on error
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  // Debug: Log the order data
  useEffect(() => {
    if (order) {
      console.log("Order Data:", order);
    }
  }, [order]);

  // Loading state
  if (loading) {
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  }

  // Error state
  if (error) {
    return <Alert variant="danger" className="text-center">{error}</Alert>;
  }

  // Order not found state
  if (!order || !order._id) {
    return <Alert variant="warning" className="text-center">Order not found</Alert>;
  }

  // Format date and time
  const orderDate = new Date(order.createdAt);
  const formattedDate = orderDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Calculate item price based on selected variants
  const calculateItemPrice = (item) => {
    if (item.hasVariants && item.selectedVariants?.length > 0) {
      return item.selectedVariants.reduce(
        (sum, variant) => sum + (variant.variantPrice || 0),
        0
      );
    }
    return item.price || 0; // Fallback to item.price if no variants
  };

  // Calculate item subtotal (price × quantity)
  const calculateItemSubtotal = (item) => {
    return calculateItemPrice(item) * (item.quantity || 1);
  };

  return (
    <div className="container my-4">
      <h2>Order Details</h2>
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title>
            Order #{order.orderId}
            <Badge
              bg={
                order.orderStatus === "Confirmed"
                  ? "success"
                  : order.orderStatus === "Cancelled"
                  ? "danger"
                  : order.orderStatus === "Delivered"
                  ? "primary"
                  : "warning"
              }
              className="ms-2"
            >
              {order.orderStatus}
            </Badge>
          </Card.Title>
          <Card.Text>
            <strong>Customer:</strong> {order.customer?.name || "N/A"} <br />
            <strong>Email:</strong> {order.customer?.email || "N/A"} <br />
            <strong>Phone:</strong> {order.customer?.contactNumber || "N/A"} <br />
            <strong>Address:</strong>{" "}
            {order.customer?.shippingAddress
              ? `${order.customer.shippingAddress.street || ""}, ${
                  order.customer.shippingAddress.city || ""
                }, ${order.customer.shippingAddress.state || ""} - ${
                  order.customer.shippingAddress.pincode || ""
                }`
              : "N/A"}{" "}
            <br />
            <strong>Payment Method:</strong> {order.paymentInfo?.method || "N/A"} <br />
            <strong>Payment Status:</strong> {order.paymentInfo?.status || "N/A"} <br />
            <strong>Ordered On:</strong> {formattedDate}
          </Card.Text>
        </Card.Body>
      </Card>

      <h4>Ordered Products</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>SKU</th>
            <th>Variants</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item, index) => {
            const itemPrice = calculateItemPrice(item);
            const itemSubtotal = calculateItemSubtotal(item);

            return (
              <tr key={`${item.productId}-${index}`}>
                <td>{index + 1}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        marginRight: "10px",
                      }}
                    />
                    {item.name}
                  </div>
                </td>
                <td>{item.sku || "N/A"}</td>
                <td>
                  {item.hasVariants && item.selectedVariants?.length > 0 ? (
                    <ul className="list-unstyled mb-0">
                      {item.selectedVariants.map((variant, idx) => (
                        <li key={idx}>
                          <small>
                            {variant.variantName}: {variant.value} (₹
                            {variant.variantPrice})
                          </small>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <small>No variants</small>
                  )}
                </td>
                <td>{item.quantity}</td>
                <td>₹{itemPrice.toFixed(2)}</td>
                <td>₹{itemSubtotal.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <div className="row justify-content-end mt-4">
        <div className="col-md-4">
          <Table bordered>
            <tbody>
              <tr>
                <th>Subtotal</th>
                <td className="text-end">₹{order.totals?.subtotal?.toFixed(2) || "0.00"}</td>
              </tr>
              <tr>
                <th>Shipping</th>
                <td className="text-end">₹{order.totals?.shipping?.toFixed(2) || "0.00"}</td>
              </tr>
              <tr>
                <th>Tax</th>
                <td className="text-end">₹{order.totals?.tax?.toFixed(2) || "0.00"}</td>
              </tr>
              <tr className="fw-bold">
                <th>Grand Total</th>
                <td className="text-end">₹{order.totals?.grandTotal?.toFixed(2) || "0.00"}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <Link to="/orders" className="btn btn-secondary">
          Back to Orders
        </Link>
        {order.trackingId && (
          <Button variant="info" href={`/track-order/${order.trackingId}`}>
            Track Order
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;