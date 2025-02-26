'use client';
import { Button, Stack, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar() {
  return (
    <AppBar position="static" sx={{ bgcolor: '#1E3297' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, color: '#E5E7EB' }}>
          Invoice Maker
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="text" component={Link} href="/" sx={{ color: '#E5E7EB', '&:hover': { color: '#4CAF50' }}}>
            Home
          </Button>
          <Button variant="text" component={Link} href="/create-invoice" sx={{ color: '#E5E7EB', '&:hover': { color: '#4CAF50' }}}>
            Create Invoice
          </Button>
          <Button variant="text" component={Link} href="/all-invoices" sx={{ color: '#E5E7EB', '&:hover': { color: '#4CAF50' }}}>
            All Invoices
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}