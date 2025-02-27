'use client';
import InvoiceForm from '@/components/InvoiceForm';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function CreateInvoice() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const invoice = useSelector((state: RootState) =>
    editId ? state.invoices.invoices.find((inv) => inv.id === editId) : null
  );

  return (
    <>
      <Navbar />
      <Box
         sx={{
          minHeight: 'calc(100vh - 64px)',
          background: 'linear-gradient(45deg, #1E3A8A, #7C3AED, #DB2777)',
          p: 4,
          borderRadius: '12px',
        }}
      >
        <InvoiceForm 
          editInvoice={invoice || undefined} 
          onSave={() => router.push('/all-invoices')} 
        />
      </Box>
    </>
  );
}