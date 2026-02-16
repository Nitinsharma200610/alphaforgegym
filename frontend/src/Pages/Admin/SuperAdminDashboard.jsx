import { useEffect, useState } from "react";
import {
    getAllContacts,
    markContactAsRead,
    deleteContact,
} from "../../services/contactService";
import toast from "react-hot-toast";
import "./AdminPages.css";

const SuperAdminDashboard = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, unread, read

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const data = await getAllContacts();
            setContacts(data.contacts || []);
        } catch (error) {
            toast.error("Failed to load contact messages");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await markContactAsRead(id);
            setContacts((prev) =>
                prev.map((c) => (c._id === id ? { ...c, isRead: true } : c)),
            );
            toast.success("Marked as read");
        } catch {
            toast.error("Failed to mark as read");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            await deleteContact(id);
            setContacts((prev) => prev.filter((c) => c._id !== id));
            toast.success("Message deleted");
        } catch {
            toast.error("Failed to delete message");
        }
    };

    const filteredContacts = contacts.filter((c) => {
        if (filter === "unread") return !c.isRead;
        if (filter === "read") return c.isRead;
        return true;
    });

    const unreadCount = contacts.filter((c) => !c.isRead).length;

    return (
        <div className="admin-page">
            <div className="admin-container">
                <h1>SuperAdmin — Contact Messages</h1>
                <p className="welcome-text">
                    {contacts.length} total message{contacts.length !== 1 ? "s" : ""} •{" "}
                    <span style={{ color: "#ff8c00" }}>{unreadCount} unread</span>
                </p>

                {/* Filter Tabs */}
                <div className="sa-filter-tabs">
                    <button
                        className={`sa-tab ${filter === "all" ? "active" : ""}`}
                        onClick={() => setFilter("all")}
                    >
                        All ({contacts.length})
                    </button>
                    <button
                        className={`sa-tab ${filter === "unread" ? "active" : ""}`}
                        onClick={() => setFilter("unread")}
                    >
                        Unread ({unreadCount})
                    </button>
                    <button
                        className={`sa-tab ${filter === "read" ? "active" : ""}`}
                        onClick={() => setFilter("read")}
                    >
                        Read ({contacts.length - unreadCount})
                    </button>
                </div>

                {loading ? (
                    <p>Loading messages...</p>
                ) : filteredContacts.length === 0 ? (
                    <p style={{ textAlign: "center", marginTop: "30px", color: "#999" }}>
                        No {filter !== "all" ? filter : ""} messages found.
                    </p>
                ) : (
                    <div className="sa-messages-list">
                        {filteredContacts.map((contact) => (
                            <div
                                key={contact._id}
                                className={`sa-message-card ${!contact.isRead ? "unread" : ""}`}
                            >
                                <div className="sa-message-header">
                                    <div>
                                        <h3 className="sa-sender-name">
                                            {!contact.isRead && <span className="sa-unread-dot" />}
                                            {contact.name}
                                        </h3>
                                        <p className="sa-sender-email">{contact.email}</p>
                                    </div>
                                    <span className="sa-message-date">
                                        {new Date(contact.createdAt).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>

                                <h4 className="sa-subject">{contact.subject}</h4>
                                <p className="sa-message-body">{contact.message}</p>

                                <div className="sa-message-actions">
                                    {!contact.isRead && (
                                        <button
                                            className="sa-read-btn"
                                            onClick={() => handleMarkAsRead(contact._id)}
                                        >
                                            ✓ Mark as Read
                                        </button>
                                    )}
                                    <button
                                        className="sa-delete-btn"
                                        onClick={() => handleDelete(contact._id)}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
