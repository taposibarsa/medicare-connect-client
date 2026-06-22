'use client';

import { useState } from 'react';
import { Mail, MapPin, PhoneCall, Send } from 'lucide-react';
import { Button } from '@heroui/react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = 'Enter a valid email';
    if (!form.subject.trim()) next.subject = 'Subject is required';
    if (!form.message.trim()) next.message = 'Message is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('');
    if (!validate()) return;

    console.log('Contact form submission:', form);
    setSuccess('Thank you! Your message has been received. We will get back to you soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-slate-50 py-12 dark:bg-[#0f172a] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white">Contact Us</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Have a question or need help? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900/60">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Get in Touch</h2>
            <ul className="mt-6 space-y-5">
              <li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                <MapPin size={20} className="mt-0.5 shrink-0 text-[#5e17eb]" />
                <span>123 Healthcare Ave, Medical District, NY 10001</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <PhoneCall size={20} className="shrink-0 text-[#5e17eb]" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Mail size={20} className="shrink-0 text-[#5e17eb]" />
                <span>support@medicareconnect.com</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900/60">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Send a Message</h2>

            {success && (
              <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-400">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {[
                { id: 'name', label: 'Name', type: 'text' },
                { id: 'email', label: 'Email', type: 'email' },
                { id: 'subject', label: 'Subject', type: 'text' },
              ].map(({ id, label, type }) => (
                <div key={id}>
                  <label
                    htmlFor={id}
                    className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    {label}
                  </label>
                  <input
                    id={id}
                    type={type}
                    value={form[id]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [id]: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-[#5e17eb] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  {errors[id] && <p className="mt-1 text-xs text-red-500">{errors[id]}</p>}
                </div>
              ))}

              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-[#5e17eb] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#5e17eb] py-6 text-base font-semibold text-white hover:bg-[#4a12bc]"
              >
                Send Message
                <Send size={18} className="ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
