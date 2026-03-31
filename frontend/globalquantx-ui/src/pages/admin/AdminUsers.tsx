import React, { useEffect, useState } from "react";
import { UserSummary } from "../../services/dtos";
import { mockFetch } from "../../services/mockFetch";

export default function AdminUsers() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await mockFetch("/auth/users/summary");
        setUsers(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="page page-admin page-admin-users">
      <div className="page-header">
        <h1>Users & Access</h1>
        <p>Identity, roles, and governance.</p>
      </div>
      <div className="page-body">
        {loading && <div>Loading users...</div>}
        {!loading && (
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
