import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import StatCard, { StatGrid } from "../components/ui/StatCard";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import ActionMenu from "../components/ui/ActionMenu";
import Modal from "../components/ui/Modal";
import "../Style/ui.css";

const INITIAL_ITEMS = [
  {
    id: "INV-101",
    name: "A4 Printing Paper Reams",
    category: "Stationery",
    stock: 120,
    unit: "Reams",
    unitPrice: 280,
    minStock: 20,
    status: "In Stock"
  },
  {
    id: "INV-102",
    name: "Whiteboard Dry Erase Markers (Blue)",
    category: "Classroom Supplies",
    stock: 12,
    unit: "Boxes",
    unitPrice: 150,
    minStock: 15,
    status: "Low Stock"
  },
  {
    id: "INV-103",
    name: "Basketball Size 7 Official",
    category: "Sports Goods",
    stock: 0,
    unit: "Pieces",
    unitPrice: 850,
    minStock: 5,
    status: "Out of Stock"
  },
  {
    id: "INV-104",
    name: "Chemistry Lab Glassware Set",
    category: "Lab Equipment",
    stock: 25,
    unit: "Sets",
    unitPrice: 1200,
    minStock: 5,
    status: "In Stock"
  }
];

export function Inventory() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "Stationery",
    stock: 50,
    unit: "Pieces",
    unitPrice: 100,
    minStock: 10
  });

  const handleAddItem = (e) => {
    e.preventDefault();
    const stockNum = parseInt(formData.stock) || 0;
    const minNum = parseInt(formData.minStock) || 10;
    const newItem = {
      id: `INV-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name,
      category: formData.category,
      stock: stockNum,
      unit: formData.unit,
      unitPrice: parseFloat(formData.unitPrice) || 0,
      minStock: minNum,
      status: stockNum === 0 ? "Out of Stock" : stockNum <= minNum ? "Low Stock" : "In Stock"
    };
    setItems([newItem, ...items]);
    setIsModalOpen(false);
    setFormData({ name: "", category: "Stationery", stock: 50, unit: "Pieces", unitPrice: 100, minStock: 10 });
  };

  const columns = [
    { header: "Item Name", accessor: "name", render: (row) => <strong>{row.name}</strong> },
    { header: "Category", accessor: "category" },
    { header: "Quantity in Stock", accessor: "stock", render: (row) => `${row.stock} ${row.unit}` },
    { header: "Unit Price", accessor: "unitPrice", render: (row) => `₹${row.unitPrice}` },
    { header: "Min Stock Alert", accessor: "minStock" },
    { header: "Status", accessor: "status", render: (row) => <StatusBadge status={row.status} /> },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <ActionMenu
          actions={[
            {
              label: "+ Restock Item",
              icon: "📦",
              onClick: () => {
                const addQty = prompt("Enter stock quantity to check-in:", "10");
                if (addQty) {
                  setItems(
                    items.map((i) => {
                      if (i.id === row.id) {
                        const newStk = i.stock + parseInt(addQty);
                        return {
                          ...i,
                          stock: newStk,
                          status: newStk > i.minStock ? "In Stock" : "Low Stock"
                        };
                      }
                      return i;
                    })
                  );
                }
              }
            },
            { label: "Delete Item", icon: "🗑️", danger: true, onClick: () => setItems(items.filter((i) => i.id !== row.id)) }
          ]}
        />
      )
    }
  ];

  const totalValue = items.reduce((sum, item) => sum + item.stock * item.unitPrice, 0);

  return (
    <div style={{ padding: "24px" }}>
      <PageHeader
        breadcrumb="Operations"
        title="Inventory & Asset Management"
        description="Track school assets, stationery supplies, lab equipment, and stock thresholds."
        icon="📦"
        primaryAction={{
          label: "Add New Item",
          icon: "+",
          onClick: () => setIsModalOpen(true)
        }}
      />

      <StatGrid>
        <StatCard title="Total Catalog Items" value={items.length} icon="📦" />
        <StatCard title="Stock Valuation" value={`₹${totalValue.toLocaleString()}`} icon="💰" />
        <StatCard title="Low Stock Alerts" value={items.filter((i) => i.status === "Low Stock").length} icon="⚠️" />
        <StatCard title="Out of Stock" value={items.filter((i) => i.status === "Out of Stock").length} icon="❌" />
      </StatGrid>

      <DataTable
        columns={columns}
        data={items}
        searchPlaceholder="Search inventory by item name or category..."
        filters={[
          { key: "category", label: "Category", options: [{ value: "Stationery", label: "Stationery" }, { value: "Classroom Supplies", label: "Classroom Supplies" }, { value: "Sports Goods", label: "Sports Goods" }, { value: "Lab Equipment", label: "Lab Equipment" }] },
          { key: "status", label: "Status", options: [{ value: "In Stock", label: "In Stock" }, { value: "Low Stock", label: "Low Stock" }, { value: "Out of Stock", label: "Out of Stock" }] }
        ]}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Inventory Item"
        footer={
          <>
            <button className="ui-btn ui-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="ui-btn ui-btn-primary" onClick={handleAddItem}>Save Item</button>
          </>
        }
      >
        <form onSubmit={handleAddItem}>
          <div className="ui-form-group">
            <label>Item Name *</label>
            <input
              type="text"
              className="ui-form-control"
              placeholder="e.g. Projector Replacement Lamp"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="ui-form-row">
            <div className="ui-form-group">
              <label>Category</label>
              <select
                className="ui-form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Stationery">Stationery</option>
                <option value="Classroom Supplies">Classroom Supplies</option>
                <option value="Sports Goods">Sports Goods</option>
                <option value="Lab Equipment">Lab Equipment</option>
                <option value="IT Assets">IT Assets</option>
              </select>
            </div>
            <div className="ui-form-group">
              <label>Unit Measure</label>
              <input
                type="text"
                className="ui-form-control"
                placeholder="Pieces, Boxes, Sets, Reams"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              />
            </div>
          </div>

          <div className="ui-form-row">
            <div className="ui-form-group">
              <label>Initial Stock Quantity *</label>
              <input
                type="number"
                className="ui-form-control"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>
            <div className="ui-form-group">
              <label>Unit Price (₹)</label>
              <input
                type="number"
                className="ui-form-control"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Inventory;