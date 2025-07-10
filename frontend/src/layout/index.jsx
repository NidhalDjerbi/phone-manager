function Layout({ children }) {
  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md border">
      <main>{children}</main>
    </div>
  );
}

export default Layout;
