import { useParams, useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, Copy } from "lucide-react";
import { useGroupShare } from "../../hooks/useGroupShare";

export default function GroupSharePage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isReset = location.state?.reset === true;
  const { shareUrl, loading, error, copied, copyToClipboard } =
    useGroupShare(token);

  const goToGroup = () => token && navigate(`/group/${token}`);

  return (
    <div className="flex-1">
      <main className="px-6 pb-10 pt-8">
          {loading ? (
            <p className="text-center text-gray-500">Loading…</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <div className="flex flex-col items-center text-center">
              <CheckCircle2 className="w-16 h-16 text-black" />
              <h2 className="mt-4 text-2xl font-bold">
                {isReset ? "Link reset!" : "Group created!"}
              </h2>
              <p className="mt-2 text-gray-600 max-w-[28rem]">
                {isReset
                  ? "Your group link has been reset. Share the new link with your members — the old link will no longer work."
                  : "First, copy the URL of the group page and share it with members via messaging apps."}
              </p>

              <div className="mt-6 w-full">
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5">
                  <input
                    readOnly
                    value={shareUrl}
                    className="flex-1 text-[15px] outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    disabled={copied}
                    className={`cursor-pointer inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white
    ${
      copied
        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
        : "bg-black hover:bg-gray-800 focus:outline-none"
    }
    transition-all duration-200`}
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={goToGroup}
                className="cursor-pointer mt-8 w-full rounded-lg border border-black text-black px-5 py-4 text-md font-medium
             hover:bg-black hover:text-white
             focus:outline-none
             transition-all duration-200"
              >
                Visit Group Page
              </button>
            </div>
          )}
      </main>
    </div>
  );
}
