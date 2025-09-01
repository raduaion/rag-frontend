import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'

const Help: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null),

    faq = [
      {
        question: "How do I upload a file?",
        answer: "Click on the \"Add New File\" button in the Files section, select your file, and categorize it."
      },
      {
        question: "How do I create a collection?",
        answer: "Navigate to the \"Your Collections\" section, click \"Create New Collection,\" select the files you want to include, and name your collection."
      },
      {
        question: "What does making an collection public mean?",
        answer: "Making a collection public allows other users to search and use your collection for their needs."
      },
      {
        question: "How can I search for public collections?",
        answer: "Use the search bar at the top of the application to look for collections shared by the community."
      },
      {
        question: "Is my data secure?",
        answer: "Yes, Hermes prioritizes data security and uses industry-standard encryption to protect your files and collections."
      },
      {
        question: "Can I organize my files into categories?",
        answer: "Yes, files can be categorized during upload to help you manage them better."
      },
      {
        question: "What happens if I delete a collection?",
        answer: "When you delete a collection, it will no longer be accessible or searchable by others."
      },
      {
        question: "Can I recover deleted files or collections?",
        answer: "Currently, deleted files and collections cannot be recovered. Please ensure you download any critical information before deleting."
      },
      {
        question: "How can I make a collection private again?",
        answer: "Navigate to the \"Your Collections\" section, select the public collection, and toggle the privacy option to make it private."
      },
      {
        question: "Can I collaborate on a collection with others?",
        answer: "Yes, you can share your collections privately with specific collaborators by providing them access."
      },
      {
        question: "What file formats are supported?",
        answer: "Hermes supports a variety of file formats, including PDFs, Word documents, Excel spreadsheets, and PowerPoint presentations."
      },
      {
        question: "Can I export my collections?",
        answer: "Yes, collections can be exported as structured data for use in other applications."
      },
      {
        question: "How do I provide feedback or request support?",
        answer: "You can use the \"Contact Us\" page to provide feedback or request technical support from our team."
      }
    ],

    toggleAnswer = (index: number) => {
      setOpenIndex(openIndex === index ? null : index);
    },

    router = useRouter()

    return (
      <div className="min-h-screen flex flex-col">
        <Head>
          <title>Help - Hermes</title>
        </Head>
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/img/HermesLogo.png" alt="Hermes Logo" className="h-16 -mt-4 -mb-4 mr-2" width={64} height={64}/>
            <h1 className="text-3xl font-bold">Help</h1>
          </div>
          <button
            className="bg-white text-blue-600 px-4 py-2 rounded"
            onClick={() => router.push('/')}
          >
            Back to Home
          </button>
        </header>
        <main className="flex-1 p-6 bg-gray-100">
          <section className="bg-white p-6 shadow rounded-lg max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <ul className="space-y-4">
              {faq.map((item, index) => (
                <li key={index} className="border-b pb-2">
                  <button
                    className="flex items-center justify-between w-full text-left text-lg font-bold text-blue-600 focus:outline-none"
                    onClick={() => toggleAnswer(index)}
                  >
                    {item.question}
                    <span>{openIndex === index ? "-" : "+"}</span>
                  </button>
                  {openIndex === index && <p className="mt-2 text-gray-700">{item.answer}</p>}
                </li>
              ))}
            </ul>
          </section>
        </main>
        <footer className="bg-gray-800 text-white text-center p-4">
          <p>&copy; 2025 Hermes</p>
        </footer>
      </div>
    )
  }

  export default Help
