type SiteHeaderProps = {
  title: string;
  subtitle: string;
};

export function SiteHeader({ title, subtitle }: SiteHeaderProps) {
  return (
    <header className="app-header">
      <div className="site-brand">
        <span className="site-brand-mark">TB</span>
        <div className="app-header-copy">
          <span className="app-header-label">Java 21 스레드 벤치마크</span>
          <strong>스레드 벤치마크 콘솔</strong>
          <p>가상 스레드와 플랫폼 스레드 실험 워크플로를 관리합니다.</p>
        </div>
      </div>

      <div className="app-header-actions">
        <div className="app-header-page">
          <span>{title}</span>
          <strong>{subtitle}</strong>
        </div>
      </div>
    </header>
  );
}
