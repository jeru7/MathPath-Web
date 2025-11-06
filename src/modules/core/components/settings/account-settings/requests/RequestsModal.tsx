import { type ReactElement } from "react";
import { FaTimes, FaHistory } from "react-icons/fa";
import { Request } from "../../../../types/requests/request.type";
import { format } from "date-fns-tz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type RequestsModalProps = {
  showRequestsModal: boolean;
  onClose: () => void;
  accountRequests: Request[];
  isLoadingRequests: boolean;
  onRequestClick: (request: Request) => void;
};

export default function RequestsModal({
  showRequestsModal,
  onClose,
  accountRequests,
  isLoadingRequests,
  onRequestClick,
}: RequestsModalProps): ReactElement {
  if (!showRequestsModal) return <></>;

  const RequestListItem = ({ request }: { request: Request }) => {
    const getStatusVariant = (
      status: string,
    ): "default" | "destructive" | "secondary" => {
      switch (status) {
        case "approved":
          return "default";
        case "rejected":
          return "destructive";
        case "pending":
          return "secondary";
        default:
          return "secondary";
      }
    };

    return (
      <Card
        className="hover:bg-muted/50 transition-colors cursor-pointer"
        onClick={() => onRequestClick(request)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant={getStatusVariant(request.status)}>
                  {request.status.charAt(0).toUpperCase() +
                    request.status.slice(1)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(request.createdAt), "MMM d 'at' h:mm a", {
                    timeZone: "Asia/Manila",
                  })}
                </span>
              </div>
              <div className="text-sm">Account Information Change Request</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-4xl mx-4 flex flex-col max-h-[90vh]">
        {/* header */}
        <CardHeader className="flex-row items-start justify-between p-6 border-b flex-shrink-0">
          <div>
            <CardTitle>Account Change Requests</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              View your pending and past account modification requests
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <FaTimes className="w-4 h-4" />
          </Button>
        </CardHeader>

        {/* content */}
        <div className="flex-1 overflow-y-auto">
          <CardContent className="p-6">
            {isLoadingRequests ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : accountRequests.length === 0 ? (
              <div className="text-center py-8">
                <FaHistory className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Requests Found</h3>
                <p className="text-muted-foreground">
                  You haven't submitted any account change requests yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {accountRequests.map((request) => (
                  <RequestListItem key={request.id} request={request} />
                ))}
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
