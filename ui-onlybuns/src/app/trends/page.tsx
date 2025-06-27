export default function TrendsPage() {
  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: "2rem", background: "#fafafa", borderRadius: 12 }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 16 }}>Network Trends</h1>
      <p style={{ marginBottom: 24 }}>
        Welcome to the trends dashboard! Here you'll soon be able to explore the latest stats and highlights from our network.
      </p>
      <div style={{ marginBottom: 20 }}>
        <strong>Total posts:</strong> <span>Loading...</span>
      </div>
      <div style={{ marginBottom: 20 }}>
        <strong>Posts in the last 30 days:</strong> <span>Loading...</span>
      </div>
      <div style={{ marginBottom: 20 }}>
        <strong>Top 5 most liked posts (last 7 days):</strong>
        <ol>
          <li>Loading...</li>
          <li>Loading...</li>
          <li>Loading...</li>
          <li>Loading...</li>
          <li>Loading...</li>
        </ol>
      </div>
      <div style={{ marginBottom: 20 }}>
        <strong>Top 10 most liked posts (all time):</strong>
        <ol>
          <li>Loading...</li>
          <li>Loading...</li>
          <li>Loading...</li>
          <li>Loading...</li>
          <li>Loading...</li>
          <li>Loading...</li>
          <li>Loading...</li>
          <li>Loading...</li>
          <li>Loading...</li>
          <li>Loading...</li>
        </ol>
      </div>
      <div>
        <strong>Top 10 users by likes given (last 7 days):</strong>
        <ol>
          <li>Loading...</li>
          <li>Loading...</li>
          <li>Loading...</li>
          <li>Loading...</li>
          <li>Loading...</li>
          <li>Loading...</li>
          <li>Loading...</li>
          <li>Loading...</li>
          <li>Loading...</li>
          <li>Loading...</li>
        </ol>
      </div>
      <p style={{ marginTop: 32, color: "#888" }}>
        (This is a demo page. Real data and features coming soon!)
      </p>
    </div>
    );
}