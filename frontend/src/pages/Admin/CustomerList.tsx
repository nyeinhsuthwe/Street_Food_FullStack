import { colors } from "../../constant/color";
import { FaRegEdit } from "react-icons/fa";
import { useApiQuery } from "../../hook/useQuery";
import { MdDelete } from "react-icons/md";
import { useState } from "react";

const CustomerList: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<string>("All")

    const { data: users } = useApiQuery<User[]>(
        {
            endpoint: `${import.meta.env.VITE_API_URL}/get-user-list`,
            queryKey: ["users"]
        },
        {
            select: (res: ApiResponse<User[]>) => res.data,
        }
    )


   const filteredUsers = selectedRole === "All"
    ? users || []
    : users?.filter(u => u.role?.toLowerCase() === selectedRole.toLowerCase()) || [];


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
                            onChange={(e)=> setSelectedRole(e.target.value)}
                            className="border text-[#7f6743] rounded px-3 py-2 text-sm"
                        >
                            <option value="All">All</option>
                            <option value="admin">Admins</option>
                            <option value="user">Customers</option>
                           
                        </select>
                    </div>
                </div>

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
                                            {user.role}
                                        </td>
                                        <td
                                            className="text-center text-xs font-medium"
                                            style={{ color: colors.text }}
                                        >
                                            {user.email}
                                        </td>
                                        <td className="text-center text-xs">
                                            <button
                                                type="button"
                                                className="text-xl mr-2 text-green-600"
                                            >
                                                <FaRegEdit />
                                            </button>
                                            <button
                                                type="button"
                                                className="text-xl text-red-600"
                                            >
                                                <MdDelete />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}

export default CustomerList