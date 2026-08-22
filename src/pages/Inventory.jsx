import "../Style/Inventory.css";

function Inventory() {
  const inventoryItems = [
    {
      item: "Classroom Chairs",
      category: "Furniture",
      quantity: 120,
      available: 108,
      status: "Available",
    },
    {
      item: "School Desks",
      category: "Furniture",
      quantity: 80,
      available: 72,
      status: "Available",
    },
    {
      item: "Projector",
      category: "Electronics",
      quantity: 12,
      available: 10,
      status: "Available",
    },
    {
      item: "Whiteboard",
      category: "Classroom",
      quantity: 35,
      available: 30,
      status: "Available",
    },
    {
      item: "Computer",
      category: "Electronics",
      quantity: 50,
      available: 44,
      status: "Available",
    },
    {
      item: "Sports Kit",
      category: "Sports",
      quantity: 25,
      available: 18,
      status: "Low Stock",
    },
  ];

  return (
    <div className="inventory-page">

      {/* HEADER */}

      <div className="inventory-header">

        <div>
          <h1>📦 Inventory</h1>

          <p>
            Manage school equipment, furniture, stationery and other
            inventory items.
          </p>
        </div>

        <button className="inventory-add-btn">
          + Add Item
        </button>

      </div>


      {/* STATISTICS */}

      <div className="inventory-stats">

        <div className="inventory-stat-card">

          <div className="inventory-stat-icon">
            📦
          </div>

          <div>
            <span>Total Items</span>
            <strong>322</strong>
          </div>

        </div>


        <div className="inventory-stat-card">

          <div className="inventory-stat-icon">
            ✅
          </div>

          <div>
            <span>Available Items</span>
            <strong>282</strong>
          </div>

        </div>


        <div className="inventory-stat-card">

          <div className="inventory-stat-icon">
            ⚠️
          </div>

          <div>
            <span>Low Stock</span>
            <strong>18</strong>
          </div>

        </div>


        <div className="inventory-stat-card">

          <div className="inventory-stat-icon">
            🏷️
          </div>

          <div>
            <span>Categories</span>
            <strong>8</strong>
          </div>

        </div>

      </div>


      {/* INVENTORY CARD */}

      <div className="inventory-card">

        {/* CARD HEADER */}

        <div className="inventory-card-header">

          <div>
            <h2>Inventory Items</h2>

            <p>
              View and manage all school inventory.
            </p>
          </div>

          <div className="inventory-actions">

            <input
              type="text"
              placeholder="Search item..."
              className="inventory-search"
            />

            <select className="inventory-filter">
              <option>All Categories</option>
              <option>Furniture</option>
              <option>Electronics</option>
              <option>Classroom</option>
              <option>Sports</option>
              <option>Stationery</option>
            </select>

          </div>

        </div>


        {/* TABLE */}

        <div className="inventory-table-wrapper">

          <table className="inventory-table">

            <thead>

              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Total Quantity</th>
                <th>Available</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>


            <tbody>

              {inventoryItems.map((item, index) => (

                <tr key={index}>

                  <td>
                    <div className="inventory-item-name">
                      <div className="inventory-item-icon">
                        📦
                      </div>

                      <strong>
                        {item.item}
                      </strong>
                    </div>
                  </td>


                  <td>
                    <span className="inventory-category">
                      {item.category}
                    </span>
                  </td>


                  <td>
                    {item.quantity}
                  </td>


                  <td>
                    <strong>
                      {item.available}
                    </strong>
                  </td>


                  <td>

                    <span
                      className={
                        item.status === "Available"
                          ? "inventory-status available"
                          : "inventory-status low"
                      }
                    >
                      {item.status}
                    </span>

                  </td>


                  <td>

                    <button className="inventory-view-btn">
                      View
                    </button>

                    <button className="inventory-edit-btn">
                      Edit
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Inventory;