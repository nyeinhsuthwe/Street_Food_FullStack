import { FaRegEdit } from "react-icons/fa";
import { useApiQuery } from "../../hook/useQuery";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useApiMutation } from "../../hook/useMutation";
import toast from "react-hot-toast";
import { MenuSkeleton } from "../../constant/skeleton";

const CustomerList: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<string>("All")
    const [editRoleId, setEditRoleId] = useState<string | null>(null)
    const [newRole, setNewRole] = useState<string>()
    const [page, setPage] = useState(1);
    const [limit] = useState(12);
    const queryClient = useQueryClient();

    const { data, isLoading } = useApiQuery<UserListResponse>(
        {
            endpoint: `${import.meta.env.VITE_API_URL}/get-user-list?pageNo=${page}&pageSize=${limit}`,
            queryKey: ["users", page],
        },
        {
            keepPreviousData: true,
            staleTime: 0,
        }

    );

    const users = data?.data || [];
    const currentPage = data?.currentPage || 1;
    const totalPages = data?.totalPages || 1;



    const filteredUsers =
        selectedRole === "All"
            ? users
            : users.filter(
                (u) => u.role?.toLowerCase() === selectedRole.toLowerCase()
            );


    const deleteMutation = useApiMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
        }
    })

    const handleDelete = (id: string) => {
        deleteMutation.mutate({
            endpoint: `${import.meta.env.VITE_API_URL}/delete-user/${id}`,
            method: "DELETE"
        });
        toast.success("User deleted successfully!")
    }

    const updateMudation = useApiMutation({
        onSuccess: () => {
            setEditRoleId(null)
            queryClient.invalidateQueries({ queryKey: ["users"] })
        }
    })

    const handleUpdate = (id: string) => {
        updateMudation.mutate({
            endpoint: `${import.meta.env.VITE_API_URL}/update-role/${id}`,
            method: "PUT",
            body: { role: newRole }
        })
        toast.success("User's role changed successfully!")
    }

    return (
        <div className="p-6 h-full w-full overflow-y-auto">
            <div className="overflow-hidden mt-4 rounded-2xl max-w-5xl mx-auto">
                <div className="flex flex-wrap items-center gap-5">
                    <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                        Customers
                    </h2>

                    <div className="">
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="input text-sm"
                        >
                            <option value="All">All</option>
                            <option value="admin">Admins</option>
                            <option value="user">Customers</option>

                        </select>
                    </div>
                </div>

                {
                    isLoading ? (<MenuSkeleton />) : (
                        <div
                            className="overflow-hidden mt-4 rounded-2xl max-w-5xl mx-auto card"
                            style={{ height: "670px" }}
                        >
                            <table className="w-full">
                                <thead className="bg-accent text-white">
                                    <tr className="text-xs">
                                        <th className="p-4 text-center">Name</th>
                                        <th className="p-4 text-center">Role</th>
                                        <th className="p-4 text-center">Email</th>
                                        <th className="p-4 text-center">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-surface w-full">
                                    {
                                        filteredUsers?.map((user: User) => (
                                            <tr key={user._id}
                                                className="transition-transform  h-15 duration-200 ease-in-out cursor-pointer"
                                                style={{ borderBottom: "1px solid var(--border)" }}>

                                                <td
                                                    className="text-center text-xs font-medium"
                                                >
                                                    {user.name}
                                                </td>
                                                <td
                                                    className="text-center text-xs font-medium"
                                                >
                                                    {
                                                        editRoleId == user._id ? (
                                                            <select name="" id="" value={newRole}
                                                                onChange={(e) => setNewRole(e.target.value)}
                                                                className="input text-xs">
                                                                <option value="user">User</option>
                                                                <option value="admin">Admin</option>
                                                            </select>
                                                        ) : (
                                                            user.role
                                                        )
                                                    }
                                                </td>
                                                <td
                                                    className="text-center text-xs font-medium"
                                                >
                                                    {user.email}
                                                </td>
                                                <td className="text-center text-xs">
                                                    {editRoleId === user._id ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleUpdate(user._id!)}
                                                                className="text-white py-1 px-2 rounded-lg hover:opacity-80 font-semibold bg-accent-2 text-xs mr-2"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={() => setEditRoleId(null)}
                                                                className="text-white text-xs py-1 px-2 rounded-lg hover:opacity-80 font-semibold bg-accent"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setEditRoleId(user._id!);
                                                                    setNewRole(user.role);
                                                                }}
                                                                className="text-xl mr-2 text-accent-2"
                                                            >
                                                                <FaRegEdit />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleDelete(user._id!)}
                                                                className="text-xl text-accent"
                                                            >
                                                                <MdDelete />
                                                            </button>
                                                        </>
                                                    )}
                                                </td>

                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>

                            <div className="flex mr-1 justify-end items-center px-4 gap-4 mt-8 mb-4">
                                <span className="font-medium text-[color:var(--muted)]">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button
                                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="btn-secondary disabled:opacity-50"
                                >
                                    Previous
                                </button>

                                <button
                                    onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
                                    disabled={currentPage === totalPages}
                                    className="btn-secondary disabled:opacity-50"
                                >

                                    Next
                                </button>
                            </div>
                        </div>
                    )
                }

            </div>
        </div>
    )
}

export default CustomerList
