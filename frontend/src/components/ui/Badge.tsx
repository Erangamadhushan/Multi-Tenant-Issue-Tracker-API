import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export function Badge({ className, children, tone = 'neutral', ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: 'neutral' | 'green' | 'amber' | 'blue' }) {
  return <span className={cn('badge', `badge-${tone}`, className)} {...props}>{children}</span>;
}
