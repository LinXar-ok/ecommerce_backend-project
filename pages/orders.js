import { Layout } from "@/components";
import axios from "axios";
import React, { useEffect, useState } from "react";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
    });
  }, []);
  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic_table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Paid</th>
            <th>Recipient</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <tr>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td className={order.paid ? "text-green-600" : "text-red-600"}>
                  {order.paid ? "YES" : "NO"}
                </td>
                <td>
                  {order.name} <br />
                  {order.email}
                  <br />
                  {order.city}, {order.postalCode} <br />
                  {order.streetAddress}
                  <br />
                  {order.country}
                </td>
                <td>
                  {order.line_items.map((line) => (
                    <>
                      {line.price_data.product_data.name} x{line.quantity}
                    </>
                  ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default OrdersPage;
