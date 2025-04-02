import { FiTrash2 } from "react-icons/fi";

interface ListItemProps {
  id: string;
  content: string;
  isChecked: boolean;
  onToggle: (id: string, checked: boolean) => void;
  onDelete: (id: string) => void;
}

export function ListItem({
  id,
  content,
  isChecked,
  onToggle,
  onDelete,
}: ListItemProps) {
  return (
    <li className="flex justify-between items-center border p-3 rounded-xl bg-white shadow-sm hover:shadow transition">
      <span
        onClick={() => onToggle(id, isChecked)}
        className={`flex-1 cursor-pointer text-base ${
          isChecked ? "line-through text-gray-400" : "text-gray-800"
        }`}
      >
        {content}
      </span>
      <button
        onClick={() => onDelete(id)}
        title="Delete item"
        className="text-red-500 hover:text-red-700 ml-4"
      >
        <FiTrash2 size={18} />
      </button>
    </li>
  );
}
