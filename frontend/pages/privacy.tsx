import React from 'react';
import Head from 'next/head';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | TheCraftStudios</title>
        <meta name="description" content="Privacy Policy for TheCraftStudios — AI-powered content creation platform." />
      </Head>
      <NavBar />
      <main style={{ background: '#0A0A0A', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>

          {/* Header */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{
              display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em',
              color: '#E50914', border: '1px solid rgba(229,9,20,0.3)', padding: '6px 16px',
              marginBottom: '20px', textTransform: 'uppercase',
            }}>Legal</div>
            <h1 style={{ fontSize: '40px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>
              Privacy Policy
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
              Last updated: April 7, 2026
            </p>
          </div>

          {/* Content */}
          <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '16px', lineHeight: '1.8' }}>

            <Section title="1. Who We Are">
              <p>TheCraftStudios ("we", "our", "us") is an AI-powered content creation platform operated by TheCraftStudios, India. Our platform helps businesses create Instagram Reels, image posts, and social media content using artificial intelligence.</p>
              <p style={{ marginTop: '12px' }}>Website: <a href="https://thecraftstudios.in" style={{ color: '#E50914' }}>https://thecraftstudios.in</a><br />
              Contact: <a href="mailto:info@thecraftstudios.in" style={{ color: '#E50914' }}>info@thecraftstudios.in</a><br />
              Phone: +91 77605 01116</p>
            </Section>

            <Section title="2. Information We Collect">
              <p>We collect the following types of information:</p>
              <ul style={{ marginTop: '12px', paddingLeft: '24px' }}>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Account Information:</strong> Name, email address, and profile data when you sign in via Google or Facebook.</li>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Instagram / Facebook Data:</strong> When you connect your Instagram Business Account, we access your Instagram account ID, access tokens, and basic profile data to enable content posting on your behalf.</li>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Content You Create:</strong> Product descriptions, brand details, images you upload, and AI-generated content created on our platform.</li>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Usage Data:</strong> Pages visited, features used, and session data for improving our service.</li>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Payment Data:</strong> Transaction IDs and order details via Razorpay (we do not store card numbers or banking details).</li>
              </ul>
            </Section>

            <Section title="3. How We Use Your Information">
              <ul style={{ paddingLeft: '24px' }}>
                <li style={{ marginBottom: '8px' }}>To provide and operate our AI content generation service</li>
                <li style={{ marginBottom: '8px' }}>To post content to your Instagram Business Account when you request it</li>
                <li style={{ marginBottom: '8px' }}>To process payments and manage your credit balance</li>
                <li style={{ marginBottom: '8px' }}>To improve our AI models and platform features</li>
                <li style={{ marginBottom: '8px' }}>To send transactional emails and important service updates</li>
                <li style={{ marginBottom: '8px' }}>To comply with legal obligations</li>
              </ul>
            </Section>

            <Section title="4. Instagram / Facebook Permissions">
              <p>When you connect your Instagram Business Account, we request the following permissions:</p>
              <ul style={{ marginTop: '12px', paddingLeft: '24px' }}>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>instagram_business_basic:</strong> To read your Instagram Business account profile and information.</li>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>instagram_business_content_publish:</strong> To publish Reels and image posts to your account on your behalf.</li>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>instagram_business_manage_comments:</strong> To read comments on posts we publish for you.</li>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>pages_show_list / pages_read_engagement:</strong> To identify your connected Facebook Page linked to your Instagram Business Account.</li>
              </ul>
              <p style={{ marginTop: '16px' }}>We only post content when you explicitly click "Post to Instagram." We never post without your direct action. You can revoke these permissions at any time from your Facebook App Settings.</p>
            </Section>

            <Section title="5. Data Sharing">
              <p>We do not sell your personal data. We share data only with:</p>
              <ul style={{ marginTop: '12px', paddingLeft: '24px' }}>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Anthropic (Claude AI):</strong> Your product descriptions and brand content are processed to generate scripts and content.</li>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Replicate:</strong> Image and video generation prompts are sent to Replicate's AI models.</li>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>ElevenLabs:</strong> Text scripts are sent for voiceover generation.</li>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Razorpay:</strong> Payment processing for credit purchases.</li>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Meta (Instagram/Facebook):</strong> Content is posted to Instagram via the Meta Graph API when you request it.</li>
              </ul>
            </Section>

            <Section title="6. Data Retention">
              <p>We retain your account data and generated content for as long as your account is active. Generated images and videos are stored temporarily (up to 7 days) and then deleted. You may request deletion of your account and all associated data by emailing us at <a href="mailto:info@thecraftstudios.in" style={{ color: '#E50914' }}>info@thecraftstudios.in</a>.</p>
            </Section>

            <Section title="7. Cookies">
              <p>We use essential cookies to maintain your session and authentication state. We do not use third-party advertising cookies. You can disable cookies in your browser settings, but this may affect functionality.</p>
            </Section>

            <Section title="8. Your Rights">
              <p>You have the right to:</p>
              <ul style={{ marginTop: '12px', paddingLeft: '24px' }}>
                <li style={{ marginBottom: '8px' }}>Access the personal data we hold about you</li>
                <li style={{ marginBottom: '8px' }}>Request correction or deletion of your data</li>
                <li style={{ marginBottom: '8px' }}>Withdraw consent for Instagram posting at any time</li>
                <li style={{ marginBottom: '8px' }}>Object to processing of your personal data</li>
                <li style={{ marginBottom: '8px' }}>Data portability — request an export of your data</li>
              </ul>
              <p style={{ marginTop: '12px' }}>To exercise any of these rights, contact us at <a href="mailto:info@thecraftstudios.in" style={{ color: '#E50914' }}>info@thecraftstudios.in</a>.</p>
            </Section>

            <Section title="9. Security">
              <p>We use industry-standard security measures including HTTPS encryption, secure token storage, and rate limiting. Instagram access tokens are stored securely and never exposed to other users.</p>
            </Section>

            <Section title="10. Children's Privacy">
              <p>Our service is not directed to children under 13. We do not knowingly collect personal information from children.</p>
            </Section>

            <Section title="11. Changes to This Policy">
              <p>We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a notice on our platform. Continued use of our service after changes constitutes acceptance of the updated policy.</p>
            </Section>

            <Section title="12. Contact Us">
              <p>For any privacy-related questions or requests:</p>
              <div style={{ marginTop: '16px', padding: '20px', background: 'rgba(229,9,20,0.06)', border: '1px solid rgba(229,9,20,0.2)', borderRadius: '8px' }}>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: '#fff' }}>TheCraftStudios</strong><br />
                  Email: <a href="mailto:info@thecraftstudios.in" style={{ color: '#E50914' }}>info@thecraftstudios.in</a><br />
                  Phone: +91 77605 01116<br />
                  Website: <a href="https://thecraftstudios.in" style={{ color: '#E50914' }}>https://thecraftstudios.in</a>
                </p>
              </div>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '40px' }}>
      <h2 style={{
        fontSize: '20px', fontWeight: 700, color: '#FFFFFF',
        marginBottom: '16px', paddingBottom: '10px',
        borderBottom: '1px solid rgba(229,9,20,0.2)',
      }}>{title}</h2>
      {children}
    </div>
  );
}
