'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { typography } from '@/app/styles/typography';
import Button from './button';
import Icon from './icon/Icon';
import ProcessForm from './processform';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination';

interface ProcessFile {
  id: number;
  label: string;
  value: string;
}

const ProcessTable: React.FC = () => {
  const router = useRouter();
  const [processes, setProcesses] = useState<ProcessFile[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const response = await fetch('/api/processes');
        const files = await response.json();
        const processesWithIds = files.map((file: any, index: number) => ({
          id: index + 1,
          label: file.label,
          value: file.value,
        }));
        setProcesses(processesWithIds);
      } catch (error) {
        console.error('Error fetching processes:', error);
      }
    };
    fetchProcesses();
  }, []);

  const totalPages = Math.ceil(processes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProcesses = processes.slice(startIndex, endIndex);

  if (showForm) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-4 mb-6">
          <Button icon="chevron-backward" variant="secondary" onClick={() => setShowForm(false)}>
            Back
          </Button>
          <h2 className={`${typography.Title2} text-black`}>Create New Process</h2>
        </div>
        <ProcessForm />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-lg border border-[var(--color-border-black-20)]">
        <div className="flex justify-between items-center p-4">
          <h2 className={`${typography.Title2} text-black`}>Processes</h2>
          <Button variant="primary" icon="add" onClick={() => setShowForm(true)}>
            Create New Process
          </Button>
        </div>
        <table className="w-full border-collapse text-black">
          <thead>
            <tr className="bg-[var(--color-white)] border-b border-[var(--color-border-black-20)] text-black">
              <th className={`${typography.CaptionBold} px-4 py-3 text-left text-black`}>ID</th>
              <th className={`${typography.CaptionBold} px-4 py-3 text-left text-black`}>Process Name</th>
              <th className={`${typography.CaptionBold} px-4 py-3 text-left text-black`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProcesses.map((process) => (
              <tr
                key={process.id}
                className="border-b border-[var(--color-border-black-20)] hover:bg-[var(--color-brand-orange-16)] text-black"
              >
                <td className={`${typography.BodyNormal} px-4 py-3 text-black`}>{process.id}</td>
                <td className={`${typography.BodyNormal} px-4 py-3 text-black`}>{process.label}</td>
                <td className="px-4 py-3 text-black">
                  <Button
                    variant="secondary"
                    icon="visibility"
                    onClick={() => router.push('/example')}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                  }}
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  }}
                  aria-disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ProcessTable;
