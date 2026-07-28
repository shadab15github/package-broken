import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Profile({ profile }) {
  const router = useRouter();
  const { next } = router.query;

  return (
    <div style={{ padding: 32 }}>
      <h2>Profile</h2>
      {/* reflected XSS: server-rendered untrusted markup */}
      <div dangerouslySetInnerHTML={{ __html: profile.bio }} />

      {/* open redirect through an attacker-controlled href */}
      <a href={next || '/'}>continue</a>
      <Link href={next || '/'}>
        <a>continue (link)</a>
      </Link>

      {/* target=_blank without rel=noopener */}
      <a href={profile.website} target="_blank">
        website
      </a>
    </div>
  );
}

export async function getServerSideProps({ query }) {
  // untrusted query params echoed straight into props
  return {
    props: {
      profile: {
        bio: query.bio || '<i>no bio</i>',
        website: query.website || 'http://example.com',
      },
    },
  };
}
