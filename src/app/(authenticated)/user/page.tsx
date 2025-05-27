import UsersTable from "@/components/user/UsersTable";
import { GetUsers } from "@/server/user";

const UserManagementPage: React.FC = async () => {
  const users = await GetUsers();

  if (!users || users.length === 0) {
    return <div className="p-4">Không có người dùng nào.</div>;
  }

  return (
    <div className="w-full p-4">
      <UsersTable users={users} />
    </div>
  )
}

export default UserManagementPage;