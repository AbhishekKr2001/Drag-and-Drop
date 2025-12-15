import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { GripVertical, X } from "lucide-react";
import "./App.css";

const FIELD_TYPE = "DRAGGABLE_FIELD";

/* ✅ Draggable reporting fields */
const otherItems = [
  { name: "calendar_year2", label: "Calendar Year2", section: "transaction" },
  { name: "fiscal_period", label: "Fiscal Period", section: "transaction" },
  { name: "output_metrics", label: "Output Metrics", section: "transaction" },
  { name: "developer_country", label: "Developer Country", section: "seller" },
  { name: "sap_vendor_id", label: "SAP Vendor ID", section: "seller" },
  { name: "developer_taid", label: "Developer TAID", section: "seller" }
];

/* ✅ Draggable Item Component */
const DraggableField = ({ field }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: FIELD_TYPE,
    item: field,
    collect: (monitor) => ({ isDragging: monitor.isDragging() })
  }));

  return (
    <div ref={drag} className={`drag-item ${isDragging ? "dragging" : ""}`}>
      <GripVertical size={18} className="icon" />
      <span>{field.label}</span>
    </div>
  );
};

/* ✅ Drop Zone Component */
const DropZone = ({ title, acceptedSection, fields, onDropField, onRemove }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: FIELD_TYPE,
    canDrop: (item) => item.section === acceptedSection,
    drop: (item) => onDropField(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }));

  return (
    <div
      ref={drop}
      className={`drop-zone ${
        isOver && canDrop ? "over" : isOver ? "invalid" : ""
      }`}
    >
      <h2>{title}</h2>

      {fields.length === 0 && <p className="empty-text">Drag a field here</p>}

      {fields.map((field) => (
        <div key={field.name} className="dynamic-box">
          <label>{field.label}</label>
          <input type="text" className="input-field" placeholder={field.label} />

          {/* ✅ Hide remove button for defaults */}
          {!field.default && (
            <button className="remove-btn" onClick={() => onRemove(field.name)}>
              <X size={14} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

/* ✅ Main App Component */
const App = () => {
  /* ✅ Add 1 default field in each section */
  const [transactionFields, setTransactionFields] = useState([
    { name: "transaction_id", label: "Transaction ID", section: "transaction", default: true }
  ]);

  const [sellerFields, setSellerFields] = useState([
    { name: "seller_name", label: "Seller Name", section: "seller", default: true }
  ]);

  /* ✅ Add dropped field */
  const handleTransactionDrop = (item) => {
    if (!transactionFields.some((f) => f.name === item.name)) {
      setTransactionFields((prev) => [...prev, item]);
    }
  };

  const handleSellerDrop = (item) => {
    if (!sellerFields.some((f) => f.name === item.name)) {
      setSellerFields((prev) => [...prev, item]);
    }
  };

  /* ✅ Remove only non-default fields */
  const removeTransactionField = (name) =>
    setTransactionFields((prev) =>
      prev.filter((f) => f.default || f.name !== name)
    );

  const removeSellerField = (name) =>
    setSellerFields((prev) =>
      prev.filter((f) => f.default || f.name !== name)
    );

  /* ✅ Remove already-added items from reporting list */
  const availableTransactionFields = otherItems.filter(
    (i) =>
      i.section === "transaction" &&
      !transactionFields.some((f) => f.name === i.name)
  );

  const availableSellerFields = otherItems.filter(
    (i) =>
      i.section === "seller" &&
      !sellerFields.some((f) => f.name === i.name)
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="page">
        <h1 className="title">Form Customizer</h1>

        <div className="layout">
          {/* ✅ LEFT: Transaction Info */}
          <div className="left-panel">
            <DropZone
              title="Transaction Info"
              acceptedSection="transaction"
              fields={transactionFields}
              onDropField={handleTransactionDrop}
              onRemove={removeTransactionField}
            />
          </div>

          {/* ✅ MIDDLE: Seller Info */}
          <div className="middle-panel">
            <DropZone
              title="Seller Info"
              acceptedSection="seller"
              fields={sellerFields}
              onDropField={handleSellerDrop}
              onRemove={removeSellerField}
            />
          </div>

          {/* ✅ RIGHT: Reporting Fields */}
          <div className="right-panel">
            <h2>Reporting Fields</h2>

            <h3 className="section-header">Transaction Reporting Fields</h3>
            {availableTransactionFields.length > 0 ? (
              availableTransactionFields.map((field) => (
                <DraggableField key={field.name} field={field} />
              ))
            ) : (
              <p className="complete-box">All added</p>
            )}

            <h3 className="section-header">Seller Reporting Fields</h3>
            {availableSellerFields.length > 0 ? (
              availableSellerFields.map((field) => (
                <DraggableField key={field.name} field={field} />
              ))
            ) : (
              <p className="complete-box">All added</p>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
