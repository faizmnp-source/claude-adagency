import React from 'react';
import Head from 'next/head';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Terms of Service | TheCraftStudios</title>
        <meta name="description" content="Terms of Service for TheCraftStudios — AI-powered content creation platform." />
      </Head>
      <NavBar />
      <main style={{ background: '#0A0A0A', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>

          <div style={{ marginBottom: '48px' }}>
            <div style={{
              display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em',
              color: '#E50914', border: '1px solid rgba(229,9,20,0.3)', padding: '6px 16px',
              marginBottom: '20px', textTransform: 'uppercase',
            }}>Legal</div>
            <h1 style={{ fontSize: '40px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>
              Terms of Service
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Last updated: April 7, 2026</p>
          </div>

          <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '16px', lineHeight: '1.8' }}>

            <Section title="1. Acceptance of Terms">
              <p>By using TheCraftStudios ("the Service"), you agree to these Terms of Service. If you do not agree, do not use the Service.</p>
            </Section>

            <Section title="2. Description of Service">
              <p>TheCraftStudios is an AI-powered content creation platform that helps businesses generate Instagram Reels, image posts, voiceovers, and social media content. The Service uses third-party AI models including Anthropic Claude, Replicate, and ElevenLabs.</p>
            </Section>

            <Section title="3. User Responsibilities">
              <ul style={{ paddingLeft: '24px' }}>
                <li style={{ marginBottom: '8px' }}>You must own or have rights to any product images you upload</li>
                <li style={{ marginBottom: '8px' }}>You are responsible for all content posted to Instagram through our platform</li>
                <li style={{ marginBottom: '8px' }}>You must comply with Instagram's Terms of Use and Community Guidelines</li>
                <li style={{ marginBottom: '8px' }}>You must not use the Service to create misleading, harmful, or illegal content</li>
                <li style={{ marginBottom: '8px' }}>You must be at least 18 years old to use the Service</li>
              </ul>
            </Section>

            <Section title="4. Credits and Payments">
              <p>The Service operates on a credit system. Credits are non-refundable once used. Unused credits do not expire. Payments are processed securely via Razorpay. All prices are in Indian Rupees (INR) unless stated otherwise.</p>
            </Section>

            <Section title="5. Instagram Integration">
              <p>When you connect your Instagram Business Account, you authorize TheCraftStudios to post content on your behalf only when you explicitly initiate a post. We do not post automatically without your action. You can disconnect your Instagram account at any time from your Facebook App Settings.</p>
            </Section>

            <Section title="6. Intellectual Property">
              <p>AI-generated content created through our platform is owned by you. You grant TheCraftStudios a limited license to process your content solely to provide the Service. We do not use your content to train AI models.</p>
            </Section>

            <Section title="7. Limitation of Liability">
              <p>TheCraftStudios is not liable for: (a) content posted to Instagram; (b) AI-generated content accuracy; (c) service interruptions; (d) third-party service failures. Our maximum liability is limited to the amount paid for the Service in the last 30 days.</p>
            </Section>

            <Section title="8. Termination">
              <p>We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time by contacting us at info@thecraftstudios.in.</p>
            </Section>

            <Section title="9. Governing Law">
              <p>These Terms are governed by the laws of India. Any disputes will be resolved in the courts of India.</p>
            </Section>

            <Section title="10. Contact">
              <div style={{ padding: '20px', background: 'rgba(229,9,20,0.06)', border: '1px solid rgba(229,9,20,0.2)', borderRadius: '8px' }}>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: '#fff' }}>TheCraftStudios</strong><br />
                  Email: <a href="mailto:info@thecraftstudios.in" style={{ color: '#E50914' }}>info@thecraftstudios.in</a><br />
                  Phone: +91 77605 01116
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
