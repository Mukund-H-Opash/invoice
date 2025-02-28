'use client';
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Grid, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { addInvoice, updateInvoice } from '@/redux/invoiceSlice';
import { saveInvoice, updateInvoice as updateApiInvoice } from '@/utils/api';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete'; 

interface Item {
  item: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceFormProps {
  editInvoice?: {
    id: string;
    customerName: string;
    shippingAddress: string;
    items: Item[];
    discount: number;
    tax: number;
    shippingCharge: number;
    total: number;
    dueDate: string;
    date: string;
  };
  onSave?: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ editInvoice, onSave }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    customerName: editInvoice?.customerName || '',
    shippingAddress: editInvoice?.shippingAddress || '',
    dueDate: editInvoice?.dueDate || new Date().toLocaleDateString('en-GB'),
  });
  const [items, setItems] = useState<Item[]>(
    editInvoice?.items || [{ item: '', quantity: 0, rate: 0, amount: 0 }]
  );
  const [discount, setDiscount] = useState(editInvoice?.discount || 0);
  const [tax, setTax] = useState(editInvoice?.tax || 0);
  const [shippingCharge, setShippingCharge] = useState(
    editInvoice?.shippingCharge || 0
  );

  useEffect(() => {
    if (editInvoice) {
      setFormData({
        customerName: editInvoice.customerName,
        shippingAddress: editInvoice.shippingAddress,
        dueDate: editInvoice.dueDate,
      });
      setItems(editInvoice.items);
      setDiscount(editInvoice.discount);
      setTax(editInvoice.tax);
      setShippingCharge(editInvoice.shippingCharge);
    }
  }, [editInvoice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editInvoice && name === 'customerName') return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index: number, field: keyof Item, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount =
        (Number(newItems[index].quantity) || 0) * (Number(newItems[index].rate) || 0);
    }
    setItems(newItems);
  };

  const addItemRow = () => {
    setItems([...items, { item: '', quantity: 0, rate: 0, amount: 0 }]);
  };

  const deleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (tax / 100);
  const total = subtotal - discount + taxAmount + (formData.shippingAddress ? shippingCharge : 0);

  const handleSave = async () => {
    const invoiceData = {
      id: editInvoice?.id || Date.now().toString().slice(-4),
      customerName: formData.customerName,
      shippingAddress: formData.shippingAddress,
      items,
      discount,
      tax,
      shippingCharge,
      total,
      amount: total.toString(),
      dueDate: formData.dueDate,
      date: new Date().toLocaleDateString('en-GB'),
    };

    try {
      if (editInvoice) {
        dispatch(updateInvoice(invoiceData));
        await updateApiInvoice(editInvoice.id, invoiceData);
        toast.success('Record updated successfully!');
      } else {
        dispatch(addInvoice(invoiceData));
        await saveInvoice(invoiceData);
        toast.success('Invoice created successfully!');
      }
      onSave?.();
      if (!editInvoice) {
        setFormData({ customerName: '', shippingAddress: '', dueDate: new Date().toLocaleDateString('en-GB') });
        setItems([{ item: '', quantity: 0, rate: 0, amount: 0 }]);
        setDiscount(0);
        setTax(0);
        setShippingCharge(0);
      }
    } catch (error) {
      toast.error('Failed to save invoice!');
      console.error('Error saving invoice:', error);
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        background: 'linear-gradient(135deg, #6D28D9, #A855F7, #EC4899)',
        borderRadius: '12px',
        boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.2)',
        color: '#fff',
        maxWidth: '900px',
        mx: 'auto',
        my: 4,
      }}
      >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          textAlign: 'center',
          mb: 4,
          textShadow: '1px 1px 5px rgba(0, 0, 0, 0.3)',
        }}
      >
        {editInvoice ? `Update Invoice #${editInvoice.id}` : 'Create New Invoice'}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Customer Name"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            variant="outlined"
            disabled={!!editInvoice}
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '&.Mui-focused fieldset': { border: 'none' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(0, 0, 0, 0.6)' },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Shipping Address (Optional)"
            name="shippingAddress"
            value={formData.shippingAddress}
            onChange={handleChange}
            variant="outlined"
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '&.Mui-focused fieldset': { border: 'none' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(0, 0, 0, 0.6)' },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Due Date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            variant="outlined"
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '&.Mui-focused fieldset': { border: 'none' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(0, 0, 0, 0.6)' },
            }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 2 }}>
          Items
        </Typography>
        {items.map((item, index) => (
          <Grid container spacing={2} key={index} sx={{ mb: 2, alignItems: 'center' }}>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="Item Description"
                value={item.item}
                onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                variant="outlined"
                sx={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': { border: 'none' },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                variant="outlined"
                sx={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': { border: 'none' },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                fullWidth
                type="number"
                label="Rate"
                value={item.rate}
                onChange={(e) => handleItemChange(index, 'rate', Number(e.target.value))}
                variant="outlined"
                sx={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': { border: 'none' },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Amount"
                value={item.amount.toFixed(2)}
                disabled
                variant="outlined"
                sx={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': { border: 'none' },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={1}>
              <IconButton
                aria-label="delete"
                onClick={() => deleteItem(index)}
                sx={{
                  color: '#EF4444',
                  '&:hover': { color: '#DC2626' },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Button
          component={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          variant="outlined"
          onClick={addItemRow}
          sx={{
            mt: 2,
            borderColor: '#fff',
            color: '#fff',
            borderRadius: '8px',
            padding: '8px 24px',
            '&:hover': {
              borderColor: '#fff',
              background: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          + Add Item
        </Button>
      </Box>

      <Box sx={{ maxWidth: 400, ml: 'auto' }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Invoice # {editInvoice?.id || Date.now().toString().slice(-4)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Date: {new Date().toLocaleDateString('en-GB')}
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>Subtotal:</Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography>${subtotal.toFixed(2)}</Typography>
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Discount ($)"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              size="small"
              sx={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { border: 'none' },
                  '&:hover fieldset': { border: 'none' },
                  '&.Mui-focused fieldset': { border: 'none' },
                },
              }}
            />
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography>-${discount.toFixed(2)}</Typography>
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Tax (%)"
              type="number"
              value={tax}
              onChange={(e) => setTax(Number(e.target.value))}
              size="small"
              sx={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { border: 'none' },
                  '&:hover fieldset': { border: 'none' },
                  '&.Mui-focused fieldset': { border: 'none' },
                },
              }}
            />
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography>${taxAmount.toFixed(2)}</Typography>
          </Grid>

          {formData.shippingAddress && (
            <>
              <Grid item xs={6}>
                <TextField
                  label="Shipping Charge ($)"
                  type="number"
                  value={shippingCharge}
                  onChange={(e) => setShippingCharge(Number(e.target.value))}
                  size="small"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { border: 'none' },
                      '&:hover fieldset': { border: 'none' },
                      '&.Mui-focused fieldset': { border: 'none' },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography>${shippingCharge.toFixed(2)}</Typography>
              </Grid>
            </>
          )}

          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                textAlign: 'right',
                textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)',
              }}
            >
              Total: ${total.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'right', mt: 3 }}>
          <Button
            component={motion.button}
            whileHover={{ scale: 1.05, boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            variant="contained"
            onClick={handleSave}
            sx={{
              background: 'linear-gradient(90deg, #F59E0B, #EF4444)',
              color: '#fff',
              fontWeight: 'bold',
              padding: '10px 30px',
              borderRadius: '50px',
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                background: 'linear-gradient(90deg, #D97706, #DC2626)',
              },
            }}
          >
            {editInvoice ? 'Update Invoice' : 'Create Invoice'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default InvoiceForm;