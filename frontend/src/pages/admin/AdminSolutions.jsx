// src/pages/admin/AdminSolutions.jsx
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
  Alert,
} from "../../components/admin/AdminUI";

const EMPTY = { title: "", description: "", icon: "", tag: "" };

export default function AdminSolutions() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null); // null | 'create' | 'edit'
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
    const res = await fetch(buildApiUrl("/api/solutions"));
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
      title: item.title,
      description: item.description,
      icon: item.icon ?? "",
      tag: item.tag ?? "",
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
    if (!form.title || !form.description) {
      setError("Title and description are required.");
      return;
    }
    try {
      const url = editId
        ? buildApiUrl(`/api/solutions/${editId}`)
        : buildApiUrl("/api/solutions");
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      closeModal();
      setSuccess(editId ? "Solution updated." : "Solution created.");
      load();
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Could not save solution.");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this solution?")) return;
    await fetch(buildApiUrl(`/api/solutions/${id}`), {
      method: "DELETE",
      headers,
    });
    setSuccess("Solution deleted.");
    load();
    setTimeout(() => setSuccess(""), 3000);
  }

  return (
    <div>
      <PageHeader
        title="Solutions"
        subtitle="Manage the software solutions displayed on the public site"
        action={
          <button
            className="btn-primary text-sm px-5 py-2"
            onClick={openCreate}
          >
            + Add solution
          </button>
        }
      />

      <Alert type="success" message={success} />
      <Alert type="error" message={error && !modal ? error : ""} />

      <Table headers={["Title", "Tag", "Description", "Actions"]}>
        {items.map((item) => (
          <Tr key={item.id}>
            <Td className="font-medium text-[#F0F0F5]">
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.title}
            </Td>
            <Td>
              {item.tag && (
                <span
                  className="text-[11px] px-2.5 py-1 rounded-full
                                 bg-accent/10 text-accent border border-accent/25"
                >
                  {item.tag}
                </span>
              )}
            </Td>
            <Td className="max-w-xs truncate">{item.description}</Td>
            <Td>
              <EditBtn onClick={() => openEdit(item)} />
              <DeleteBtn onClick={() => handleDelete(item.id)} />
            </Td>
          </Tr>
        ))}
      </Table>

      {modal && (
        <Modal
          title={modal === "create" ? "Add solution" : "Edit solution"}
          onClose={closeModal}
        >
          <Alert type="error" message={error} />
          <FormField label="Title *">
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Process Automation"
            />
          </FormField>
          <FormField label="Description *">
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the solution..."
            />
          </FormField>
          <FormField label="Icon (emoji)">
            <Input
              name="icon"
              value={form.icon}
              onChange={handleChange}
              placeholder="e.g. ⚡"
            />
          </FormField>
          <FormField label="Tag">
            <Input
              name="tag"
              value={form.tag}
              onChange={handleChange}
              placeholder="e.g. Enterprise"
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
