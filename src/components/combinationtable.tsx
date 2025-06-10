'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { typography } from '@/app/styles/typography';
import Button from './button';
import Icon from './icon/Icon';
import CombinationForm from './combinationform';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination';

interface WorkflowFolder {
  id: number;
  name: string;
}

const CombinationTable: React.FC = () => {
  const router = useRouter();
  const [workflows, setWorkflows] = useState<WorkflowFolder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    // Get all folders from the app directory except excluded ones
    const excludedFolders = ['api', 'combinationsettings', 'combined', 'example', 'processcreate', 'styles', 'tool'];
    const fetchWorkflows = async () => {
      try {
        const response = await fetch('/api/folders');
        const folders = await response.json();
        const filteredFolders = folders.filter((folder: string) => !excludedFolders.includes(folder));
        const workflowsWithIds = filteredFolders.map((folder: string, index: number) => ({
          id: index + 1,
          name: folder,
        }));
        setWorkflows(workflowsWithIds);
      } catch (error) {
        console.error('Error fetching workflows:', error);
      }
    };

    fetchWorkflows();
  }, []);

  const totalPages = Math.ceil(workflows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWorkflows = workflows.slice(startIndex, endIndex);

  if (showForm) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-4 mb-6">
          <Button icon="chevron-backward" variant="secondary" onClick={() => setShowForm(false)}>
            Back
          </Button>
          <h2 className={`${typography.Title2} text-black`}>Create New Combination</h2>
        </div>
        <CombinationForm />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-lg border border-[var(--color-border-black-20)]">
        <div className="flex justify-between items-center p-4">
          <h2 className={`${typography.Title2} text-black`}>Combinations</h2>
          <Button variant="primary" icon="add" onClick={() => setShowForm(true)}>
            Create New Combination
          </Button>
        </div>
        <table className="w-full border-collapse text-black">
          <thead>
            <tr className="bg-[var(--color-white)] border-b border-[var(--color-border-black-20)] text-black">
              <th className={`${typography.CaptionBold} px-4 py-3 text-left text-black`}>ID</th>
              <th className={`${typography.CaptionBold} px-4 py-3 text-left text-black`}>Workflow Name</th>
              <th className={`${typography.CaptionBold} px-4 py-3 text-left text-black`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentWorkflows.map((workflow) => (
              <tr
                key={workflow.id}
                className="border-b border-[var(--color-border-black-20)] hover:bg-[var(--color-brand-orange-16)] text-black"
              >
                <td className={`${typography.BodyNormal} px-4 py-3 text-black`}>{workflow.id}</td>
                <td className={`${typography.BodyNormal} px-4 py-3 text-black`}>{workflow.name}</td>
                <td className="px-4 py-3 text-black">
                  <Button
                    variant="secondary"
                    icon="visibility"
                    onClick={() => router.push(`/${workflow.name}`)}
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

export default CombinationTable;
