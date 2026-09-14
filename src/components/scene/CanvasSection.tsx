import type { ReactNode } from 'react';
import useInView from '../../hooks/useInView';

export default function CanvasSection({
  children,
  className,
  hint = 'CALIBRATING VISUAL FIELD…',
}: {
  children: ReactNode;
  className?: string;
  hint?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ margin: '700px 0px' });

  return (
    <div ref={ref} className={className}>
      {inView ? (
        children
      ) : (
        <div className="relative h-full w-full overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.07),transparent_65%)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="mono text-[0.62rem] tracking-[0.4em] text-white/20">{hint}</span>
          </div>
        </div>
      )}
    </div>
  );
}