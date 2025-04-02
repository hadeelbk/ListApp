import { Link } from "react-router-dom";
import { FiEye, FiCopy, FiTrash2 } from "react-icons/fi";
import { MdLibraryAdd } from "react-icons/md";

interface ListCardProps {
  id: string;
  name: string;
  visibility: "private" | "shared";
  shareToken?: string;
  onDelete: (id: string) => void;
  isSharedWithUser?: boolean;
  onUseTemplate?: (templateId: string) => void;
}

export function ListCard({
  id,
  name,
  visibility,
  shareToken,
  onDelete,
  isSharedWithUser,
  onUseTemplate,
}: ListCardProps) {
  const handleCopy = () => {
    if (shareToken) {
        //creating the link for read-only share
      const shareLink = `${window.location.origin}/shared/${shareToken}`;
      navigator.clipboard.writeText(shareLink);
      alert("Share link copied!");
    }
  };

  return (
    <li className="flex justify-between items-start border p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition">
      <div>
        <p className="text-lg font-medium text-gray-800">
          {name}
          {isSharedWithUser && (
            <span className="ml-2 text-xs text-gray-500 italic">
              (shared with you)
            </span>
          )}
        </p>
        <span className="text-xs text-gray-500 capitalize">{visibility}</span>
      </div>

      <div className="flex gap-2 items-center">
        <Link
          to={`/list/${id}`}
          title="View"
          className="text-blue-600 hover:text-blue-800"
        >
          <FiEye size={18} />
        </Link>

        {visibility === "shared" && shareToken && (
          <button
            onClick={handleCopy}
            title="Copy Link"
            className="text-green-600 hover:text-green-800"
          >
            <FiCopy size={18} />
          </button>
        )}

        {onUseTemplate && (
          <button
            onClick={() => onUseTemplate(id)}
            title="Use Template"
            className="text-indigo-600 hover:text-indigo-800"
          >
            <MdLibraryAdd size={18} />
          </button>
        )}

        <button
          onClick={() => onDelete(id)}
          title="Delete"
          className="text-red-500 hover:text-red-700"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </li>
  );
}
