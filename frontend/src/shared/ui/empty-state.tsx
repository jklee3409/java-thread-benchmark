import { ReactNode } from "react";

type EmptyStateProps = {
  title?: string;
  message: string;
  action?: ReactNode;
};

export function EmptyState({
  title = "표시할 내용이 아직 없습니다.",
  message,
  action,
}: EmptyStateProps) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <strong>{title}</strong>
      <p>{message}</p>
      {action ? <div className="empty-state-action">{action}</div> : null}
    </div>
  );
}
