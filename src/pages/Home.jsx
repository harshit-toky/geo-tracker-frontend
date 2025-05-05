const Home = ({ authState }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        {authState.isAuthenticated 
          ? `Welcome back, ${authState.username}!` 
          : "Welcome to GeoTracker"}
      </h2>
      {/* ... rest of your home page */}
    </div>
  );
};

export default Home