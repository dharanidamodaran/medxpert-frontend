const DeliveredOrders = () => {
    // Dummy Data
    const deliveredOrders = [
      { id: 5, customer: "Emily Clarke", medicine: "Metformin", quantity: 2 },
    ];
  
    return (
      <>
        <style>{`
          .orders-container {
            margin: 20px auto;
            max-width: 800px;
          }
  
          .order-card {
            background: #fff;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0px 2px 5px rgba(0,0,0,0.2);
            margin-bottom: 15px;
          }
        `}</style>
  
        <div className="orders-container">
          <h2>Delivered Orders</h2>
          {deliveredOrders.map(order => (
            <div className="order-card" key={order.id}>
              <h3>{order.customer}</h3>
              <p>Medicine: {order.medicine}</p>
              <p>Quantity: {order.quantity}</p>
            </div>
          ))}
        </div>
      </>
    );
  };
  
  export default DeliveredOrders;
  