import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle2, Copy } from "lucide-react";
import { useGroupShare } from "../../hooks/useGroupShare";

export default function GroupSharePage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { shareUrl, loading, error, copied, copyToClipboard } =
    useGroupShare(token);

  const goToGroup = () => token && navigate(`/group/${token}`);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-[500px] min-h-screen bg-white shadow-md overflow-x-hidden flex flex-col">
        <main className="flex-1 px-6 pb-10 pt-8">
          {loading ? (
            <p className="text-center text-gray-500">Loading…</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <div className="flex flex-col items-center text-center">
              <CheckCircle2 className="w-16 h-16 text-black" />
              <h2 className="mt-4 text-2xl font-bold">Group created!</h2>
              <p className="mt-2 text-gray-600 max-w-[28rem]">
                First, copy the URL of the group page and share it with members
                via messaging apps.
              </p>

              <div className="mt-6 w-full">
                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-3 py-2.5">
                  <input
                    readOnly
                    value={shareUrl}
                    className="flex-1 text-[15px] outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    disabled={copied}
                    className={`cursor-pointer inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-white 
    ${
      copied
        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
        : "bg-black hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-400"
    } 
    active:scale-[0.98] transition-all duration-200`}
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={goToGroup}
                className="cursor-pointer mt-8 w-full rounded-full border-2 border-black text-black px-6 py-3 text-lg font-semibold 
             hover:bg-black hover:text-white 
             focus:ring-4 focus:outline-none focus:ring-gray-400 
             active:scale-[0.99] transition-all duration-200"
              >
                Visit Group Page
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
