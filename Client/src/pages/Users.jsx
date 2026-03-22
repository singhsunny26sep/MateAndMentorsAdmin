import { useState } from "react";
import Table from "../components/UI/Table";
import { useGetQuery } from "../api/apiCall";
import API_ENDPOINTS from "../api/apiEndpoint";

const Users = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const { data } = useGetQuery(
    `${API_ENDPOINTS.USER.GET_ALL}?page=${page}&limit=${limit}`,
    ["users", page, limit]
  );

  const users = data?.data?.data || [];
  const totalUsers = data?.data?.total || 0;
  const totalPages = data?.data?.totalPages || 1;

  const columns = [
    {
      key: "image",
      title: "Profile",
      render: (user) => (
        user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {user.name?.charAt(0)}
          </div>
        )
      ),
    },
    {
      key: "name",
      title: "Name",
      render: (user) => <span className="font-medium">{user.name}</span>,
    },
    {
      key: "email",
      title: "Email",
      render: (user) => <span>{user.email}</span>,
    },
    {
      key: "mobile",
      title: "Mobile",
      render: (user) => <span>{user.mobile}</span>,
    },
    {
      key: "role",
      title: "Role",
      render: (user) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            user.role === "admin"
              ? "bg-purple-100 text-purple-700"
              : user.role === "mentor"
              ? "bg-blue-100 text-blue-700"
              : user.role === "mentee"
              ? "bg-pink-100 text-pink-700"
              : user.role === "mate"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
      ),
    },
    {
      key: "isActive",
      title: "Status",
      render: (user) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            user.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {user.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "createdAt",
      title: "Created At",
      render: (user) => new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    },
  ];

  const handleView = (user) => {
    console.log("View user:", user);
  };

  const handleEdit = (user) => {
    console.log("Edit user:", user);
  };

  const handleDelete = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      console.log("Delete user:", user);
    }
  };

  const handleAddNew = () => {
    console.log("Add new user");
  };

  return (
    <div className="p-4">
      <Table
        title="User Management"
        addButtonText="Add New User"
        columns={columns}
        data={users}
        onAddNew={handleAddNew}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
      <div className="mt-4 text-sm text-gray-600">
        Showing {users.length} of {totalUsers} users
      </div>
    </div>
  );
};

export default Users;
