import React from 'react'
import Layout from "@/components/layout"
import Head from "next/head"

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-gray-100 py-12 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">

        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Privacy Policy</h1>

        <hr className="h-px mb-6 bg-gray-200 border-0" />

        <p className="text-gray-700 mb-4">
          Your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our website.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-3">Information We Collect</h2>
        <p className="text-gray-700 mb-4">
          We may collect the following types of information:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>**Personal Information:** Such as your name, email address, and any other information you voluntarily provide when contacting us or using certain features.</li>
          <li>**Usage Data:** Information about how you interact with our website, including the pages you visit, the time spent on those pages, and other usage statistics.</li>
          <li>**Cookies and Similar Technologies:** We may use cookies and similar tracking technologies to enhance your browsing experience, personalize content, and analyze website traffic. You can manage your cookie preferences through your browser settings.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 mb-3">How We Use Your Information</h2>
        <p className="text-gray-700 mb-4">
          We may use your information for the following purposes:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>To provide and maintain our website and its features.</li>
          <li>To respond to your inquiries and provide customer support.</li>
          <li>To personalize your experience on our website.</li>
          <li>To analyze website usage and improve our services.</li>
          <li>To send you relevant updates and information (if you have opted in to receive them).</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 mb-3">Data Sharing and Disclosure</h2>
        <p className="text-gray-700 mb-4">
          We will not share your personal information with third parties except in the following limited circumstances:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>With service providers who assist us in operating our website and providing our services (e.g., hosting providers, analytics services). These providers are contractually obligated to protect your information.</li>
          <li>When required by law or legal process.</li>
          <li>To protect our rights and safety, or the rights and safety of others.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 mb-3">Your Rights</h2>
        <p className="text-gray-700 mb-4">
          Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete your data. Please contact us if you have any questions or requests regarding your rights.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-3">Security</h2>
        <p className="text-gray-700 mb-4">
          We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-3">Changes to This Privacy Policy</h2>
        <p className="text-gray-700 mb-4">
          We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on our website. Please review this page periodically for updates.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-3">Contact Us</h2>
        <p className="text-gray-700">
          If you have any questions or concerns about this Privacy Policy, please contact us at:
        </p>
        <p className="text-gray-700">
          Email: hermes@aionsigma.com
        </p>
        <p className="text-gray-700">
          Org: Hermes - Aion Sigma
        </p>

        <p className="text-gray-700 mt-6 text-sm">
          Last Updated: Apr 07, 2025
        </p>
      </div>
    </div>
  )
}

function PrivacyPolicy() {

  return (
    <Layout>

      <Head>
        <title>Privacy Policy - Hermes</title>
        <meta name="description" content="Upload, manage, and share professional information effortlessly." />
      </Head>

      <PrivacyPolicyPage />

    </Layout>
  )
}

export default PrivacyPolicy
