import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChatSidebar = () => {
  const users = [
    { name: "Jane Doe", status: "Typing...", color: "bg-orange-500" },
    { name: "John Doe", status: "Online", color: "bg-pink-500" },
    { name: "Elizabeth Smith", status: "Offline", color: "bg-yellow-500" },
    { name: "John Smith", status: "Busy", color: "bg-green-500" },
  ];

  return (
    <div className="w-1/4 p-4 bg-gray-900 text-white h-full">
      <h2 className="text-xl mb-4">Chats ({users.length})</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index} className="flex items-center mb-2">
            <Avatar className="mr-2">
              <AvatarImage src={`https://api.dicebear.com/5.x/avataaars/svg?seed=${user.name}`} />
              <AvatarFallback className={user.color}>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-400">{user.status}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;
