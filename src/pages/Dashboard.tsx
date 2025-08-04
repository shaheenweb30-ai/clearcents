import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Welcome to your Dashboard</h2>
            <p className="text-muted-foreground">Your financial overview will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;