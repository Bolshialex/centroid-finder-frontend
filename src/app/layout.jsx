import "./globals.css";

export const metadata = {
  title: "Centroid Finder",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="card-container">
          <h1>Centroid Finder</h1>
          {children}
        </div>
      </body>
    </html>
  );
}
