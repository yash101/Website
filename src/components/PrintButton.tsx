'use client';

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

const PrintButton: React.FC = () => {
  return (
    <Button
      onClick={() => {
        window.scrollTo(0, 0);
        window.print();
      }}
      size="icon"
      title="Print Page"
      aria-label="Print Page"
    >
      <Printer
        className="size-[2em]"
      />
    </Button>
  )
};

export default PrintButton;
