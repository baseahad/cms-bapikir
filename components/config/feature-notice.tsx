import { InfoIcon } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

type FeatureNoticeProps = {
  description: string;
  missingEnv?: string[];
  title: string;
  toggleEnv?: string;
};

export function FeatureNotice({
  description,
  missingEnv = [],
  title,
  toggleEnv,
}: FeatureNoticeProps) {
  return (
    <Alert>
      <InfoIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p>{description}</p>
        {missingEnv.length > 0 ? (
          <p>
            Env yang dibutuhkan:{" "}
            {missingEnv.map((name, index) => (
              <span key={name}>
                <code>{name}</code>
                {index < missingEnv.length - 1 ? ", " : ""}
              </span>
            ))}
            .
          </p>
        ) : null}
        {toggleEnv ? (
          <p>
            Kalau fitur ini memang belum dipakai di app kamu, set{" "}
            <code>{toggleEnv}=false</code>.
          </p>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}
