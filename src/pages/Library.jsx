import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import StatCard, { StatGrid } from "../components/ui/StatCard";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import ActionMenu from "../components/ui/ActionMenu";
import Modal from "../components/ui/Modal";
import "../Style/ui.css";

const INITIAL_BOOKS = [
  {
    id: "BK-1001",
    title: "Concepts of Physics Vol 1",
    author: "H.C. Verma",
    isbn: "978-8177091877",
    category: "Science",
    totalCopies: 15,
    availableCopies: 11,
    status: "Available"
  },
  {
    id: "BK-1002",
    title: "NCERT Mathematics Class 10",
    author: "NCERT",
    isbn: "978-8174506344",
    category: "Academics",
    totalCopies: 30,
    availableCopies: 5,
    status: "Low Stock"
  },
  {
    id: "BK-1003",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0061120084",
    category: "Fiction",
    totalCopies: 8,
    availableCopies: 0,
    status: "Out of Stock"
  }
];

export function Library() {
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "Academics",
    copies: 5
  });

  const [issueData, setIssueData] = useState({
    borrowerName: "",
    borrowerType: "Student",
    dueDate: ""
  });

  const handleAddBook = (e) => {
    e.preventDefault();
    const copiesNum = parseInt(formData.copies) || 1;
    const newBook = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: formData.title,
      author: formData.author,
      isbn: formData.isbn || "N/A",
      category: formData.category,
      totalCopies: copiesNum,
      availableCopies: copiesNum,
      status: copiesNum > 0 ? "Available" : "Out of Stock"
    };
    setBooks([newBook, ...books]);
    setIsAddModalOpen(false);
    setFormData({ title: "", author: "", isbn: "", category: "Academics", copies: 5 });
  };

  const handleIssueBookSubmit = (e) => {
    e.preventDefault();
    if (!selectedBook || selectedBook.availableCopies <= 0) return;
    setBooks(
      books.map((b) => {
        if (b.id === selectedBook.id) {
          const avail = b.availableCopies - 1;
          return {
            ...b,
            availableCopies: avail,
            status: avail === 0 ? "Out of Stock" : avail < 3 ? "Low Stock" : "Available"
          };
        }
        return b;
      })
    );
    setIsIssueModalOpen(false);
    alert(`Issued "${selectedBook.title}" to ${issueData.borrowerName} until ${issueData.dueDate}`);
  };

  const columns = [
    { header: "Book Title", accessor: "title", render: (row) => <strong>{row.title}</strong> },
    { header: "Author", accessor: "author" },
    { header: "ISBN", accessor: "isbn" },
    { header: "Category", accessor: "category" },
    { header: "Total Copies", accessor: "totalCopies" },
    { header: "Available", accessor: "availableCopies" },
    { header: "Status", accessor: "status", render: (row) => <StatusBadge status={row.status} /> },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <ActionMenu
          actions={[
            {
              label: "Issue Book",
              icon: "📖",
              onClick: () => {
                setSelectedBook(row);
                setIsIssueModalOpen(true);
              }
            },
            {
              label: "Delete",
              icon: "🗑️",
              danger: true,
              onClick: () => setBooks(books.filter((b) => b.id !== row.id))
            }
          ]}
        />
      )
    }
  ];

  const totalCopies = books.reduce((acc, b) => acc + b.totalCopies, 0);
  const totalAvailable = books.reduce((acc, b) => acc + b.availableCopies, 0);
  const totalIssued = totalCopies - totalAvailable;

  return (
    <div style={{ padding: "24px" }}>
      <PageHeader
        breadcrumb="Resources"
        title="Library Management"
        description="Manage school book inventory, catalog, issues and returns."
        icon="📚"
        primaryAction={{
          label: "Add New Book",
          icon: "+",
          onClick: () => setIsAddModalOpen(true)
        }}
      />

      <StatGrid>
        <StatCard title="Total Catalog Titles" value={books.length} icon="📚" />
        <StatCard title="Total Copies" value={totalCopies} icon="📖" />
        <StatCard title="Books Issued" value={totalIssued} icon="📤" />
        <StatCard title="Available in Shelf" value={totalAvailable} icon="✅" />
      </StatGrid>

      <DataTable
        columns={columns}
        data={books}
        searchPlaceholder="Search book by title, author, ISBN..."
        filters={[
          { key: "category", label: "Category", options: [{ value: "Science", label: "Science" }, { value: "Academics", label: "Academics" }, { value: "Fiction", label: "Fiction" }] },
          { key: "status", label: "Status", options: [{ value: "Available", label: "Available" }, { value: "Low Stock", label: "Low Stock" }, { value: "Out of Stock", label: "Out of Stock" }] }
        ]}
      />

      {/* Add Book Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Book to Library"
        footer={
          <>
            <button className="ui-btn ui-btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
            <button className="ui-btn ui-btn-primary" onClick={handleAddBook}>Save Book</button>
          </>
        }
      >
        <form onSubmit={handleAddBook}>
          <div className="ui-form-group">
            <label>Book Title *</label>
            <input
              type="text"
              className="ui-form-control"
              placeholder="e.g. Higher Algebra"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="ui-form-row">
            <div className="ui-form-group">
              <label>Author Name *</label>
              <input
                type="text"
                className="ui-form-control"
                placeholder="Author Name"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>
            <div className="ui-form-group">
              <label>ISBN Number</label>
              <input
                type="text"
                className="ui-form-control"
                placeholder="978-..."
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              />
            </div>
          </div>

          <div className="ui-form-row">
            <div className="ui-form-group">
              <label>Category</label>
              <select
                className="ui-form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Academics">Academics</option>
                <option value="Science">Science</option>
                <option value="Fiction">Fiction</option>
                <option value="Reference">Reference</option>
              </select>
            </div>
            <div className="ui-form-group">
              <label>Initial Copies Count</label>
              <input
                type="number"
                className="ui-form-control"
                min="1"
                value={formData.copies}
                onChange={(e) => setFormData({ ...formData, copies: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Issue Book Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title={`Issue Book: ${selectedBook?.title || ""}`}
        footer={
          <>
            <button className="ui-btn ui-btn-secondary" onClick={() => setIsIssueModalOpen(false)}>Cancel</button>
            <button className="ui-btn ui-btn-primary" onClick={handleIssueBookSubmit}>Confirm Issue</button>
          </>
        }
      >
        <form onSubmit={handleIssueBookSubmit}>
          <div className="ui-form-group">
            <label>Borrower Name (Student/Staff) *</label>
            <input
              type="text"
              className="ui-form-control"
              placeholder="Enter student or teacher name..."
              value={issueData.borrowerName}
              onChange={(e) => setIssueData({ ...issueData, borrowerName: e.target.value })}
              required
            />
          </div>

          <div className="ui-form-row">
            <div className="ui-form-group">
              <label>Borrower Type</label>
              <select
                className="ui-form-control"
                value={issueData.borrowerType}
                onChange={(e) => setIssueData({ ...issueData, borrowerType: e.target.value })}
              >
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
            <div className="ui-form-group">
              <label>Return Due Date *</label>
              <input
                type="date"
                className="ui-form-control"
                value={issueData.dueDate}
                onChange={(e) => setIssueData({ ...issueData, dueDate: e.target.value })}
                required
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Library;