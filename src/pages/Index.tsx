// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Blank App</h1>
        <p className="text-xl text-muted-foreground mb-6">Start building your amazing project here!</p>
        <div className="space-x-4">
          <a href="/admin/images" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition">Admin: Manage Images</a>
          <a href="/admin/users" className="px-4 py-2 bg-secondary text-foreground rounded hover:bg-secondary/80 transition">Admin: Manage Users</a>
        </div>
      </div>
    </div>
  );
};

export default Index;
