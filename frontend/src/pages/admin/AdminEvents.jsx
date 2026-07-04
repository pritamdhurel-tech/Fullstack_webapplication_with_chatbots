// src/pages/admin/AdminEvents.jsx
import { useState, useEffect } from "react";
import { buildApiUrl } from "../../hooks/useFetch";
import {
  PageHeader,
  Table,
  Tr,
  Td,
  EditBtn,
  DeleteBtn,
  Modal,
  FormField,
  Input,
  Textarea,
  Select,
  Alert,
} from "../../components/admin/AdminUI";

const EMPTY = { name: "", date: "", description: "", event_type: "In-person" };
const TYPES = ["In-person", "Online", "Hybrid"];

function fmtDate(iso) {
  return iso ? new Date(iso).toLocaleDateString("en-GB") : "—";
}

function toInputDate(iso) {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

export default function AdminEvents() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("admin_token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  async function load() {
    const res = await fetch(buildApiUrl("/api/events"));
    const data = await res.json();
    setItems(data.data ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setForm(EMPTY);
    setEditId(null);
    setModal("create");
  }
  function openEdit(item) {
    setForm({
      name: item.name,
      date: toInputDate(item.date),
      description: item.description,
      event_type: item.event_type ?? "In-person",
    });
    setEditId(item.id);
    setModal("edit");
  }
  function closeModal() {
    setModal(null);
    setError("");
  }
  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave() {
    if (!form.name || !form.date || !form.description) {
      setError("Name, date, and description are required.");
      return;
    }
    try {
      const url = editId
        ? buildApiUrl(`/api/events/${editId}`)
        : buildApiUrl("/api/events");
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          ...form,
          date: new Date(form.date).toISOString(),
        }),
      });
      if (!res.ok) throw new Error();
      closeModal();
      setSuccess(editId ? "Event updated." : "Event created.");
      load();
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Could not save event.");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this event?")) return;
    await fetch(buildApiUrl(`/api/events/${id}`), {
      method: "DELETE",
      headers,
    });
    setSuccess("Event deleted.");
    load();
    setTimeout(() => setSuccess(""), 3000);
  }

  return (
    <div>
      <PageHeader
        title="Events"
        subtitle="Manage upcoming events listed on the public site"
        action={
          <button
            className="btn-primary text-sm px-5 py-2"
            onClick={openCreate}
          >
            + Add event
          </button>
        }
      />
      <Alert type="success" message={success} />
      <Alert type="error" message={error && !modal ? error : ""} />

      <Table headers={["Name", "Date", "Type", "Actions"]}>
        {items.map((item) => (
          <Tr key={item.id}>
            <Td className="font-medium text-[#F0F0F5]">{item.name}</Td>
            <Td>{fmtDate(item.date)}</Td>
            <Td>
              <span
                className="text-[11px] px-2.5 py-1 rounded-full
                               bg-accent/10 text-accent border border-accent/25"
              >
                {item.event_type ?? "Event"}
              </span>
            </Td>
            <Td>
              <EditBtn onClick={() => openEdit(item)} />
              <DeleteBtn onClick={() => handleDelete(item.id)} />
            </Td>
          </Tr>
        ))}
      </Table>

      {modal && (
        <Modal
          title={modal === "create" ? "Add event" : "Edit event"}
          onClose={closeModal}
        >
          <Alert type="error" message={error} />
          <FormField label="Event name *">
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Event title"
            />
          </FormField>
          <FormField label="Date *">
            <Input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
            />
          </FormField>
          <FormField label="Type">
            <Select
              name="event_type"
              value={form.event_type}
              onChange={handleChange}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Description *">
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the event..."
            />
          </FormField>
          <div className="flex gap-3 justify-end mt-2">
            <button
              className="btn-ghost text-sm px-5 py-2"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="btn-primary text-sm px-5 py-2"
              onClick={handleSave}
            >
              {modal === "create" ? "Create" : "Save changes"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
