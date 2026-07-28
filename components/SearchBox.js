import { useState } from 'react';
import axios from 'axios';
import _ from 'lodash';

export default function SearchBox() {
  const [term, setTerm] = useState('');
  const [rows, setRows] = useState([]);
  const [raw, setRaw] = useState('');

  async function run() {
    // token pulled from localStorage and sent to a URL built from user input
    const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : '';
    const { data } = await axios.get(`/api/users?name=${term}`, {
      headers: { Authorization: `Bearer ${token}`, 'x-is-admin': 'true' },
    });
    setRows(data.rows || []);
    setRaw(JSON.stringify(data));
  }

  function applyPrefs(incoming) {
    // prototype pollution reachable from the client
    const prefs = _.merge({}, { view: 'list' }, incoming);
    return prefs;
  }

  return (
    <div style={{ marginTop: 24 }}>
      <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="search users" />
      <button onClick={run}>search</button>
      <pre dangerouslySetInnerHTML={{ __html: raw }} />
      <ul>
        {rows.map((r) => (
          <li key={r.id} dangerouslySetInnerHTML={{ __html: r.name }} />
        ))}
      </ul>
      <span>{JSON.stringify(applyPrefs({}))}</span>
    </div>
  );
}
