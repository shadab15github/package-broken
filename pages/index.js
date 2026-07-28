import Head from 'next/head';
import { useState } from 'react';
import UnsafeHtml from '../components/UnsafeHtml';
import SearchBox from '../components/SearchBox';

export default function Home() {
  const [note, setNote] = useState('<b>hello</b>');

  return (
    <div className="container" style={{ padding: 32 }}>
      <Head>
        <title>vuln-next-demo</title>
      </Head>

      <h1>vuln-next-demo</h1>
      <p>
        Intentionally vulnerable app for Safeguard scan + remediation testing. Do not deploy
        anywhere reachable.
      </p>

      <textarea
        rows={4}
        style={{ width: '100%' }}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <UnsafeHtml html={note} />
      <SearchBox />

      {/* inline script with interpolated value */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__NOTE__ = "${note}"; console.log(window.__NOTE__);`,
        }}
      />
    </div>
  );
}

export async function getServerSideProps({ query }) {
  // reflected, unescaped, and echoed into props
  return { props: { q: query.q || null } };
}
