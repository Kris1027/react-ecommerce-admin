import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type DataTableSkeletonProps = {
  columnCount: number;
  rowCount?: number;
};

const DataTableSkeleton = ({
  columnCount,
  rowCount = 10,
}: DataTableSkeletonProps) => {
  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columnCount }, (_, i) => (
              <TableHead key={i}>
                <Skeleton className='h-4 w-24' />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }, (_, i) => (
            <TableRow key={i}>
              {Array.from({ length: columnCount }, (_, j) => (
                <TableCell key={j}>
                  <Skeleton className='h-4 w-full' />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export { DataTableSkeleton };
