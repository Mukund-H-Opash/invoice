import { useState } from 'react';
import { Button, TextField, MenuItem, Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Invoice, LineItem } from '../types';

interface InvoiceFormProps {
  onSubmit: (invoice: Invoice) => void;
  initialData?: Invoice | null;
}

export default function InvoiceForm({ onSubmit, initialData }: InvoiceFormProps) {
  const [formData, setFormData] = useState<Invoice>(
    initialData || {
      companyName: '',
      name: '',
      from: '',
      billTo: '',
      shipTo: '',
      paymentTerms: 'Due on Receipt',
      dueDate: new Date().toISOString().split('T')[0],
      poNumber: '',
      lineItems: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
      notes: '',
      terms: '',
      subtotal: 0,
      tax: 0,
      discount: 0,
      shipping: 0,
      total: 0,
      amountPaid: 0,
      balanceDue: 0,
      date: new Date().toISOString().split('T')[0],
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLineItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    setFormData((prev) => {
      const newLineItems = [...prev.lineItems];
      newLineItems[index] = {
        ...newLineItems[index],
        [field]: field === 'description' ? value as string : Number(value),
      };
      return calculateTotals({ ...prev, lineItems: newLineItems });
    });
  };

  const addLineItem = () => {
    setFormData((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, { description: '', quantity: 1, rate: 0, amount: 0 }],
    }));
  };

  const removeLineItem = (index: number) => {
    setFormData((prev) => {
      const newLineItems = prev.lineItems.filter((_, i) => i !== index);
      return calculateTotals({ ...prev, lineItems: newLineItems });
    });
  };

  const calculateTotals = (invoice: Invoice): Invoice => {
    const subtotal = invoice.lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const taxAmount = (subtotal * (invoice.tax / 100)) || 0;
    const total = subtotal + taxAmount + invoice.shipping - invoice.discount;
    const balanceDue = total - invoice.amountPaid;

    return {
      ...invoice,
      subtotal,
      total,
      balanceDue,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData); // No logo field anymore
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 2, bgcolor: '#1F2937', borderRadius: 2, boxShadow: 1, color: '#E5E7EB' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box sx={{ flex: 1, textAlign: 'right' }}>
            <Typography variant="h5" sx={{ color: '#4CAF50' }}>INVOICE</Typography>
            <TextField
              fullWidth
              label="Invoice #"
              value={formData.id || 1}
              disabled
              variant="outlined"
              sx={{ bgcolor: '#374151', color: '#E5E7EB', mt: 1, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
            />
          </Box>
        </Box>

        <TextField
          label="Company name"
          name="from"
          value={formData.from}
          onChange={handleChange}
          required
          variant="outlined"
          sx={{ bgcolor: '#374151', color: '#E5E7EB', '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Name"
            name="billTo"
            value={formData.billTo}
            onChange={handleChange}
            required
            variant="outlined"
            sx={{ bgcolor: '#374151', color: '#E5E7EB', flex: 1, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
          />
          <TextField
            label="Address of shipment (optional)"
            name="shipTo"
            value={formData.shipTo || ''}
            onChange={handleChange}
            variant="outlined"
            sx={{ bgcolor: '#374151', color: '#E5E7EB', flex: 1, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Date"
            name="date"
            type="date"
            value={formData.date.split('T')[0]}
            onChange={handleChange}
            required
            variant="outlined"
            sx={{ bgcolor: '#374151', color: '#E5E7EB', flex: 1, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
          />
          
        </Box>

        <Box sx={{ bgcolor: '#1E3A8A', color: '#E5E7EB', p: 2, borderRadius: 1, mb: 2 }}>
          <Typography variant="subtitle1">Item</Typography>
        </Box>
        {formData.lineItems.map((item, index) => (
          <Box key={index} sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 0.5fr', gap: 2, alignItems: 'center', bgcolor: '#374151', p: 2, borderRadius: 1, color: '#E5E7EB' }}>
            <TextField
              label="Description of Item/Service"
              value={item.description}
              onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
              variant="outlined"
              sx={{ bgcolor: '#374151', color: '#E5E7EB', '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
            />
            <TextField
              type="number"
              label="Quantity"
              value={item.quantity}
              onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
              variant="outlined"
              sx={{ bgcolor: '#374151', color: '#E5E7EB', '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
            />
            <TextField
              type="number"
              label="Rate"
              value={item.rate}
              onChange={(e) => handleLineItemChange(index, 'rate', e.target.value)}
              variant="outlined"
              sx={{ bgcolor: '#374151', color: '#E5E7EB', '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
            />
            <TextField
              type="number"
              label="Amount"
              value={item.amount || (item.quantity * item.rate)}
              onChange={(e) => handleLineItemChange(index, 'amount', e.target.value)}
              variant="outlined"
              disabled
              sx={{ bgcolor: '#374151', color: '#E5E7EB', '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
            />
            <IconButton onClick={() => removeLineItem(index)} color="error" sx={{ color: '#f44336' }}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        <Button
          onClick={addLineItem}
          variant="contained"
          sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#45a049' }, mt: 2 }}
          startIcon={<AddIcon />}
        >
          Add Line
        </Button>

        <TextField
          label="Notes - any relevant information not already covered"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          multiline
          rows={4}
          variant="outlined"
          sx={{ bgcolor: '#374151', color: '#E5E7EB', mt: 2, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2, color: '#E5E7EB' }}>
          <TextField
            label="Subtotal"
            name="subtotal"
            type="number"
            value={formData.subtotal}
            onChange={handleChange}
            disabled
            variant="outlined"
            sx={{ bgcolor: '#374151', color: '#E5E7EB', width: 150, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
          />
          <TextField
            label="Tax (%)"
            name="tax"
            type="number"
            value={formData.tax}
            onChange={handleChange}
            variant="outlined"
            sx={{ bgcolor: '#374151', color: '#E5E7EB', width: 150, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
          />
          <TextField
            label="Discount"
            name="discount"
            type="number"
            value={formData.discount}
            onChange={handleChange}
            variant="outlined"
            sx={{ bgcolor: '#374151', color: '#E5E7EB', width: 150, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
          />
          <TextField
            label="Shipping"
            name="shipping"
            type="number"
            value={formData.shipping}
            onChange={handleChange}
            variant="outlined"
            sx={{ bgcolor: '#374151', color: '#E5E7EB', width: 150, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
          />
          <TextField
            label="Total"
            name="total"
            type="number"
            value={formData.total}
            onChange={handleChange}
            disabled
            variant="outlined"
            sx={{ bgcolor: '#374151', color: '#E5E7EB', width: 150, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2, color: '#E5E7EB' }}>
          <TextField
            label="Amount Paid"
            name="amountPaid"
            type="number"
            value={formData.amountPaid}
            onChange={handleChange}
            variant="outlined"
            sx={{ bgcolor: '#374151', color: '#E5E7EB', width: 150, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
          />
          <TextField
            label="Balance Due"
            name="balanceDue"
            type="number"
            value={formData.balanceDue}
            onChange={handleChange}
            disabled
            variant="outlined"
            sx={{ bgcolor: '#374151', color: '#E5E7EB', width: 150, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
          />
        </Box>

        <Button type="submit" variant="contained" sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#45a049' }, mt: 4, width: '100%' }}>
          Create
        </Button>
      </Box>
    </form>
  );
}