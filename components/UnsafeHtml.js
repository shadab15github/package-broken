import { useEffect, useRef } from 'react';
import marked from 'marked';
import DOMPurify from 'dompurify';

// XSS: dangerouslySetInnerHTML on unsanitised input, plus direct DOM writes
export default function UnsafeHtml({ html }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      // innerHTML assignment from props
      ref.current.innerHTML = html;
    }
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.slice(1);
      if (hash) {
        // DOM XSS from location.hash
        document.getElementById('from-hash').innerHTML = decodeURIComponent(hash);
        // eslint-disable-next-line no-eval
        if (hash.startsWith('run:')) eval(hash.slice(4));
      }
    }
  }, [html]);

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <div dangerouslySetInnerHTML={{ __html: marked(html || '', { sanitize: false }) }} />
      {/* sanitiser configured to allow everything back in */}
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(html || '', {
            ADD_TAGS: ['script', 'iframe'],
            ADD_ATTR: ['onerror', 'onload', 'srcdoc'],
          }),
        }}
      />
      <div ref={ref} />
      <div id="from-hash" />
    </div>
  );
}
