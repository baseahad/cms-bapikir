"use client";

import { useEffect, useState } from "react";

export function CurrentYear() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return <>2009{year && year > 2009 ? `–${year}` : ""}</>;
}
