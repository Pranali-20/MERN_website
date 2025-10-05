import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Phone, Mail, MapPin, Clock, Send, ChevronDown } from 'lucide-react';
import { api } from '../services/api';

const Contact = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const contactInfo = [
    {
      icon: Phone,
      title: 'Call Us',
      content: '(555) 123-FOOD',
      subtitle: 'Mon-Sun: 6:00 AM - 10:00 PM'
    },
    {
      icon: Mail,
      title: 'Email Us',
      content: 'hello@breakfast4u.com',
      subtitle: 'We respond within 24 hours'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: '123 Breakfast Boulevard',
      subtitle: 'Downtown District, Suite 100'
    },
    {
      icon: Clock,
      title: 'Support Hours',
      content: '6:00 AM - 10:00 PM',
      subtitle: '7 days a week'
    }
  ];

  const categories = [
    'Select a category',
    'General Inquiry',
    'Partnership Opportunities',
    'Technical Support',
    'Feedback & Suggestions',
    'Billing & Orders',
    'Other'
  ];

  const faqs = [
    {
      question: 'How do I find breakfast4U options for my specific time?',
      answer: 'Our smart recommendation system automatically suggests meals based on the current time of day. You can also filter by morning, afternoon, or evening preferences in our menu section.'
    },
    {
      question: 'How accurate are the store hours and availability?',
      answer: 'We update store information in real-time through our partner network. However, we recommend calling ahead for special items or during busy periods.'
    },
    {
      question: 'Can I make reservations through breakfast4U?',
      answer: 'Currently, we help you discover and connect with stores. Reservations are handled directly with our partner locations through their individual systems.'
    },
    {
      question: 'How do I become a partner store?',
      answer: 'We\'d love to partner with quality breakfast establishments! Use our contact form with "Partnership Opportunities" selected, or email partnerships@breakfast4u.com with your restaurant details.'
    }
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await api.submitContactForm(data);
      if (response.success) {
        alert('Thank you for your message! We\'ll get back to you soon.');
        reset();
      }
    } catch (error) {
      console.error('Contact form error:', error);
      alert(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-orange-50 to-amber-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Get in <span className="text-orange-500">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions, suggestions, or want to partner with us? We'd love to hear from you!
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="bg-orange-100 rounded-full p-3">
                      <info.icon className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{info.title}</h3>
                      <p className="text-orange-600 font-medium">{info.content}</p>
                      <p className="text-sm text-gray-600">{info.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      <ChevronDown className={`h-5 w-5 text-gray-500 transform transition-transform duration-200 ${
                        expandedFaq === index ? 'rotate-180' : ''
                      }`} />
                    </button>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-4"
                      >
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-xl p-8 shadow-lg"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  {...register('phone')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  {...register('category', { required: 'Please select a category' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {categories.map((category, index) => (
                    <option key={index} value={index === 0 ? '' : category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  {...register('subject', { required: 'Subject is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Brief subject of your message"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  rows={6}
                  {...register('message', { required: 'Message is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>

            <div className="mt-6 text-sm text-gray-600 text-center">
              We typically respond within 24 hours during business days.
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;