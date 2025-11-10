import { type ReactElement } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { RegistrationCode } from "../../../../../core/types/registration-code/registration-code.type";
import { toast } from "react-toastify";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/modules/core/utils/date.util";

type GeneratedCodeProps = {
  code: RegistrationCode;
  handleBack: () => void;
  handleDelete: (code: string) => void;
};

export default function GeneratedCode({
  code,
  handleDelete,
}: GeneratedCodeProps): ReactElement {
  console.log("CODE: ", code);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code.code);
    toast.success("Copied to clipboard");
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-center">Registration Code</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col items-center gap-6">
        {/* qr code */}
        <Card className="p-4 border-2">
          <CardContent className="p-0 flex justify-center">
            <QRCodeCanvas value={code.link} size={180} />
          </CardContent>
        </Card>

        {/* usage */}
        <Badge variant="secondary" className="px-3 py-1">
          Max Uses: {code.maxUses}
        </Badge>

        {/* code */}
        <Card
          className="w-full cursor-pointer transition-all hover:shadow-md border-2 hover:border-primary/50"
          onClick={handleCopyCode}
        >
          <CardContent className="p-4">
            <div className="flex gap-2 justify-center">
              {code.code.split("").map((num, index) => (
                <div
                  key={index}
                  className="flex-1 aspect-square flex items-center justify-center rounded-md border-2 bg-muted font-mono font-bold text-lg p-2"
                >
                  {num}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Click to copy code
            </p>
          </CardContent>
        </Card>

        {/* expiry date */}
        <p className="text-sm text-muted-foreground text-center">
          Expires on {formatDate(code.expiresAt.toString())}
        </p>

        {/* delete */}
        <Button
          type="button"
          variant="destructive"
          onClick={() => handleDelete(code.id)}
          className="w-full"
        >
          Delete Code
        </Button>
      </div>
    </DialogContent>
  );
}
