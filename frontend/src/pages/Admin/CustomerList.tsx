import { colors } from "../../constant/color";
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
        <div className="p-8 h-full pt-15 w-full overflow-y-auto" style={{ backgroundColor: colors.bg }}>
            <div className=" overflow-hidden mt-4 rounded-2xl max-w-5xl mx-auto">
                <div className="flex space-x-5">
                    <h2 className="text-xl font-bold mb-3 flex items-center gap-2" style={{ color: colors.text }}>
                        👥 Customers
                    </h2>

                    <div className="">
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="border text-[#7f6743] rounded px-3 py-2 text-sm"
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
                            className="overflow-hidden mt-4 rounded-2xl max-w-5xl mx-auto"
                            style={{ height: "670px" }}
                        >
                            <table className="w-full">
                                <thead
                                    style={{ backgroundColor: colors.accent, color: colors.white }}
                                >
                                    <tr className="text-xs">
                                        <th className="p-4 text-center">Name</th>
                                        <th className="p-4 text-center">Role</th>
                                        <th className="p-4 text-center">Email</th>
                                        <th className="p-4 text-center">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-amber-50 w-full">
                                    {
                                        filteredUsers?.map((user: User) => (
                                            <tr key={user._id}
                                                className="transition-transform  h-15 duration-200 ease-in-out cursor-pointer"
                                                style={{
                                                    borderBottom: `2px solid ${colors.bg}`,
                                                }}>

                                                <td
                                                    className="text-center text-xs font-medium"
                                                    style={{ color: colors.text }}
                                                >
                                                    {user.name}
                                                </td>
                                                <td
                                                    className="text-center text-xs font-medium"
                                                    style={{ color: colors.text }}
                                                >
                                                    {
                                                        editRoleId == user._id ? (
                                                            <select name="" id="" value={newRole}
                                                                onChange={(e) => setNewRole(e.target.value)}
                                                                className="border rounded px-2 py-1 text-xs">
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
                                                    style={{ color: colors.text }}
                                                >
                                                    {user.email}
                                                </td>
                                                <td className="text-center text-xs">
                                                    {editRoleId === user._id ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleUpdate(user._id!)}
                                                                className="text-white py-1 px-2 rounded-lg hover:bg-green-500 font-semibold bg-green-600 text-xs mr-2"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={() => setEditRoleId(null)}
                                                                className="text-white text-xs py-1 px-2 rounded-lg hover:bg-red-400 font-semibold bg-red-600"
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
                                                                className="text-xl mr-2 text-green-600"
                                                            >
                                                                <FaRegEdit />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleDelete(user._id!)}
                                                                className="text-xl text-red-600"
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

                            <div className="flex  mr-1 justify-end items-center gap-4 mt-4 ">
                                <span className="font-medium text-gray-700">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button
                                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-green-400 rounded hover:bg-green-500 disabled:opacity-50"
                                >
                                    Previous
                                </button>

                                <button
                                    onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-green-400 rounded hover:bg-green-500 disabled:opacity-50"
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