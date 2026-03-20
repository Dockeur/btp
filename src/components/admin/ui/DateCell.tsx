import { formatDate } from '@/utils/format-date';
import React from 'react';
import { cn } from 'rizzui';

interface DateCellProps {
    date: Date;
    className?: string;
    dateFormat?: string;
    dateClassName?: string;
    timeFormat?: string;
    timeClassName?: string;
}

export default function DateCell({
    date,
    className,
    timeClassName,
    dateClassName,
    dateFormat = 'D MMMM YYYY',
    timeFormat = 'HH:mm',
}: DateCellProps) {
    return (
        <div className={cn(className, 'grid gap-1')}>
            <time
                dateTime={formatDate(date, 'YYYY-MM-DD')}
                className={cn('font-medium text-gray-700', dateClassName)}
            >
                {formatDate(date, dateFormat)}
            </time>
            <time
                dateTime={formatDate(date, 'HH:mm:ss')}
                className={cn('text-[13px] text-gray-500', timeClassName)}
            >
                {formatDate(date, timeFormat)}
            </time>
        </div>
    );
}
