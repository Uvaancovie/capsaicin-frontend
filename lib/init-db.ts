const initDatabase = async () => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${backendUrl}/init-db`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    console.log('Database initialization result:', data);
    return data;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

// Export for use in components if needed
export { initDatabase };
