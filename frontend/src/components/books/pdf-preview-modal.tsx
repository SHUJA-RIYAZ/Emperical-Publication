"use client";

import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SAMPLE_PDF_URL } from "@/constants";

interface PdfPreviewModalProps {
  bookTitle: string;
}

export function PdfPreviewModal({ bookTitle }: PdfPreviewModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileText /> Preview Sample
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Sample chapter — {bookTitle}</DialogTitle>
          <DialogDescription>
            A short excerpt provided by the publisher. Purchase the full edition for complete
            access.
          </DialogDescription>
        </DialogHeader>
        <div className="h-[65vh] overflow-hidden rounded-lg border bg-muted">
          <iframe
            src={SAMPLE_PDF_URL}
            title={`PDF preview of ${bookTitle}`}
            className="h-full w-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
